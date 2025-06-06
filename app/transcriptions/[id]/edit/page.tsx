"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditTranscriptionPage({ params }: PageProps) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const id = params.id

  useEffect(() => {
    fetchTranscription()
  }, [id])

  const fetchTranscription = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/transcriptions/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "文字起こしの取得に失敗しました")
      }

      if (data.data) {
        setTitle(data.data.title || "")
        setContent(data.data.content || "")
      }
    } catch (error) {
      console.error("データ取得エラー:", error)
      setError(error instanceof Error ? error.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      setError("文字起こし内容を入力してください")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/transcriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || "無題の文字起こし",
          content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "更新に失敗しました")
      }

      alert("文字起こしを更新しました")
      router.push("/transcriptions")
    } catch (error) {
      console.error("更新エラー:", error)
      setError(error instanceof Error ? error.message : "不明なエラーが発生しました")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="container max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Link href="/transcriptions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>文字起こしの編集</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
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
                  className="min-h-[300px]"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                変更を保存
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
