"use client";

import { db } from "@/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function SubmitPose() {
  const params = useSearchParams();
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const userId = params.get("userId");
    const name = params.get("name") || "Player";
    const pose = params.get("pose") || "Unknown";

    if (!userId || done) return;

    (async () => {
      const ref = doc(db, "leaderboard", userId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // FIRST TIME USER
        await setDoc(ref, {
          name,
          completedCount: 1,
          totalAttempts: 1,
          accuracy: 1, // 1/1 success
          lastPose: pose,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        });
      } else {
        // EXISTING USER
        const prev = snap.data();
        const newCompleted = (prev.completedCount || 0) + 1;
        const newAttempts = (prev.totalAttempts || 0) + 1;

        await updateDoc(ref, {
          completedCount: newCompleted,
          totalAttempts: newAttempts,
          accuracy: newCompleted / newAttempts,
          lastPose: pose,
          lastUpdated: serverTimestamp(),
        });
      }

      setDone(true);
      setTimeout(() => router.push("/play"), 800);
    })();
  }, [params, done, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold">Pose Complete!</h1>
      <p className="opacity-80 mt-3">Updating leaderboard…</p>
    </main>
  );
}
