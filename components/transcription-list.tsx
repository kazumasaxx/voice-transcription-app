"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, FileText, Loader2 } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Transcription {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export function TranscriptionList() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTranscriptions()
  }, [])

  const fetchTranscriptions = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowser()

      const { data, error } = await supabase
        .from("transcriptions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setTranscriptions(data || [])
    } catch (error) {
      console.error("データ取得エラー:", error)
      alert("文字起こしデータの取得に失敗しました")
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
      const supabase = getSupabaseBrowser()

      const { error } = await supabase.from("transcriptions").delete().eq("id", id)

      if (error) {
        throw error
      }

      setTranscriptions((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました")
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (transcriptions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">文字起こしデータがありません</p>
        <p className="mb-4">新しい文字起こしを作成してください</p>
        <Button onClick={() => router.push("/")}>新規文字起こし</Button>
      </div>
    )
  }

  return (
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
  )
}
