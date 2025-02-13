"use client"

import { getProblemInfo } from "@/server/actions/get-problem-info"
import { getProblems } from "@/server/actions/get-problems"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [problems, setProblems] = useState<Awaited<
    ReturnType<typeof getProblems>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      setProblems(await getProblems())
    })()
  }, [])

  if (!problems) return <div>Loading...</div>

  return (
    <div className="mx-auto w-1/2">
      <table className="table-auto divide-y rounded-xl border">
        <thead>
          <tr className="divide-x *:p-2">
            <th>#</th>
            <th>Title</th>
            <th>Solved</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {problems.map((problem) => (
            <Problem key={problem} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Problem({ problem }: { problem: string }) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getProblemInfo>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      setInfo(await getProblemInfo(problem))
    })()
  }, [problem])

  if (!info)
    return (
      <tr>
        <td className="animate-pulse"></td>
        <td></td>
        <td></td>
      </tr>
    )

  const router = useRouter()

  return (
    <tr
      className="cursor-pointer divide-x *:p-2"
      onClick={() => {
        router.push(`/problems/${info.slug}`)
      }}
    >
      <td>{info.id}</td>
      <td>{info.slug}</td>
      <td>No</td>
    </tr>
  )
}
