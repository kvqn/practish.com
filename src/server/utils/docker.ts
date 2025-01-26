import { $ } from "execa"

export async function dockerBuild({
  tag,
  dockerfile,
}: {
  tag: string
  dockerfile: string
}) {
  await $`docker build -t ${tag} -f ${dockerfile} .`
}
