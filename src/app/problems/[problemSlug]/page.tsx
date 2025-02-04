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
import { ProblemHeading } from "./_components/heading"
import { ProblemMarkdown } from "./_components/markdown"

export default function Page({ params }: { params: { problemSlug: string } }) {
  const { problemSlug } = params

  return (
    <ProblemProvider slug={problemSlug}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4">
          <div>
            <ProblemHeading />
            <ProblemMarkdown slug={problemSlug} />
          </div>
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
