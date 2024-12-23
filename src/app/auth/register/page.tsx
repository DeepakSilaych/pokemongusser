"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push("/auth/signin");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Join the Adventure</h1>
        <p className="text-gray-400 text-center mb-6">Create your account and start guessing Pokémon!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="username"
              placeholder="Choose a username"
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Create a strong password"
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Creating Your Trainer Profile..." : "Become a Pokémon Trainer"}
          </Button>
          <p className="text-center text-sm text-gray-400">
            Already a seasoned trainer?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="text-violet-400 hover:text-violet-300 transition-colors duration-300"
            >
              Sign in to your account
            </button>
          </p>
        </form>
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-center text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy.
            Your adventure in the world of Pokémon awaits!
          </p>
        </div>
      </Card>
    </div>
  );
}
