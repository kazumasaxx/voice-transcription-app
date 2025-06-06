"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface TranscriptionEditFormProps {
  id: string
}

export function TranscriptionEditForm({ id }: TranscriptionEditFormProps) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTranscription()
  }, [id])

  const fetchTranscription = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowser()

      const { data, error } = await supabase.from("transcriptions").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      if (data) {
        setTitle(data.title || "")
        setContent(data.content || "")
      }
    } catch (error) {
      console.error("データ取得エラー:", error)
      alert("文字起こしデータの取得に失敗しました")
      router.push("/transcriptions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      alert("文字起こし内容を入力してください")
      return
    }

    setIsSaving(true)

    try {
      const supabase = getSupabaseBrowser()

      const { error } = await supabase
        .from("transcriptions")
        .update({
          title: title.trim() || "無題の文字起こし",
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      alert("文字起こしを更新しました")
      router.push("/transcriptions")
    } catch (error) {
      console.error("更新エラー:", error)
      alert("更新に失敗しました")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
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
              変更を保存
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
