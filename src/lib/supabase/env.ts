export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  // Supabase docs sometimes call this the "publishable" key; it's the anon key.
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return { url, anon, service };
}

