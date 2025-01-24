import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import type { ReactNode } from "react"
import { Prompt } from "./_components/prompt"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="p-4">
        <Prompt />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
