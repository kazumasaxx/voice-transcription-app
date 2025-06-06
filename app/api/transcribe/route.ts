import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { audio } = await request.json()

    if (!audio) {
      return NextResponse.json({ error: "音声データが見つかりません" }, { status: 400 })
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEYが設定されていません。環境変数を確認してください。" },
        { status: 500 },
      )
    }

    // Gemini APIにリクエストを送信
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "以下の音声を日本語で文字起こししてください。結果は生のテキストのみを返してください。",
                },
                {
                  inline_data: {
                    mime_type: "audio/webm",
                    data: audio,
                  },
                },
              ],
            },
          ],
          generation_config: {
            temperature: 0.2,
            top_p: 0.95,
            top_k: 40,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API エラー:", errorData)
      return NextResponse.json(
        { error: "Gemini APIエラー: " + (errorData.error?.message || "不明なエラー") },
        { status: 500 },
      )
    }

    const data = await response.json()

    // レスポンスから文字起こしテキストを抽出
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return NextResponse.json({ text })
  } catch (error) {
    console.error("文字起こしエラー:", error)
    return NextResponse.json({ error: "文字起こし処理中にエラーが発生しました" }, { status: 500 })
  }
}
