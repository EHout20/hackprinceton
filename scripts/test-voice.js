import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testVoice() {
  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: "Hello, this is a voice test."
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync("test-voice.mp3", buffer);

  console.log("✅ test-voice.mp3 created");
}

testVoice();
