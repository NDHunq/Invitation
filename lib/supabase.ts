import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* ============================================
   SUPABASE CLIENT
   -------------------------------------------
   ⚠️ Thay thế giá trị trong file .env.local:
   - NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
   ============================================ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase client instance.
 * Sẽ hoạt động bình thường khi có URL & Key trong .env.local
 * Trong môi trường build/preview không có env, sẽ fail gracefully.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/** Kiểm tra Supabase đã được cấu hình chưa */
export const isSupabaseConfigured =
  !!supabaseUrl && supabaseUrl !== "https://placeholder.supabase.co";
