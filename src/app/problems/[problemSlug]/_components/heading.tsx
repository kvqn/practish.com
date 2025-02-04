"use client"

import { useProblem } from "./problem-context"

export function ProblemHeading() {
  const { id, slug, title, description } = useProblem()
  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="text-6xl font-black">#{id}</p>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="font-mono text-sm text-neutral-500">{slug}</p>
        </div>
      </div>
      <p className="px-4 text-center italic">{description}</p>
    </div>
  )
}
