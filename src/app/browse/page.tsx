import { Badge } from "@/components/ui/badge"
import { getProblems, getProblemInfo } from "@/server/utils/problem"

export default async function Page() {
  const problems = await getProblems()
  return (
    <div className="flex flex-wrap gap-4">
      {problems.map((problem) => (
        <Problem key={problem} problem={problem} />
      ))}
    </div>
  )
}

async function Problem({ problem }: { problem: string }) {
  const info = await getProblemInfo(problem)
  return (
    <div className="flex flex-col divide-y overflow-hidden rounded-xl border">
      <div className="h-20 w-40 bg-red-200 p-2"></div>
      <div className="flex flex-col p-2">
        <div className="text-lg font-semibold">{problem}</div>
        <div className="flex gap-2">
          {info.tags.map((tag) => (
            <Badge key={tag} className="text-[8px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
