import { Button } from "@/components/ui/button"
import { getServerUser } from "@/server/auth"
import Link from "next/link"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

function Logo() {
  return (
    <Link className="text-2xl" href="/">
      <span className="font-bold">easy</span>
      <span className="font-bold text-green-500">shell</span>
    </Link>
  )
}

export function Navbar() {
  return (
    <div className="flex items-center gap-8 px-4 py-2">
      <Logo />
      <Link
        href="/problems"
        className="mt-1 text-gray-500 transition-colors hover:text-black"
      >
        Problems
      </Link>
      <div className="ml-auto">
        <Options />
      </div>
    </div>
  )
}

function Options() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-2">
          <HamburgerMenuIcon width="1.5rem" height="1.5rem" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="flex w-full flex-col">
          <User />
        </div>
      </PopoverContent>
    </Popover>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

async function User() {
  const user = await getServerUser()
  if (user)
    return (
      <div className="flex w-full flex-col">
        <div className="flex w-fit gap-2 rounded-md border px-4 py-2">
          <Button>
            <Avatar className="mr-1.5 h-6 w-6">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>{user.name![0]}</AvatarFallback>
            </Avatar>
            <p>{user.name}</p>
          </Button>
        </div>

        <Link href="/settings" className="w-full">
          <Button variant="outline" className="mt-2 w-full">
            Settings
          </Button>
        </Link>

        <Link href="/logout" className="w-full">
          <Button variant="outline" className="mt-2 w-full">
            Logout
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="flex w-full flex-col">
      <p>Not logged in</p>
      <Link href="/login" className="w-full">
        <Button className="w-full">Login</Button>
      </Link>
    </div>
  )
}
