import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

type ConcertPayload = {
  bandName: string;
  supportBand1?: string;
  supportBand2?: string;
  booker?: string;
  attendees?: string[];
  standIns?: string[];
  date: string;
  venue?: string;
  note?: string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const json = await req.json().catch(() => null);
    if (!json || typeof json !== "object" || !("concert" in json)) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: expected { concert: {...} }" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const concert = json.concert as ConcertPayload;

    if (!concert.bandName || !concert.date) {
      return new Response(
        JSON.stringify({ error: "bandName and date are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!url || !anonKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
      return new Response(
        JSON.stringify({ error: "Supabase env vars not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    const { data, error } = await supabase
      .from("concerts")
      .insert({
        band_name: concert.bandName,
        support_band_1: concert.supportBand1 || null,
        support_band_2: concert.supportBand2 || null,
        booker: concert.booker || null,
        attendees: concert.attendees && concert.attendees.length
          ? concert.attendees
          : null,
        stand_ins: concert.standIns && concert.standIns.length
          ? concert.standIns
          : null,
        date: concert.date,
        venue: concert.venue || null,
        note: concert.note || null,
        images: null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("create-concert insert error", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ concert: data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-concert unexpected error", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

