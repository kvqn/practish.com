import { $ } from "execa"
import { readFile } from "fs/promises"
import { z } from "zod"

export async function dockerBuild({ tag, dir }: { tag: string; dir: string }) {
  console.log(`building ${tag}`)
  await $`docker build -t ${tag} ${dir}`
}

export async function dockerRun(
  args: {
    image: string
    name: string
  } & ({ input: string } | { entrypoint: string }),
) {
  // TODO: checks
  if ("entrypoint" in args) {
    await $`docker run --rm -d --name ${args.name} --entrypoint ${args.entrypoint} --net practish-network ${args.image}`
    return
  }
  throw new Error("not implemented")
  //await $`docker run --rm -d --name ${args.name} -v ${args.input}:/input.sh --entrypoint /submission-runner --net practish-network ${args.image}`
}

export async function getContainerIp(container_name: string) {
  const { stdout } =
    await $`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${container_name}`
  console.log("container ip", stdout)
  return stdout
}

export async function isContainerRunning(container_name: string) {
  try {
    await $`docker inspect ${container_name}`
    return true
  } catch {
    return false
  }
}

const RunSubmissionOutputSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  exit_code: z.number(),
  fs_zip_base64: z.string(),
})

export async function dockerRunSubmission({
  problemSlug,
  testcaseId,
  submissionId,
  input,
}: {
  problemSlug: string
  testcaseId: number
  submissionId: number
  input: string
}) {
  const image = `practish-${problemSlug}-${testcaseId}`
  const container_name = `practish-${problemSlug}-${testcaseId}-${submissionId}`
  const inputFile = `./.practish/inputs/${container_name}.sh`
  const outputFile = `./.practish/outputs/${container_name}.json`
  await $`docker run -it --rm -d --name ${container_name} -v ${inputFile}:/input.sh -v ${outputFile}:/output.json --entrypoint /submission-runner ${image}`

  const output = RunSubmissionOutputSchema.parse(await readFile(outputFile))

  return output
}
