"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onRecordingStart?: () => void
  isProcessing: boolean
}

export function AudioRecorder({ onRecordingComplete, onRecordingStart, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    if (onRecordingStart) {
      onRecordingStart()
    }

    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        onRecordingComplete(audioBlob)

        // ストリームのトラックを停止
        stream.getTracks().forEach((track) => track.stop())

        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // 録音時間を更新
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("マイクへのアクセスに失敗しました:", error)
      alert("マイクへのアクセスに失敗しました。ブラウザの設定を確認してください。")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="text-2xl font-semibold">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-red-500">●</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        ) : (
          <div>音声を録音</div>
        )}
      </div>

      <div className="flex gap-4">
        {!isRecording ? (
          <Button onClick={startRecording} disabled={isProcessing} size="lg" className="bg-red-500 hover:bg-red-600">
            <Mic className="mr-2 h-5 w-5" />
            録音開始
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" size="lg">
            <Square className="mr-2 h-5 w-5" />
            録音停止
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>文字起こし処理中...</span>
        </div>
      )}
    </div>
  )
}
