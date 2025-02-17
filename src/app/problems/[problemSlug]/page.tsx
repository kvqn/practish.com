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
import { getProblems } from "@/server/utils/problem"
import { AiTwotoneQuestionCircle } from "react-icons/ai"
import Link from "next/link"
import { ProblemHints } from "./_components/problem-hints"

export default async function Page({
  params,
}: {
  params: { problemSlug: string }
}) {
  const { problemSlug } = params
  const valid = (await getProblems()).includes(problemSlug)
  if (!valid) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="fixed -z-10 font-mono text-8xl font-black">
          {Array.from({ length: 10 }).map((_, i) => (
            <>
              <div key={2 * i} className="flex gap-2 bg-gray-50 text-white">
                {Array.from({ length: 10 }).map((_, j) => (
                  <p className="" key={j}>
                    4040
                  </p>
                ))}
              </div>
              <div key={2 * i + 1} className="flex gap-2 bg-white text-gray-50">
                {Array.from({ length: 10 }).map((_, j) => (
                  <p className="" key={j}>
                    0404
                  </p>
                ))}
              </div>
            </>
          ))}
        </div>
        <h2 className="text-xl">
          {`I don't think a problem like that exists here`}
        </h2>
        <Link href="/browse" className="transition-transform hover:scale-105">
          <AiTwotoneQuestionCircle className="animate-spin cursor-pointer text-[10rem]" />
        </Link>
        <h2 className="text-xl">
          Click the giant spinning question mark to go back.
        </h2>
      </div>
    )
  }

  return (
    <ProblemProvider slug={problemSlug}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4">
          <div>
            <ProblemHeading />
            <ProblemMarkdown slug={problemSlug} />
            <ProblemHints slug={problemSlug} />
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
