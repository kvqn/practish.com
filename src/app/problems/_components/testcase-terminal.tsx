"use client"

import { getTerminalSession } from "@/server/actions/get-terminal-session"
import { useEffect, useRef, useState } from "react"
import { useProblem } from "./problem-context"
import { Input } from "@/components/ui/input"
import { submitTerminalSessionCommand } from "@/server/actions/submit-terminal-session-command"

export function TestcaseTerminal({ testcase }: { testcase: number }) {
  const { id: problemId } = useProblem()

  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getTerminalSession>
  > | null>(null)

  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  async function handleSubmit() {
    if (!session) return
    setRunning(true)
    const log = await submitTerminalSessionCommand({
      sessionId: session.id,
      command: input,
    })
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        logs: [...prev.logs, log],
      }
    })
    setInput("")
    setRunning(false)
  }

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [session])

  useEffect(() => {
    if (!running) {
      inputRef.current?.focus()
    }
  }, [running])

  useEffect(() => {
    void (async () => {
      const session = await getTerminalSession({
        problemId: problemId,
        testcaseId: testcase,
      })
      setSession(session)
    })()
  }, [problemId, testcase])

  if (!session) return <div>loading</div>

  return (
    <div className="flex flex-col font-geist-mono">
      <div
        className="flex h-80 flex-col overflow-scroll bg-black px-2 py-1"
        ref={terminalRef}
      >
        {session.logs.map((log) => (
          <div key={log.id}>
            <p className="text-white">{`>>> ${log.stdin}`}</p>
            {log.stdout.length > 0 && (
              <p className="text-neutral-400">{log.stdout}</p>
            )}
            {log.stderr.length > 0 && (
              <p className="text-red-600">{log.stderr}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={running}
          className="flex-grow bg-neutral-800 px-2 py-1 text-white outline-none"
          autoFocus
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleSubmit()
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={running}
          className="bg-green-800 px-2 text-neutral-200 hover:bg-green-700"
        >
          submit
        </button>
      </div>
    </div>
  )
}
