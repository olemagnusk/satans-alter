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
  "dashboard.avg_main_score": "Gjennomsnittlig hovedscore",
  "dashboard.most_frequent_venue": "Mest besøkte spillested",
  "dashboard.no_data": "Ingen data ennå",
  "dashboard.recent_concerts": "Siste konserter",
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
  "col.main": "Hoved (P/D/K)",
  "col.support_score": "Oppv. (P/D/K)",
  "col.attendees": "Deltakere",
  "col.standins": "Vikarer",
  "col.note": "Notat",

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

  // Validation
  "validation.band_required": "Bandnavn er påkrevd",
  "validation.date_required": "Dato er påkrevd",

  // Statistics page
  "stats.title": "Statistikk",
  "stats.total_concerts": "Totalt antall konserter",
  "stats.total_attendees": "Totalt antall deltakere",
  "stats.avg_main_score": "Gjennomsnittlig hovedscore",
  "stats.top_bands": "Topp band etter gjennomsnittsscore",
  "stats.no_scored": "Ingen konserter med score ennå.",

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
};

export function t(key: string): string {
  return nb[key] ?? key;
}
