"use client"

import { Button } from "@/components/ui/button"
import { DiscordLogoIcon } from "@radix-ui/react-icons"
import { signIn } from "next-auth/react"

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 rounded-xl border p-8">
        <h2 className="text-center font-semibold">Login</h2>
        <Button
          className="flex items-center gap-2"
          variant={"secondary"}
          onClick={async () => {
            await signIn("discord")
          }}
        >
          <DiscordLogoIcon className="h-6 w-6" />
          Login with Discord
        </Button>
      </div>
    </div>
  )
}
