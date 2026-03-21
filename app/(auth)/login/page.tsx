"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

const loginSchema = z.object({
  email: z.string().min(1, t("login.email_required")),
  password: z.string().min(1, t("login.password_required"))
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

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError(t("login.invalid_credentials"));
      return;
    }

    window.location.href = "/dashboard";
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
          <img
            src="/branding/satans-alter-vertical.png"
            alt="Satans Alter"
            className="mx-auto h-[10.5rem] w-auto"
          />
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="email">{t("login.email_label")}</Label>
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
            <Label htmlFor="password">{t("login.password_label")}</Label>
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
            {loading ? t("login.signing_in") : t("login.sign_in_button")}
          </Button>
        </form>
        <p className="text-xs text-coven-text-muted">
          {t("login.hint")}
        </p>
      </div>
    </main>
  );
}
