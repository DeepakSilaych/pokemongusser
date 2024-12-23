"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HeroSection() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="container mx-auto px-4 py-16 relative text-center">
        <h1 className="text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600">
          Pokémon Guesser
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Test your Pokémon knowledge by guessing them based on various hints! 
          Play casually or compete with others in ranked mode.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/game">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8"
            >
              Play Now
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/auth/register")}
              className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
            >
              Register
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => signIn(undefined, { callbackUrl: "/game" })}
              className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
