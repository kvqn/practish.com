"use client"

import { useState } from "react"
import { useProblem } from "./problem-context"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestcaseTerminal } from "./testcase-terminal"
import { TestcaseFilebrowser } from "./testcase-filebrowser"

export function Testcases() {
  const { testcases } = useProblem()
  const [tab, setTab] = useState("1")

  const [mode] = useState<"filebrowser" | "terminal">("terminal")

  return (
    <div>
      <Tabs defaultValue="1" value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          {testcases.map((testcase) => (
            <TabsTrigger
              key={testcase.id}
              value={testcase.id.toString()}
              className="flex-grow"
            >
              Test Case {testcase.id}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="p-2">
        <div className="text-center font-semibold">
          {mode === "terminal" ? "Testcase Terminal" : "Testcase Filebrowser"}
        </div>
        {mode === "terminal" ? (
          <TestcaseTerminal testcase={parseInt(tab)} />
        ) : (
          <TestcaseFilebrowser />
        )}
      </div>
    </div>
  )
}
