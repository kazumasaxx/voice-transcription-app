import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 環境変数のチェック
if (typeof window === "undefined") {
  // サーバーサイドでのみログを出力
  console.log("Supabase環境変数チェック:", {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "設定済み" : "未設定",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "設定済み" : "未設定",
  })
}

// サーバーサイド用のクライアント
export const supabaseServer = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: { persistSession: false },
})

// クライアントサイド用のシングルトンパターン
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowser = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase環境変数が設定されていません")
    }
    supabaseInstance = createClient(supabaseUrl || "", supabaseAnonKey || "")
  }
  return supabaseInstance
}
