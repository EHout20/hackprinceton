"use client";

import { useEffect, useState } from "react";
import { onAuthReady } from "@/lib/firebase";

export function useUser() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    onAuthReady((id) => setUid(id));
  }, []);

  return uid;
}
