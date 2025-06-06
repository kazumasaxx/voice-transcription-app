import { createClient } from "@supabase/supabase-js"

// Supabaseクライアントの作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// サーバーサイド用のクライアント
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

// データベース接続をテストする関数
export async function testConnection() {
  try {
    // 単純なクエリでテーブルの存在を確認
    const { data, error } = await supabase.from("transcriptions").select("*").limit(1)

    if (error) {
      // テーブルが存在しない場合は作成を試みる
      if (error.code === "42P01") {
        await createTranscriptionsTable()
        return { success: true, message: "テーブルが存在しなかったため作成を試みました" }
      }
      throw error
    }

    // 現在時刻を取得
    const now = new Date().toISOString()

    return { success: true, timestamp: now, message: "テーブルに接続できました" }
  } catch (error) {
    console.error("データベース接続テストエラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// テーブルを作成する関数
export async function createTranscriptionsTable() {
  try {
    // Supabaseの場合、SQLクエリを直接実行するにはrpcを使用
    // しかし、rpcが使えない場合もあるので、エラーをキャッチして処理を続行
    try {
      const { error } = await supabase.rpc("create_transcriptions_table", {})
      if (!error) {
        return { success: true }
      }
    } catch (rpcError) {
      console.log("RPCでのテーブル作成に失敗しました:", rpcError)
    }

    // テーブルの存在確認
    const { error: checkError } = await supabase.from("transcriptions").select("*").limit(1)

    if (checkError && checkError.code === "42P01") {
      // テーブルが存在しない場合、メッセージを返す
      return {
        success: false,
        error: "テーブルが存在しません。Supabaseダッシュボードでテーブルを作成してください。",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("テーブル作成エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 文字起こしを保存する関数
export async function saveTranscription(title: string, content: string) {
  try {
    const { data, error } = await supabase
      .from("transcriptions")
      .insert([
        {
          title: title || "無題の文字起こし",
          content,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error("文字起こし保存エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 文字起こし一覧を取得する関数
export async function getTranscriptions() {
  try {
    const { data, error } = await supabase.from("transcriptions").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("文字起こし一覧取得エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 文字起こしを取得する関数
export async function getTranscription(id: string) {
  try {
    const { data, error } = await supabase.from("transcriptions").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "文字起こしが見つかりません" }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("文字起こし取得エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 文字起こしを更新する関数
export async function updateTranscription(id: string, title: string, content: string) {
  try {
    const { data, error } = await supabase
      .from("transcriptions")
      .update({
        title: title || "無題の文字起こし",
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "文字起こしが見つかりません" }
      }
      throw error
    }

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error("文字起こし更新エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 文字起こしを削除する関数
export async function deleteTranscription(id: string) {
  try {
    const { data, error } = await supabase.from("transcriptions").delete().eq("id", id).select()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "文字起こしが見つかりません" }
      }
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("文字起こし削除エラー:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
