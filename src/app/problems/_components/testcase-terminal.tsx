"use client"

import { getTerminalSession } from "@/server/actions/get-terminal-session"
import { useEffect, useState } from "react"
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
    setRunning(false)
  }

  useEffect(() => {
    void (async () => {
      const session = await getTerminalSession({
        problemId: problemId,
        testcaseId: testcase,
      })
      setSession(session)
    })()
  }, [])

  if (!session) return <div>loading</div>

  return (
    <div>
      <div className="flex flex-col">
        {session.logs.map((log) => (
          <div key={log.id}>
            <p>{`>>> ${log.stdin}`}</p>
            {log.stdout.length > 0 && <p>{log.stdout}</p>}
            {log.stderr.length > 0 && <p>{log.stderr}</p>}
          </div>
        ))}
      </div>
      <div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={running}
        />
        <button onClick={handleSubmit} disabled={running}>
          submit
        </button>
      </div>
    </div>
  )
}
