import { getProblemInfo } from "@/server/actions/get-problem-info"
import { getProblems } from "@/server/utils/problem"
import Link from "next/link"

export const metadata = {
  title: "easyshell - browse",
}

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

async function Table() {
  const problems = await getProblems()
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

async function Problem({ problem }: { problem: string }) {
  const info = await getProblemInfo(problem)
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="table-row cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100"
    >
      <td className="text-center">{info.id}</td>
      <td>{info.slug}</td>
      <td>No</td>
    </Link>
  )
}
