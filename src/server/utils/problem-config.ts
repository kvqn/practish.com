import z from "zod"

export const ProblemConfigSchema = z.object({
  slug: z.string().refine((val) => val.toLowerCase() === val, {
    message: "slug must be lowercase",
  }),
})

/**
 * Read and return the problem config, making sure it is valid.
 */
export async function problemConfig(problem: string) {
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
  return parse_result.data
}
