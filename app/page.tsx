"use client"

import { useState } from "react"
import { AudioRecorder } from "@/components/audio-recorder"
import { TranscriptionForm } from "@/components/transcription-form"
import { Button } from "@/components/ui/button"
import { fileToBase64 } from "@/lib/utils"
import { FileText, Database, Table, Settings, Bug, Key, TestTube } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "success" | "error" | "loading" | null
    message: string
  }>({ status: null, message: "" })
  const [tableStatus, setTableStatus] = useState<{
    status: "success" | "error" | "loading" | null
    message: string
  }>({ status: null, message: "" })
  const [envStatus, setEnvStatus] = useState<{
    status: "success" | "error" | "loading" | null
    message: string
    details?: Record<string, string>
  }>({ status: null, message: "" })
  const [pgStatus, setPgStatus] = useState<{
    status: "success" | "error" | "loading" | null
    message: string
    details?: string
  }>({ status: null, message: "" })
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)
  const [envTestResult, setEnvTestResult] = useState<any>(null)

  const handleRecordingComplete = async (blob: Blob) => {
    setAudioBlob(blob)
    await processAudio(blob)
  }

  const handleRecordingStart = () => {
    setTranscription("")
    setAudioBlob(null)
  }

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true)

    try {
      // 音声ファイルをBase64に変換
      const file = new File([blob], "recording.webm", { type: "audio/webm" })
      const base64Audio = await fileToBase64(file)

      // APIに送信して文字起こし
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: base64Audio }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "文字起こしに失敗しました")
      }

      const data = await response.json()
      setTranscription(data.text)
    } catch (error) {
      console.error("文字起こしエラー:", error)
      alert("文字起こしに失敗しました: " + (error instanceof Error ? error.message : "不明なエラー"))
      setTranscription("")
    } finally {
      setIsProcessing(false)
    }
  }

  const testSupabaseConnection = async () => {
    setConnectionStatus({ status: "loading", message: "Supabase接続をテスト中..." })
    try {
      const response = await fetch("/api/test-supabase")

      if (!response.ok) {
        let errorMessage = "接続エラー"
        try {
          const data = await response.json()
          errorMessage = `接続エラー: ${data.error} ${data.details ? `- ${data.details}` : ""}`
        } catch (jsonError) {
          errorMessage = `接続エラー: ${response.statusText} (${response.status})`
        }

        setConnectionStatus({
          status: "error",
          message: errorMessage,
        })
        return
      }

      const data = await response.json()
      setConnectionStatus({
        status: "success",
        message: "Supabaseに正常に接続できました",
      })
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: `テスト中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const setupDatabase = async () => {
    setTableStatus({ status: "loading", message: "データベースをセットアップ中..." })
    try {
      const response = await fetch("/api/setup-database")

      if (!response.ok) {
        let errorMessage = "セットアップエラー"
        try {
          const data = await response.json()
          errorMessage = `セットアップエラー: ${data.error} ${data.details ? `- ${data.details}` : ""}`
        } catch (jsonError) {
          errorMessage = `セットアップエラー: ${response.statusText} (${response.status})`
        }

        setTableStatus({
          status: "error",
          message: errorMessage,
        })
        return
      }

      const data = await response.json()
      setTableStatus({
        status: "success",
        message: "データベースのセットアップが完了しました",
      })
    } catch (error) {
      setTableStatus({
        status: "error",
        message: `セットアップ中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const checkEnvironmentVariables = async () => {
    setEnvStatus({ status: "loading", message: "環境変数を確認中..." })
    try {
      const response = await fetch("/api/check-env")

      if (!response.ok) {
        let errorMessage = "環境変数の確認中にエラーが発生しました"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (jsonError) {
          errorMessage = `環境変数の確認中にエラーが発生しました: ${response.statusText} (${response.status})`
        }

        setEnvStatus({
          status: "error",
          message: errorMessage,
        })
        return
      }

      const data = await response.json()
      const allSet =
        data.supabaseUrl === "設定済み" && data.supabaseAnonKey === "設定済み" && data.geminiApiKey === "設定済み"

      setEnvStatus({
        status: allSet ? "success" : "error",
        message: allSet ? "すべての環境変数が正しく設定されています" : "一部の環境変数が設定されていません",
        details: data,
      })
    } catch (error) {
      setEnvStatus({
        status: "error",
        message: `確認中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  const testEnvironmentVariables = async () => {
    try {
      const response = await fetch("/api/test-env")

      if (!response.ok) {
        let errorData = { error: `${response.status}: ${response.statusText}` }
        try {
          errorData = await response.json()
        } catch (e) {
          const text = await response.text()
          errorData.error = text.substring(0, 500)
        }
        setEnvTestResult({ error: true, ...errorData })
        return
      }

      const data = await response.json()
      setEnvTestResult(data)
    } catch (error) {
      setEnvTestResult({
        error: true,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const testPostgresConnection = async () => {
    setPgStatus({ status: "loading", message: "Supabase接続をテスト中..." })
    try {
      const response = await fetch("/api/test-postgres")

      if (!response.ok) {
        let errorMessage = "接続エラー"
        try {
          const data = await response.json()
          errorMessage = `接続エラー: ${data.error}`
          if (data.details) {
            errorMessage += ` - ${data.details}`
          }
        } catch (jsonError) {
          errorMessage = `接続エラー: ${response.statusText} (${response.status})`
        }

        setPgStatus({
          status: "error",
          message: errorMessage,
        })
        return
      }

      const data = await response.json()
      setPgStatus({
        status: "success",
        message: "Supabaseに正常に接続できました",
        details: data.message || "接続成功",
      })
    } catch (error) {
      setPgStatus({
        status: "error",
        message: `テスト中にエラーが発生しました`,
        details: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const runDebug = async () => {
    try {
      const response = await fetch("/api/debug")

      if (!response.ok) {
        let errorData = { error: `${response.status}: ${response.statusText}` }
        try {
          errorData = await response.json()
        } catch (e) {
          // JSONでない場合はテキストを取得
          const text = await response.text()
          errorData.error = text.substring(0, 500) // 長すぎる場合は切り詰める
        }
        setDebugInfo({ error: true, ...errorData })
        return
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({
        error: true,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
  }

  const checkGoogleApiKey = () => {
    setShowApiKeyPrompt(true)
  }

  return (
    <main className="container max-w-3xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">音声文字起こしアプリ</h1>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={checkEnvironmentVariables}>
            <Settings className="mr-2 h-4 w-4" />
            環境変数確認
          </Button>
          <Button variant="outline" size="sm" onClick={testEnvironmentVariables}>
            <TestTube className="mr-2 h-4 w-4" />
            .env読み込みテスト
          </Button>
          <Button variant="outline" size="sm" onClick={testSupabaseConnection}>
            <Database className="mr-2 h-4 w-4" />
            Supabase接続
          </Button>
          <Button variant="outline" size="sm" onClick={testPostgresConnection}>
            <Database className="mr-2 h-4 w-4" />
            DB接続テスト
          </Button>
          <Button variant="outline" size="sm" onClick={setupDatabase}>
            <Table className="mr-2 h-4 w-4" />
            DBセットアップ
          </Button>
          <Button variant="outline" size="sm" onClick={runDebug}>
            <Bug className="mr-2 h-4 w-4" />
            デバッグ情報
          </Button>
          <Button variant="outline" asChild>
            <Link href="/transcriptions">
              <FileText className="mr-2 h-4 w-4" />
              文字起こし一覧
            </Link>
          </Button>
        </div>
      </div>

      {envStatus.status && (
        <Alert
          variant={
            envStatus.status === "error" ? "destructive" : envStatus.status === "success" ? "default" : "default"
          }
        >
          <AlertDescription>
            <div>{envStatus.message}</div>
            {envStatus.details && (
              <div className="mt-2 text-sm">
                <div>
                  NEXT_PUBLIC_SUPABASE_URL: {envStatus.details.supabaseUrl} ({envStatus.details.supabaseUrlPrefix})
                </div>
                <div>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.details.supabaseAnonKey} (
                  {envStatus.details.supabaseAnonKeyPrefix})
                </div>
                <div>
                  GEMINI_API_KEY: {envStatus.details.geminiApiKey} ({envStatus.details.geminiApiKeyPrefix})
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {envTestResult && (
        <Alert variant={envTestResult.error ? "destructive" : "default"}>
          <TestTube className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">.envファイル読み込み結果:</p>
              {envTestResult.error ? (
                <p className="text-red-600">エラー: {envTestResult.message}</p>
              ) : (
                <div className="text-sm">
                  <div>GEMINI_API_KEY: {envTestResult.environmentVariables?.GEMINI_API_KEY}</div>
                  <div>APIキープレフィックス: {envTestResult.geminiApiKeyPrefix}</div>
                  <div>環境: {envTestResult.nodeEnv}</div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setEnvTestResult(null)} className="mt-2">
                閉じる
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus.status && (
        <Alert
          variant={
            connectionStatus.status === "error"
              ? "destructive"
              : connectionStatus.status === "success"
                ? "default"
                : "default"
          }
        >
          <AlertDescription>{connectionStatus.message}</AlertDescription>
        </Alert>
      )}

      {pgStatus.status && (
        <Alert
          variant={pgStatus.status === "error" ? "destructive" : pgStatus.status === "success" ? "default" : "default"}
        >
          <AlertDescription>
            <div>{pgStatus.message}</div>
            {pgStatus.details && <div className="mt-2 text-sm">{pgStatus.details}</div>}
          </AlertDescription>
        </Alert>
      )}

      {tableStatus.status && (
        <Alert
          variant={
            tableStatus.status === "error" ? "destructive" : tableStatus.status === "success" ? "default" : "default"
          }
        >
          <AlertDescription>{tableStatus.message}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
          <h3 className="font-bold mb-2">デバッグ情報</h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        onRecordingStart={handleRecordingStart}
        isProcessing={isProcessing}
      />

      {transcription && <TranscriptionForm transcription={transcription} />}

      {/* Gemini API Key設定プロンプト */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Key className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Gemini API Key設定完了</h3>
        </div>
        <p className="text-sm text-green-700 mb-3">
          .envファイルにGEMINI_API_KEYが設定されています。音声文字起こし機能をお試しください。
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={checkGoogleApiKey}
          className="border-green-300 text-green-800 hover:bg-green-100"
        >
          <Key className="mr-2 h-4 w-4" />
          設定詳細を表示
        </Button>
      </div>

      {showApiKeyPrompt && (
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">現在の設定:</p>
              <div className="text-sm bg-gray-100 p-2 rounded">
                <div>
                  <strong>ファイル:</strong> .env
                </div>
                <div>
                  <strong>変数名:</strong> GEMINI_API_KEY
                </div>
                <div>
                  <strong>状態:</strong> 設定済み
                </div>
              </div>
              <p className="text-xs text-gray-600">
                注意: .envファイルは.gitignoreに追加して、リポジトリにコミットしないようにしてください。
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowApiKeyPrompt(false)} className="mt-2">
                閉じる
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </main>
  )
}
