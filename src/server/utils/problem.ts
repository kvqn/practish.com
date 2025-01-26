import { cp } from "fs/promises"
import { writeFile } from "fs/promises"
import { mkdir } from "fs/promises"
import { readdir } from "fs/promises"
import z from "zod"
import { dockerBuild } from "./docker"

const ProblemOutputSchema = z.object({
  stdout: z.string().optional(),
  fs: z.record(z.union([z.string(), z.null()])).optional(),
})

const ProblemConfigSchema = z
  .object({
    slug: z.string().refine((val) => RegExp(/^[a-z0-9\-]*[a-z0-9]$/).test(val)),
    title: z
      .string()
      .nonempty()
      .refine((val) => !val.startsWith(" "))
      .refine((val) => !val.endsWith(" ")),
    tags: z
      .array(
        z
          .string()
          .nonempty()
          .refine((val) => !val.startsWith(" "))
          .refine((val) => !val.endsWith(" ")),
      )
      .default([]),
    capture_stdout: z.boolean().default(false),
    capture_fs_wildcard: z.string().optional(),
    successLogic: z.function().args(ProblemOutputSchema).returns(z.boolean()),
  })
  .strict()

export type ProblemConfig = z.infer<typeof ProblemConfigSchema>
export type ProblemOutput = z.infer<typeof ProblemOutputSchema>

/**
 * Read and return the problem config, making sure it is valid.
 */
async function _problemConfig(problem: string) {
  const parse_result = ProblemConfigSchema.safeParse(
    (
      (await import(`@/app/problems/(problems)/${problem}/_/config`)) as {
        default: unknown
      }
    ).default,
  )

  if (!parse_result.success) {
    console.error(parse_result.error)
    throw new Error("Invalid problem config")
  }

  const config = parse_result.data
  if (config.slug !== problem) {
    throw new Error(`Problem slug does not match`)
  }

  return config
}

const ProblemInfoSchema = z.object({
  ...ProblemConfigSchema.shape,
  testcases: z.number(),
})

export async function getProblemInfo(
  problem: string,
): Promise<z.infer<typeof ProblemInfoSchema>> {
  const config = await _problemConfig(problem)
  const testcases = (
    await readdir(`./src/app/problems/(problems)/${problem}/_/testcases`)
  ).length
  return ProblemInfoSchema.parse({ ...config, testcases })
}

export async function getProblems() {
  const BASE_DIR = "./src/app/problems/(problems)"
  const problems = await readdir(BASE_DIR)
  return problems
}

export async function getTestcases(problem: string) {
  const BASE_DIR = `./src/app/problems/(problems)/${problem}/_/testcases`
  const testcases = await readdir(BASE_DIR)
  return testcases
}

export async function buildProblem(problem: string) {
  const info = await getProblemInfo(problem)
  for (let i = 1; i <= info.testcases; i++) {
    const tag = `practish-${problem}-${i}`
    await mkdir(`.practish/images/${tag}`, {
      recursive: true,
    })

    await cp(
      `./src/app/problems/(problems)/${problem}/_/testcases/${i}`,
      `.practish/images/${tag}/home`,
      {
        recursive: true,
      },
    )

    await writeFile(
      `.practish/images/${tag}/Dockerfile`,
      `
FROM alpine
COPY home home

ENTRYPOINT ["/input.sh"]
`,
    )

    await dockerBuild({
      tag: tag,
      dockerfile: `.practish/images/${tag}/Dockerfile`,
    })
  }
}
