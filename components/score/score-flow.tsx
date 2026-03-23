"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Star, ArrowLeft, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MEMBERS, displayName } from "@/lib/members";
import { t } from "@/lib/i18n";
import {
  submitScoresAction,
  getScoreStatusAction,
  revealScoresAction,
  revertScoresAction,
} from "@/app/(dashboard)/score/actions";
import type { Concert } from "@/lib/validation/concert";

type Step = "pick-member" | "score-support" | "score-main" | "submitting" | "waiting" | "results";

function ScoreButton({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold transition sm:h-14 sm:w-14 sm:text-lg ${
        selected
          ? "bg-coven-primary text-white scale-110 shadow-lg shadow-coven-primary/30"
          : "bg-coven-active text-coven-text-muted hover:bg-coven-border hover:text-coven-text"
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function ScoreSelector({
  label,
  bandName,
  value,
  onChange,
}: {
  label: string;
  bandName: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm text-coven-text-muted">{label}</p>
        <h3 className="mt-1 text-xl font-bold text-coven-text">{bandName}</h3>
      </div>
      <div className="flex gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <ScoreButton
            key={n}
            value={n}
            selected={value === n}
            onClick={() => onChange(n)}
          />
        ))}
      </div>
    </div>
  );
}

function MemberPicker({
  onPick,
  alreadySubmitted,
}: {
  onPick: (dbName: string) => void;
  alreadySubmitted: { andreas: boolean; dennis: boolean; magnus: boolean };
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold text-coven-text">{t("score.pick_member")}</h2>
      <div className="grid w-full max-w-xs gap-3">
        {MEMBERS.map((m) => {
          const submitted = alreadySubmitted[m.dbName.toLowerCase() as keyof typeof alreadySubmitted];
          return (
            <button
              key={m.dbName}
              type="button"
              disabled={submitted}
              className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition ${
                submitted
                  ? "border-coven-border bg-coven-active text-coven-text-muted opacity-60 cursor-not-allowed"
                  : "border-coven-border bg-coven-surface text-coven-text hover:border-coven-primary hover:bg-coven-primary/5"
              }`}
              onClick={() => onPick(m.dbName)}
            >
              <span className="text-lg font-semibold">{m.nickname}</span>
              {submitted && (
                <span className="flex items-center gap-1.5 text-xs text-coven-text-muted">
                  <Check className="h-4 w-4" />
                  {t("score.has_submitted")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WaitingScreen({
  submitted,
  isBooker,
  allSubmitted,
  revealed,
  onReveal,
  revealLoading,
}: {
  submitted: { andreas: boolean; dennis: boolean; magnus: boolean };
  isBooker: boolean;
  allSubmitted: boolean;
  revealed: boolean;
  onReveal: () => void;
  revealLoading: boolean;
}) {
  if (revealed) return null;

  // Non-booker: show thank you message instead of full status
  if (!isBooker) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coven-active">
          <Check className="h-8 w-8 text-coven-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-coven-text">
            {t("score.thank_you_title")}
          </h2>
          <p className="mt-1 text-sm text-coven-text-muted">
            {t("score.thank_you_desc")}
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          {MEMBERS.map((m) => {
            const done = submitted[m.dbName.toLowerCase() as keyof typeof submitted];
            return (
              <div
                key={m.dbName}
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                  done ? "bg-coven-primary/10" : "bg-coven-active"
                }`}
              >
                <span className={`font-medium ${done ? "text-coven-primary" : "text-coven-text-muted"}`}>
                  {m.nickname}
                </span>
                {done ? (
                  <Check className="h-4 w-4 text-coven-primary" />
                ) : (
                  <span className="text-xs text-coven-text-muted">{t("score.waiting_for")}</span>
                )}
              </div>
            );
          })}
        </div>
        {allSubmitted && (
          <p className="text-sm text-coven-text-muted">{t("score.waiting_booker")}</p>
        )}
      </div>
    );
  }

  // Booker: show full status with reveal button
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coven-active">
        {allSubmitted ? (
          <Star className="h-8 w-8 text-coven-primary" />
        ) : (
          <Clock className="h-8 w-8 text-coven-text-muted animate-pulse" />
        )}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-coven-text">
          {allSubmitted ? t("score.ready_title") : t("score.waiting_title")}
        </h2>
        <p className="mt-1 text-sm text-coven-text-muted">
          {allSubmitted ? t("score.ready_desc") : t("score.waiting_desc")}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        {MEMBERS.map((m) => {
          const done = submitted[m.dbName.toLowerCase() as keyof typeof submitted];
          return (
            <div
              key={m.dbName}
              className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                done ? "bg-coven-primary/10" : "bg-coven-active"
              }`}
            >
              <span className={`font-medium ${done ? "text-coven-primary" : "text-coven-text-muted"}`}>
                {m.nickname}
              </span>
              {done ? (
                <Check className="h-4 w-4 text-coven-primary" />
              ) : (
                <span className="text-xs text-coven-text-muted">{t("score.waiting_for")}</span>
              )}
            </div>
          );
        })}
      </div>

      {allSubmitted && (
        <Button
          onClick={onReveal}
          disabled={revealLoading}
          className="mt-2 w-full max-w-xs"
        >
          {t("score.reveal_button")}
        </Button>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  scores,
}: {
  title: string;
  scores: { nickname: string; score: number | null }[];
}) {
  function avg(vals: (number | null)[]): string {
    const valid = vals.filter((s): s is number => s != null);
    if (valid.length === 0) return "–";
    return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
  }

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="pt-4">
        <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-coven-text-muted">
          {title}
        </h3>
        <div className="space-y-2">
          {scores.map((s) => (
            <div key={s.nickname} className="flex items-center justify-between rounded-lg bg-coven-active px-4 py-2.5">
              <span className="text-sm font-medium text-coven-text">{s.nickname}</span>
              <span className="text-lg font-bold text-coven-primary">{s.score ?? "–"}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg bg-coven-primary/10 px-4 py-2.5">
            <span className="text-sm font-semibold text-coven-primary">{t("score.average")}</span>
            <span className="text-lg font-bold text-coven-primary">
              {avg(scores.map((s) => s.score))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultsScreen({ concert }: { concert: Concert }) {
  const router = useRouter();
  const [resultsStep, setResultsStep] = useState<"support" | "main">("support");

  const mainScores = [
    { nickname: "Pilsen", score: concert.score_main_andreas },
    { nickname: "Djen", score: concert.score_main_dennis },
    { nickname: "Krem", score: concert.score_main_magnus },
  ];

  const supportScores = [
    { nickname: "Pilsen", score: concert.score_support_andreas },
    { nickname: "Djen", score: concert.score_support_dennis },
    { nickname: "Krem", score: concert.score_support_magnus },
  ];

  const hasSupport = supportScores.some((s) => s.score != null);

  // If no support band, skip straight to main
  const showSupport = hasSupport && resultsStep === "support";
  const showMain = !hasSupport || resultsStep === "main";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-coven-text">
          {showSupport ? concert.support_band_1 : concert.band_name}
        </h2>
        <p className="text-sm text-coven-text-muted">
          {concert.date.split("-").reverse().join(".")}
          {concert.venue ? ` — ${concert.venue}` : ""}
        </p>
      </div>

      {showSupport && (
        <>
          <ScoreCard
            title={`${t("score.results_support")} — ${concert.support_band_1}`}
            scores={supportScores}
          />
          <Button
            onClick={() => setResultsStep("main")}
            className="w-full max-w-xs"
          >
            Gå til {concert.band_name}
          </Button>
        </>
      )}

      {showMain && (
        <>
          <ScoreCard
            title={t("score.results_main")}
            scores={mainScores}
          />
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full max-w-xs"
          >
            {t("score.done")}
          </Button>
        </>
      )}
    </div>
  );
}

export function ScoreFlow({ concert }: { concert: Concert }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("pick-member");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [supportScore, setSupportScore] = useState<number | null>(null);
  const [mainScore, setMainScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revertLoading, setRevertLoading] = useState(false);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  // Polling state
  const [submitted, setSubmitted] = useState({
    andreas: concert.score_main_andreas != null,
    dennis: concert.score_main_dennis != null,
    magnus: concert.score_main_magnus != null,
  });
  const [allSubmitted, setAllSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(concert.scores_revealed);
  const [latestConcert, setLatestConcert] = useState(concert);

  const hasSupport = !!concert.support_band_1;
  const isBooker = selectedMember
    ? concert.booker?.toLowerCase() === selectedMember.toLowerCase()
    : false;

  const pollStatus = useCallback(async () => {
    try {
      const status = await getScoreStatusAction(concert.id);
      setSubmitted(status.submitted);
      setAllSubmitted(status.allSubmitted);
      setRevealed(status.revealed);
      setLatestConcert(status.concert);
    } catch {
      // silently ignore polling errors
    }
  }, [concert.id]);

  // Poll while waiting
  useEffect(() => {
    if (step !== "waiting") return;
    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [step, pollStatus]);

  // Auto-advance when revealed: booker sees results, others go to dashboard
  useEffect(() => {
    if (revealed && step === "waiting") {
      if (isBooker) {
        setStep("results");
      } else {
        router.push("/dashboard");
      }
    }
  }, [revealed, step, isBooker, router]);

  function handlePickMember(dbName: string) {
    setSelectedMember(dbName);
    const memberKey = dbName.toLowerCase() as keyof typeof submitted;
    if (submitted[memberKey]) {
      // Already submitted — go straight to waiting
      setStep("waiting");
    } else if (hasSupport) {
      setStep("score-support");
    } else {
      setStep("score-main");
    }
  }

  async function handleSubmit() {
    if (!selectedMember || mainScore == null) return;
    setLoading(true);
    try {
      await submitScoresAction(
        concert.id,
        selectedMember.toLowerCase() as "andreas" | "dennis" | "magnus",
        mainScore,
        supportScore
      );
      await pollStatus();
      setStep("waiting");
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  }

  async function handleReveal() {
    setRevealLoading(true);
    try {
      await revealScoresAction(concert.id);
      await pollStatus();
    } catch {
      // error
    } finally {
      setRevealLoading(false);
    }
  }

  async function handleRevert() {
    setRevertLoading(true);
    try {
      await revertScoresAction(concert.id);
      // Reset local state
      setSubmitted({ andreas: false, dennis: false, magnus: false });
      setAllSubmitted(false);
      setRevealed(false);
      setSupportScore(null);
      setMainScore(null);
      setSelectedMember(null);
      setShowRevertConfirm(false);
      setStep("pick-member");
    } catch {
      // error
    } finally {
      setRevertLoading(false);
    }
  }

  function handleClose() {
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-8">
      {/* Top bar: Close + Revert */}
      <div className="mb-4 flex w-full max-w-xs items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-coven-text-muted transition hover:text-coven-text"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          {t("score.close")}
        </button>
        {step !== "results" && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-red-400/70 transition hover:text-red-400"
            onClick={() => setShowRevertConfirm(true)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("score.revert")}
          </button>
        )}
      </div>

      {/* Revert confirmation */}
      {showRevertConfirm && (
        <div className="mb-6 w-full max-w-xs rounded-xl border border-red-400/30 bg-red-400/5 p-4">
          <p className="mb-3 text-sm text-coven-text">
            {t("score.revert_confirm")}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRevertConfirm(false)}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              size="sm"
              disabled={revertLoading}
              onClick={handleRevert}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {revertLoading ? t("score.reverting") : t("score.revert")}
            </Button>
          </div>
        </div>
      )}

      {/* Concert info header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-coven-text">{concert.band_name}</h1>
        <p className="mt-1 text-sm text-coven-text-muted">
          {concert.date.split("-").reverse().join(".")}
          {concert.venue ? ` — ${concert.venue}` : ""}
        </p>
      </div>

      {step === "pick-member" && (
        <MemberPicker onPick={handlePickMember} alreadySubmitted={submitted} />
      )}

      {step === "score-support" && (
        <div className="flex w-full flex-col items-center gap-8">
          <ScoreSelector
            label={t("score.rate_support")}
            bandName={concert.support_band_1!}
            value={supportScore}
            onChange={setSupportScore}
          />
          <Button
            disabled={supportScore == null}
            onClick={() => setStep("score-main")}
            className="w-full max-w-xs"
          >
            {t("score.next")}
          </Button>
        </div>
      )}

      {step === "score-main" && (
        <div className="flex w-full flex-col items-center gap-8">
          {hasSupport && (
            <button
              type="button"
              className="flex items-center gap-1.5 self-start text-sm text-coven-text-muted hover:text-coven-text transition"
              onClick={() => setStep("score-support")}
            >
              <ArrowLeft className="h-4 w-4" />
              Tilbake
            </button>
          )}
          <ScoreSelector
            label={t("score.rate_main")}
            bandName={concert.band_name}
            value={mainScore}
            onChange={setMainScore}
          />
          <Button
            disabled={mainScore == null || loading}
            onClick={handleSubmit}
            className="w-full max-w-xs"
          >
            {loading ? t("score.submitting") : t("score.submit")}
          </Button>
        </div>
      )}

      {step === "waiting" && (
        <WaitingScreen
          submitted={submitted}
          isBooker={isBooker}
          allSubmitted={allSubmitted}
          revealed={revealed}
          onReveal={handleReveal}
          revealLoading={revealLoading}
        />
      )}

      {step === "results" && <ResultsScreen concert={latestConcert} />}
    </div>
  );
}
