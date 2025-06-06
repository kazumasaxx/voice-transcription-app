"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Edit, Trash2, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transcription {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export default function TranscriptionsPage() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchTranscriptions()
  }, [])

  const fetchTranscriptions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/transcriptions")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "文字起こし一覧の取得に失敗しました")
      }

      setTranscriptions(data.data || [])
    } catch (error) {
      console.error("データ取得エラー:", error)
      setError(error instanceof Error ? error.message : "不明なエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("この文字起こしを削除してもよろしいですか？")) {
      return
    }

    setIsDeleting(id)

    try {
      const response = await fetch(`/api/transcriptions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "削除に失敗しました")
      }

      setTranscriptions((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました: " + (error instanceof Error ? error.message : "不明なエラー"))
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <main className="container max-w-3xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">文字起こし一覧</h1>
        <Button asChild>
          <Link href="/">
            <Mic className="mr-2 h-4 w-4" />
            新規文字起こし
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : transcriptions.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">文字起こしデータがありません</p>
          <p className="mb-4">新しい文字起こしを作成してください</p>
          <Button asChild>
            <Link href="/">新規文字起こし</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {transcriptions.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/transcriptions/${item.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">編集</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                    >
                      {isDeleting === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{formatDate(item.updated_at)}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
