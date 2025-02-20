import {
  containerManagerCreate,
  containerManagerIsRunning,
} from "./container-manager"

export async function dockerRun(
  args: {
    image: string
    name: string
  } & ({ input: string } | { entrypoint: string }),
) {
  // TODO: checks
  if ("entrypoint" in args) {
    //await $`docker run --rm -d --name ${args.name} --entrypoint ${args.entrypoint} --net easyshell ${args.image}`
    await containerManagerCreate({
      container_name: args.name,
      image: args.image,
      volume_mounts: [],
      entry_point: args.entrypoint,
    })
    return
  }
  throw new Error("not implemented")
  //await $`docker run --rm -d --name ${args.name} -v ${args.input}:/input.sh --entrypoint /submission-runner --net easyshell-network ${args.image}`
}

export async function isContainerRunning(container_name: string) {
  return await containerManagerIsRunning(container_name)
}
