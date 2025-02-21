"use client"

import { getTerminalSession } from "@/server/actions/get-terminal-session"
import { useEffect, useRef, useState } from "react"
import { useProblem } from "./problem-context"
import { submitTerminalSessionCommand } from "@/server/actions/submit-terminal-session-command"
import { ImSpinner3 } from "react-icons/im"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function TestcaseTerminal({ testcase }: { testcase: number }) {
  const { id: problemId } = useProblem()

  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getTerminalSession>
  > | null>(null)

  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [showOptions, setShowOptions] = useState(false)

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
      console.log("session", session)
      setSession(session)
    })()
  }, [problemId, testcase])

  if (!session)
    return (
      <div className="flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div className="flex h-80 flex-col overflow-scroll whitespace-pre-line bg-black px-2 py-1"></div>
        <div className="flex">
          <input
            className={cn(
              "flex-grow bg-neutral-800 px-2 py-1 text-white outline-none",
            )}
          />
          <button className="w-20 select-none bg-green-800 px-2 text-neutral-200 hover:bg-green-700"></button>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div
          className="flex h-80 flex-col overflow-scroll whitespace-pre-line bg-black px-2 py-1"
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
            className={cn(
              "flex-grow bg-neutral-800 px-2 py-1 text-white outline-none",
              {
                "text-neutral-400": running,
              },
            )}
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
            className="w-20 select-none bg-green-800 px-2 text-neutral-200 hover:bg-green-700"
          >
            {running ? (
              <ImSpinner3 className="m-auto animate-spin" />
            ) : (
              "submit"
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          className="text-center font-semibold"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? "Hide Options" : "View Options"}
        </button>
        <div
          className={cn("overflow-hidden bg-gray-400 transition-all", {
            "h-0": !showOptions,
            "h-40": showOptions,
          })}
        >
          <div className="flex flex-col p-4">
            <Button className="bg-green-800 text-neutral-200">
              Restart Terminal
            </Button>
            <div className="flex items-center gap-2">
              <Checkbox />
              <p>Show Times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
