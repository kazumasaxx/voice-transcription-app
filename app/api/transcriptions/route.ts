import { NextResponse } from "next/server"
import { saveTranscription, getTranscriptions } from "@/lib/db-client"

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "文字起こし内容は必須です" }, { status: 400 })
    }

    const result = await saveTranscription(title, content)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("文字起こし保存エラー:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "不明なエラーが発生しました" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const result = await getTranscriptions()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("文字起こし一覧取得エラー:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "不明なエラーが発生しました" },
      { status: 500 },
    )
  }
}
