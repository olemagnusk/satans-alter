"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });
    setLoading(false);

    if (signInError) {
      setError("Invalid credentials");
      return;
    }

    router.push("/");
  }

  const iconPositions = useMemo(
    () => ({
      primary: {
        top: "35%",
        left: "95%",
        rotation: "-10deg"
      },
      frame: {
        top: "80%",
        left: "70%",
        rotation: "6deg"
      },
      topLeft: {
        top: "10%",
        left: "8%",
        rotation: "-4deg"
      },
      bottomLeft: {
        top: "88%",
        left: "3%",
        rotation: "-12deg"
      },
      behindCard: {
        top: "40%",
        left: "30%",
        rotation: "-5deg"
      },
      smallIcons: Array.from({ length: 15 }).map((_, index) => ({
        top: `${8 + Math.random() * 84}%`,
        left: `${5 + Math.random() * 90}%`,
        rotation: `${-30 + Math.random() * 60}deg`,
        scale: 0.6 + Math.random() * 0.6
      }))
    }),
    []
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/illustrations/tattoo-01.svg"
          alt=""
          className="absolute h-28 w-28 brightness-[0.65]"
          style={{
            top: iconPositions.primary.top,
            left: iconPositions.primary.left,
            transform: `translate(-50%, -50%) scale(8) rotate(${iconPositions.primary.rotation})`,
            opacity: 0.08
          }}
        />
        <img
          src="/illustrations/tattoo-03.svg"
          alt=""
          className="absolute h-24 w-24 brightness-[0.65]"
          style={{
            top: iconPositions.frame.top,
            left: iconPositions.frame.left,
            transform: `translate(-50%, -50%) scale(3) rotate(${iconPositions.frame.rotation})`,
            opacity: 0.08
          }}
        />
        <img
          src="/illustrations/tattoo-04.svg"
          alt=""
          className="absolute h-24 w-24 brightness-[0.65]"
          style={{
            top: iconPositions.topLeft.top,
            left: iconPositions.topLeft.left,
            transform: `translate(-50%, -50%) scale(3) rotate(${iconPositions.topLeft.rotation})`,
            opacity: 0.08
          }}
        />
        <img
          src="/illustrations/tattoo-05.svg"
          alt=""
          className="absolute h-24 w-24 brightness-[0.65]"
          style={{
            top: iconPositions.bottomLeft.top,
            left: iconPositions.bottomLeft.left,
            transform: `translate(-50%, -50%) scale(6) rotate(${iconPositions.bottomLeft.rotation})`,
            opacity: 0.08
          }}
        />
        <img
          src="/illustrations/tattoo-06.svg"
          alt=""
          className="absolute h-32 w-32 brightness-[0.65]"
          style={{
            top: iconPositions.behindCard.top,
            left: iconPositions.behindCard.left,
            transform: `translate(-50%, -50%) scale(2.45) rotate(${iconPositions.behindCard.rotation})`,
            opacity: 0.08
          }}
        />
        {iconPositions.smallIcons.map((icon, idx) => (
          <img
            key={idx}
            src="/illustrations/tattoo-07.svg"
            alt=""
            className="absolute h-10 w-10 brightness-[0.65]"
            style={{
              top: icon.top,
              left: icon.left,
              transform: `translate(-50%, -50%) scale(${icon.scale}) rotate(${icon.rotation})`,
              opacity: 0.08
            }}
          />
        ))}
      </div>
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-coven-border bg-coven-surface p-6 shadow-lg">
        <div className="space-y-1 text-center">
          <h1 className="_font-black-dread text-[50px] leading-none tracking-[0.08em] text-coven-text">
            SATANS ALTER
          </h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-coven-danger">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-coven-danger">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-xs text-coven-danger">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-xs text-coven-text-muted">
          Sign in with the shared credentials.
        </p>
      </div>
    </main>
  );
}
