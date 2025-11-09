# Pose backend (MediaPipe + OpenCV)

This small backend provides pose tracking using MediaPipe and OpenCV in Python.

Features
- WebSocket `/ws` — send binary image frames (JPEG/PNG) and receive JSON landmarks per-frame.
- HTTP POST `/pose` — send a single image (multipart/form-data `image`) to get landmarks (useful for testing).

Requirements
- Python 3.9+ recommended
- See `requirements.txt` for pinned dependencies (FastAPI, uvicorn, mediapipe, opencv-python, numpy).

Install

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run server

```bash
# development
uvicorn app:app --host 0.0.0.0 --port 8000
```

Endpoints
- `POST /pose` — multipart form upload with a file field named `image`. Returns JSON `{landmarks: [...], has_pose: bool}`.
- `WS /ws` — Accepts binary messages containing a JPEG/PNG image. Server responds with JSON `{landmarks: [...], has_pose: bool}`.

Example frontend usage (browser)

This is a minimal example of capturing frames from a webcam and sending them to the WebSocket as JPEG blobs.

```javascript
// open websocket
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  console.log('ws open');
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    // data.landmarks is an array of {index,name,x,y,z,visibility}
    // do something with it
    console.log('pose', data);
  } catch (e) {
    console.error('invalid message', e);
  }
};

async function startAndSend() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement('video');
  video.autoplay = true;
  video.srcObject = stream;

  await new Promise((r) => (video.onloadedmetadata = r));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // send frames at ~10-15 FPS
  setInterval(async () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      // Send raw bytes over websocket
      const arrayBuffer = await blob.arrayBuffer();
      ws.send(arrayBuffer);
    }, 'image/jpeg', 0.8);
  }, 100);
}

startAndSend().catch(console.error);
```

Notes and caveats
- MediaPipe can be CPU intensive. For production or high‑FPS use, consider offloading to a GPU instance or using hardware acceleration.
- If you need very low-latency tracking, consider WebRTC-based approaches; this simple WebSocket approach is straightforward to integrate with a Next.js frontend.
- The `z` coordinate returned by MediaPipe is relative; interpreting depth may require calibration.

Next steps / Integration tips
- Add an authentication layer if exposing the server publicly.
- If you prefer a per-user session, include a small session token exchange when opening the WebSocket.
- Add rate limiting / backpressure handling for rapid frame sends.
