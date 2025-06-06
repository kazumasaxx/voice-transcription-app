import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 環境変数の確認（値は表示せず、存在確認のみ）
    const envCheck = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "設定済み" : "未設定",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "設定済み" : "未設定",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "設定済み" : "未設定",
    }

    // APIキーの最初の数文字のみ表示（セキュリティのため）
    const apiKeyPrefix = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 8) + "..." : "なし"

    return NextResponse.json({
      success: true,
      message: "環境変数の読み込みテスト",
      environmentVariables: envCheck,
      geminiApiKeyPrefix: apiKeyPrefix,
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("環境変数テストエラー:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
