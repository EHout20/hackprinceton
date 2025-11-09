"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  function saveName() {
    if (!name.trim()) return;
    const trimmed = name.trim();
    localStorage.setItem("playerName", trimmed);
    // visual confirmation in case of issues with navigation
    // navigate to play
    router.push("/play");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-4xl font-bold mb-6">Register</h1>

      <div className="w-full max-w-sm space-y-4">
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            // save on blur as a fallback
            if (name.trim()) localStorage.setItem("playerName", name.trim());
          }}
          className="text-black"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">Preview: <span className="text-white font-medium">{name || "(empty)"}</span></div>
          <Button type="button" onClick={saveName} className="w-32 py-3 text-lg">
            Continue
          </Button>
        </div>
      </div>
    </main>
  );
}
