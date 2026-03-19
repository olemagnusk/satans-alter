-- Add per-member score columns and remove old aggregate scores

-- Per-member main scores
ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS score_main_andreas   integer CHECK (score_main_andreas   BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_main_dennis    integer CHECK (score_main_dennis    BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_main_magnus    integer CHECK (score_main_magnus    BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_andreas integer CHECK (score_support_andreas BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_dennis  integer CHECK (score_support_dennis  BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_magnus  integer CHECK (score_support_magnus  BETWEEN 1 AND 6);

-- Ensure stand_ins exists (may have been added in previous migration)
ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS stand_ins text[];

-- Drop old aggregate score columns
ALTER TABLE public.concerts
  DROP COLUMN IF EXISTS score_main,
  DROP COLUMN IF EXISTS score_support_1,
  DROP COLUMN IF EXISTS score_support_2;
