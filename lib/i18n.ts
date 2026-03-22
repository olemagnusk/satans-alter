/**
 * Simple i18n module for Norwegian translations.
 * All UI strings live here in a flat dictionary.
 * Future: add per-user overrides via localStorage or DB preferences.
 */

const nb: Record<string, string> = {
  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.concerts": "Konserter",
  "nav.statistics": "Statistikk",
  "nav.insights": "Innsikt",
  "nav.login": "Logg inn",

  // Auth / Login
  "login.email_required": "E-post er påkrevd",
  "login.password_required": "Passord er påkrevd",
  "login.invalid_credentials": "Feil innlogging",
  "login.signing_in": "Logger inn...",
  "login.sign_in_button": "Logg inn mitt dumme fjes",
  "login.hint": "Logg inn med delt brukernavn.",
  "login.email_label": "E-post",
  "login.password_label": "Passord",

  // Sidebar / user
  "auth.signed_in": "Innlogget",
  "auth.sign_out": "Logg ut",

  // Mobile nav
  "mobile.open_menu": "Åpne meny",
  "mobile.close_menu": "Lukk meny",

  // Dashboard page
  "dashboard.title": "Dashboard",
  "dashboard.total_concerts": "Totalt antall konserter",
  "dashboard.avg_main_score": "Gjennomsnittsscore hovedband",
  "dashboard.avg_support_score": "Gjennomsnittsscore oppvarmingsband",
  "dashboard.top_venues": "Topp tre konsertscener",
  "dashboard.visits": "besøk",
  "dashboard.no_data": "Ingen data ennå",
  "dashboard.recent_concerts": "Siste 5 konserter",
  "dashboard.see_all_concerts": "Se alle konserter",
  "dashboard.no_concerts_yet": "Ingen konserter ennå. Bruk Ny konsert-siden for å legge til den første.",
  "dashboard.new_concert": "Ny konsert",
  "dashboard.add_score": "Legg til score",
  "dashboard.close": "Lukk",

  // Next concert widget
  "next_concert.loading": "Laster...",
  "next_concert.title": "Neste konsert",
  "next_concert.passed": "Konserten er passert — velg ny dato",
  "next_concert.no_date": "Ingen dato satt",
  "next_concert.change": "Endre",
  "next_concert.pick_date": "Velg dato",
  "next_concert.today_message": "Det er Satans dag 🤟🍻🔥🎸",

  // Concerts page
  "concerts.title": "Konserter",
  "concerts.all": "Alle konserter",
  "concerts.new_title": "Ny konsert",
  "concerts.new_entry": "Ny konsert",

  // Concert table
  "table.search_placeholder": "Søk i konserter...",
  "table.toggle_columns": "Velg kolonner",
  "table.columns": "Kolonner",
  "table.condensed_view": "Kompakt visning",
  "table.expanded_view": "Utvidet visning",
  "table.clear_all": "Fjern alle",
  "table.no_match": "Ingen konserter matcher filtrene dine.",
  "table.no_concerts": "Ingen konserter ennå. Bruk Ny konsert-siden for å legge til den første.",
  "table.of": "av",
  "table.concerts": "konserter",
  "table.all": "Alle",

  // Table column headers
  "col.date": "Dato",
  "col.band": "Band",
  "col.support": "Oppvarming",
  "col.venue": "Spillested",
  "col.booker": "Booker",
  "col.main": "Main score",
  "col.support_score": "Support score",
  "col.attendees": "Deltakere",
  "col.standins": "Vikarer",
  "col.note": "Notat",
  "col.year": "År",

  // Concert form
  "form.band_name": "Bandnavn",
  "form.date": "Dato",
  "form.support_band_1": "Oppvarming 1",
  "form.support_band_2": "Oppvarming 2",
  "form.booker": "Booker",
  "form.attendees": "Deltakere",
  "form.standins": "Vikarer",
  "form.venue": "Spillested",
  "form.note": "Notat",
  "form.select_booker": "Velg booker...",
  "form.selected": "valgt",
  "form.select_attendees": "Velg deltakere...",
  "form.select_standins": "Velg vikarer...",
  "form.standins_count": "vikarer",
  "form.no_standins": "Ingen vikarer ennå. Legg til en ovenfor.",
  "form.add_standin": "Legg til vikar...",
  "form.pick_date": "Velg dato...",
  "form.select_venue": "Velg spillested...",
  "form.venue_name": "Navn på spillested...",
  "form.add": "Legg til",
  "form.add_new_venue": "Legg til nytt spillested",
  "form.saving": "Lagrer...",
  "form.save_concert": "Lagre konsert",
  "form.save_error": "Noe gikk galt under lagring. Prøv igjen.",
  "form.edit_concert": "Rediger konsert",
  "form.update_concert": "Oppdater konsert",
  "form.updating": "Oppdaterer...",
  "form.main_scores": "Hovedscore",
  "form.support_scores": "Oppvarmingsscore",
  "edit.action": "Rediger",
  "delete.action": "Slett",
  "delete.title": "Slett konsert",
  "delete.confirm_text": "Skriv bandnavnet for å bekrefte sletting:",
  "delete.placeholder": "Bandnavn...",
  "delete.button": "Slett permanent",
  "delete.deleting": "Sletter...",
  "delete.cancel": "Avbryt",
  "note.title": "Kommentar",
  "note.close": "Lukk",

  // Validation
  "validation.band_required": "Bandnavn er påkrevd",
  "validation.date_required": "Dato er påkrevd",

  // Statistics page
  "stats.title": "Statistikk",
  "stats.total_concerts": "Totalt antall konserter",
  "stats.avg_main_score": "Gjennomsnittsscore hovedband",
  "stats.avg_support_score": "Gjennomsnittsscore oppvarming",
  "stats.top_bands": "Topp band etter score",
  "stats.top_support": "Topp oppvarming etter score",
  "stats.avg_per_venue": "Gjennomsnittsscore per scene",
  "stats.score_over_time": "Main band gjennomsnittsscore",
  "stats.no_scored": "Ingen konserter med score ennå.",
  "stats.concerts_count_singular": "konsert",
  "stats.concerts_count_plural": "konserter",

  // Insights page
  "insights.title": "Innsikt",
  "insights.highlights": "Høydepunkter",
  "insights.empty": "Når du har konserter, vil denne siden automatisk vise interessante mønstre.",
  "insights.venue_hosted": "har hatt flest konserter.",
  "insights.band_leads": "leder med en gjennomsnittsscore på",
  "insights.top_3": "Topp 3 band",
  "insights.no_scored": "Ingen konserter med score ennå.",
  "insights.show": "konsert",
  "insights.shows": "konserter",
  "insights.venue_label": "Spillestedet",
  "insights.band_label": "Bandet",
  "insights.over": "over",

  // Score flow
  "score.title": "Legg til score",
  "score.no_concert": "Ingen konserter tilgjengelig for scoring din møkkamann",
  "score.no_concert_desc": "Score kan kun legges til innen 12 timer etter at en konsert er opprettet.",
  "score.back_to_dashboard": "Tilbake til Dashboard",
  "score.pick_member": "Hvem er du?",
  "score.rate_support": "Score oppvarming",
  "score.rate_main": "Score hovedband",
  "score.submit": "Send inn score",
  "score.submitting": "Sender...",
  "score.waiting_title": "Venter på de andre...",
  "score.waiting_desc": "Scorene dine er lagret. Venter til alle har sendt inn.",
  "score.has_submitted": "har sendt inn",
  "score.waiting_for": "venter...",
  "score.ready_title": "Alle har scoret!",
  "score.ready_desc": "Alle tre har sendt inn sine score.",
  "score.reveal_button": "Vis score",
  "score.waiting_booker": "Venter på at booker skal vise score...",
  "score.results_main": "Hovedband",
  "score.results_support": "Oppvarming",
  "score.average": "Snitt",
  "score.done": "Ferdig",
  "score.already_scored": "Du har allerede scoret denne konserten",
  "score.already_scored_desc": "Vent på at de andre skal bli ferdige.",
};

export function t(key: string): string {
  return nb[key] ?? key;
}
