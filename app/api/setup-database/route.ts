import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    // テーブルの存在確認
    const { error: checkError } = await supabase.from("transcriptions").select("*").limit(1)

    if (checkError && checkError.code === "42P01") {
      // テーブルが存在しない場合、テーブルを作成
      // 注意: これは実際には機能しない可能性があります。Supabaseでは通常、SQLエディタまたはマイグレーションを使用してテーブルを作成します
      console.log("テーブルが存在しないため、作成を試みます")

      // Supabaseダッシュボードで実行するSQLの例を返す
      return NextResponse.json({
        success: false,
        message: "テーブルが存在しません。Supabaseダッシュボードで以下のSQLを実行してください。",
        sql: `
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSポリシーを設定（すべてのユーザーが読み書き可能）
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to transcriptions" ON transcriptions
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "テーブルが既に存在します",
    })
  } catch (error) {
    console.error("データベースセットアップエラー:", error)
    return NextResponse.json(
      {
        error: "データベースセットアップ中に予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
