"use client"

import { usePathname, useRouter } from "next/navigation"
import { ProblemProvider } from "./_components/problem-context"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Testcases } from "./_components/testcases"
import { Submissions } from "./_components/submissions"
import { SubmissionsContextProvider } from "./_components/submissions/submissions-context"
import { ProblemContent } from "./_components/content"

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const slug = RegExp(/\/problems\/([^\/]+)/).exec(path)?.[1]
  const router = useRouter()
  if (!slug) {
    router.push("/browse")
    return <div>Redirecting...</div>
  }

  return (
    <ProblemProvider slug={slug}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4">
          <ProblemContent>{children}</ProblemContent>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex w-full flex-col p-4">
          <Tabs defaultValue="submissions" className="">
            <TabsList className="w-full">
              <TabsTrigger value="testcases" className="text-md flex-grow">
                Testcases
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-md flex-grow">
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="testcases">
              <Testcases />
            </TabsContent>
            <TabsContent value="submissions">
              <SubmissionsContextProvider>
                <Submissions />
              </SubmissionsContextProvider>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ProblemProvider>
  )
}
