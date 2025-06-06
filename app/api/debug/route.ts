import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // 環境変数の確認
    const envVars = {
      POSTGRES_URL: process.env.POSTGRES_URL ? "設定済み" : "未設定",
      POSTGRES_USER: process.env.POSTGRES_USER ? "設定済み" : "未設定",
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? "設定済み" : "未設定",
      POSTGRES_HOST: process.env.POSTGRES_HOST ? "設定済み" : "未設定",
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? "設定済み" : "未設定",
      SUPABASE_URL: process.env.SUPABASE_URL ? "設定済み" : "未設定",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "設定済み" : "未設定",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "設定済み" : "未設定",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "設定済み" : "未設定",
    }

    // Supabaseへの接続テスト
    let supabaseTestResult = "テスト未実行"
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // 単純なクエリでテーブルの存在を確認
      const { data, error } = await supabase.from("transcriptions").select("*").limit(1)

      if (error) {
        if (error.code === "42P01") {
          supabaseTestResult = "接続成功: テーブルが存在しません"
        } else {
          supabaseTestResult = `接続エラー: ${error.message} (${error.code})`
        }
      } else {
        supabaseTestResult = `接続成功: テーブルが存在します`
      }
    } catch (supabaseError) {
      supabaseTestResult = `接続エラー: ${
        supabaseError instanceof Error ? supabaseError.message : String(supabaseError)
      }`
    }

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      environmentVariables: envVars,
      supabaseTest: supabaseTestResult,
    })
  } catch (error) {
    console.error("デバッグAPIエラー:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
