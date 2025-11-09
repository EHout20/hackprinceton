import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">Hole In The Wall</h1>
      <p className="text-lg mb-10 opacity-80">
        Match the pose. Beat the clock. Climb the leaderboard.
      </p>

      <div className="flex gap-4">
        <Link href="/register">
          <Button size="lg" className="px-10 py-6 text-lg">
            Register
          </Button>
        </Link>

        <Link href="/play">
          <Button size="lg" variant="secondary" className="px-10 py-6 text-lg">
            Play Game
          </Button>
        </Link>
      </div>

      <Link href="/leaderboard" className="mt-10 underline opacity-80 text-sm">
        View Leaderboard
      </Link>
    </main>
  );
}
