import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // テーブル作成のSQLを実行
    const { error } = await supabaseServer.rpc("create_transcriptions_table")

    if (error) {
      return NextResponse.json(
        {
          error: "テーブル作成エラー",
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "transcriptionsテーブルが正常に作成されました",
    })
  } catch (error) {
    console.error("テーブル作成エラー:", error)
    return NextResponse.json(
      {
        error: "テーブル作成中に予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
