import { $ } from "execa"

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
  await $`docker run --rm -d --name ${args.name} -v ${args.input}:/input.sh --net practish-network ${args.image}`
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
  } catch (e) {
    return false
  }
}
