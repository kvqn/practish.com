"use client"

import { getProblemInfo } from "@/server/actions/get-problem-info"
import { getProblems } from "@/server/actions/get-problems"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="w-full bg-gray-50 p-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        <h1 className="text-center text-6xl font-bold">Browse Problems</h1>
      </div>
      <Table />
    </div>
  )
}

function Table() {
  const [problems, setProblems] = useState<Awaited<
    ReturnType<typeof getProblems>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      setProblems(await getProblems())
    })()
  }, [])

  if (!problems)
    return (
      <table className="w-1/2 table-auto divide-y rounded-xl border">
        <thead>
          <tr className="divide-x *:p-2">
            <th>#</th>
            <th>Title</th>
            <th>Solved</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr className="h-8 divide-x *:p-2">
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
          </tr>
          <tr className="h-8 divide-x *:p-2">
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
          </tr>
          <tr className="h-8 divide-x *:p-2">
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
          </tr>
          <tr className="h-8 divide-x *:p-2">
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
            <td>
              <p className="h-2 animate-pulse rounded bg-gray-200" />
            </td>
          </tr>
        </tbody>
      </table>
    )

  return (
    <table className="w-1/2 table-auto divide-y rounded-xl border">
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
      <tr className="h-8 divide-x *:p-2">
        <td>
          <p className="h-2 animate-pulse rounded bg-gray-200" />
        </td>
        <td>
          <p className="h-2 animate-pulse rounded bg-gray-200" />
        </td>
        <td>
          <p className="h-2 animate-pulse rounded bg-gray-200" />
        </td>
      </tr>
    )

  const router = useRouter()

  return (
    <tr
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100"
      onClick={() => {
        router.push(`/problems/${info.slug}`)
      }}
    >
      <td className="text-center">{info.id}</td>
      <td>{info.slug}</td>
      <td>No</td>
    </tr>
  )
}
