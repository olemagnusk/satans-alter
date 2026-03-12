"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { concertInputSchema, type ConcertInput, type ConcertFormValues } from "@/lib/validation/concert";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConcertFormProps = {
  withImages?: boolean;
};

export function ConcertForm({ withImages = true }: ConcertFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const form = useForm<ConcertFormValues, unknown, ConcertInput>({
    resolver: zodResolver(concertInputSchema),
    defaultValues: {
      bandName: "",
      supportBand1: "",
      supportBand2: "",
      booker: "",
      attendees: undefined,
      date: "",
      scoreMain: undefined,
      scoreSupport1: undefined,
      scoreSupport2: undefined,
      venue: "",
      alcoholLevel: undefined,
      note: ""
    }
  });

  async function onSubmit(values: ConcertInput) {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    let imagesPayload:
      | { storagePath: string; publicUrl: string }[]
      | undefined;

    if (withImages && imageFiles && imageFiles.length > 0) {
      const uploads: { storagePath: string; publicUrl: string }[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles.item(i);
        if (!file) continue;
        const path = `concerts/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("concert-images")
          .upload(path, file);
        if (uploadError) {
          setError("Failed to upload images. Please try again.");
          setLoading(false);
          return;
        }
        const {
          data: { publicUrl }
        } = supabase.storage.from("concert-images").getPublicUrl(path);
        uploads.push({ storagePath: path, publicUrl });
      }
      imagesPayload = uploads;
    }

    const { error: rpcError } = await supabase.functions.invoke(
      "create-concert",
      {
        body: {
          concert: values,
          images: imagesPayload
        }
      }
    );

    setLoading(false);

    if (rpcError) {
      setError("Something went wrong while saving. Please try again.");
      return;
    }

    router.push("/concerts");
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="bandName">Band name</Label>
          <Input
            id="bandName"
            {...form.register("bandName")}
          />
          {form.formState.errors.bandName && (
            <p className="text-xs text-coven-danger">
              {form.formState.errors.bandName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            {...form.register("date")}
          />
          {form.formState.errors.date && (
            <p className="text-xs text-coven-danger">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="supportBand1">Support band 1</Label>
          <Input
            id="supportBand1"
            {...form.register("supportBand1")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="supportBand2">Support band 2</Label>
          <Input
            id="supportBand2"
            {...form.register("supportBand2")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="booker">Booker</Label>
          <Input
            id="booker"
            {...form.register("booker")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="attendees">Attendees</Label>
          <Input
            id="attendees"
            type="number"
            min={0}
            {...form.register("attendees")}
          />
          {form.formState.errors.attendees && (
            <p className="text-xs text-coven-danger">
              {form.formState.errors.attendees as unknown as string}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="scoreMain">Score main band (1–6)</Label>
          <Input
            id="scoreMain"
            type="number"
            min={1}
            max={6}
            {...form.register("scoreMain", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="scoreSupport1">Score support 1 (1–6)</Label>
          <Input
            id="scoreSupport1"
            type="number"
            min={1}
            max={6}
            {...form.register("scoreSupport1", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="scoreSupport2">Score support 2 (1–6)</Label>
          <Input
            id="scoreSupport2"
            type="number"
            min={1}
            max={6}
            {...form.register("scoreSupport2", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            {...form.register("venue")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="alcoholLevel">Alcohol level (0–10)</Label>
          <Input
            id="alcoholLevel"
            type="number"
            min={0}
            max={10}
            {...form.register("alcoholLevel")}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          {...form.register("note")}
        />
      </div>
      {withImages && (
        <div className="space-y-1">
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles(e.target.files)}
          />
          <p className="text-[11px] text-coven-text-muted">
            On iOS and Android this will let you pick from Camera, Photos, and
            Google Photos (if linked).
          </p>
        </div>
      )}
      {error && <p className="text-xs text-coven-danger">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save concert"}
      </Button>
    </form>
  );
}

