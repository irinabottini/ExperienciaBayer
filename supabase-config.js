const SUPABASE_URL = "https://hinzmcyprqlltvuvjtis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1A7P-dMfSRw3bx2MT8M8sg_-zJKU1kb";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = supabaseClient;
