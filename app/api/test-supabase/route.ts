import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Supabase環境変数が設定されていません",
          details: {
            NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "設定済み" : "未設定",
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "設定済み" : "未設定",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定",
          },
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    // 単純なクエリでテーブルの存在を確認
    const { data, error } = await supabase.from("transcriptions").select("*").limit(1)

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          message: "Supabaseに接続できましたが、テーブルが存在しません",
          details: error.message,
        })
      }

      return NextResponse.json(
        {
          error: "Supabase接続エラー",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabaseに正常に接続できました",
      tableExists: true,
    })
  } catch (error) {
    console.error("Supabase接続テストエラー:", error)
    return NextResponse.json(
      {
        error: "Supabase接続テスト中に予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
