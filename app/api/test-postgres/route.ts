import { NextResponse } from "next/server"
import { testConnection, createTranscriptionsTable } from "@/lib/db-client"

export async function GET() {
  try {
    // Supabase接続テスト
    const connectionResult = await testConnection()

    if (!connectionResult.success) {
      return NextResponse.json(
        {
          error: "Supabase接続エラー",
          details: connectionResult.error,
          env: {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "設定済み" : "未設定",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定",
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "設定済み" : "未設定",
          },
        },
        { status: 500 },
      )
    }

    // テーブル作成テスト
    const tableResult = await createTranscriptionsTable()

    if (!tableResult.success) {
      return NextResponse.json(
        {
          error: "テーブル作成エラー",
          details: tableResult.error,
          connectionSuccess: true,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabaseに正常に接続し、テーブルを確認しました",
      data: connectionResult,
    })
  } catch (error) {
    console.error("Supabase接続テストエラー:", error)
    return NextResponse.json(
      {
        error: "Supabase接続テスト中に予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
