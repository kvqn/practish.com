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

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const slug = RegExp(/\/problems\/([^\/]+)/).exec(path)?.[1]
  const router = useRouter()
  if (!slug) {
    router.push("/browse")
    return <div>Redirecting...</div>
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex w-full flex-col p-2">
        <ProblemProvider slug={slug}>
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
        </ProblemProvider>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
