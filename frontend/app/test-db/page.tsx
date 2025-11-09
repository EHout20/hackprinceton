"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default function TestDB() {
  const [status, setStatus] = useState("Testing…");

  useEffect(() => {
    async function runTest() {
      try {
        // 1. Write test doc
        const ref = await addDoc(collection(db, "test"), {
          message: "Hello Firebase!",
          time: serverTimestamp(),
        });

        // 2. Read the collection
        const snap = await getDocs(collection(db, "test"));

        console.log("Docs:", snap.docs.map((d) => d.data()));

        setStatus("✅ Connected! Firestore read/write works.");
      } catch (err) {
        console.error(err);
        setStatus("❌ Error connecting to Firestore — check console.");
      }
    }

    runTest();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center text-white bg-black">
      <h1 className="text-2xl font-bold">{status}</h1>
    </main>
  );
}
