import type { ProblemConfig } from "@/server/utils/problem"

const config: ProblemConfig = {
  slug: "hello-world",
  title: "Hello World",
  tags: ["hello", "world"],
  capture_stdout: true,
  successLogic: ({ stdout }) => stdout === "Hello, World!\n",
}

export default config
