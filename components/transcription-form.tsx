"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TranscriptionFormProps {
  transcription: string
}

export function TranscriptionForm({ transcription }: TranscriptionFormProps) {
  const [content, setContent] = useState(transcription)
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!content.trim()) {
      setError("文字起こし内容を入力してください")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // 直接APIエンドポイントを使用して保存
      const response = await fetch("/api/transcriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || "無題の文字起こし",
          content,
        }),
      })

      // レスポンスがJSONでない場合の処理
      if (!response.ok) {
        let errorMessage = `保存に失敗しました: ${response.status} ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          // JSONでない場合はテキストを取得
          try {
            const text = await response.text()
            errorMessage = `保存に失敗しました: ${text.substring(0, 100)}...`
          } catch (textError) {
            // テキストも取得できない場合
            errorMessage = `保存に失敗しました: ${response.status} ${response.statusText}`
          }
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      alert("文字起こしを保存しました")
      router.push("/transcriptions")
    } catch (error) {
      console.error("保存エラー:", error)
      setError(error instanceof Error ? error.message : "不明なエラーが発生しました")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>文字起こし結果の確認</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            placeholder="文字起こしのタイトルを入力"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">文字起こし内容</Label>
          <Textarea
            id="content"
            placeholder="文字起こし内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              保存する
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
