"use client";

import Image from "next/image";
import { signOutAction } from "@/actions/auth-action";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserProfile() {
  const session = useSession();

  const imageUrl = session.data?.user?.image;
  const userName = session.data?.user?.name;
  const userEmail = session.data?.user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant={"secondary"}
          className="flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white"
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${userName} profile picture`}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <p className="truncate">{userEmail}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 rounded-xl">
        <DropdownMenuItem className="lg:w-full px-28  flex items-center justify-center">
          <form action={signOutAction}>
            <Button
              variant="ghost"
              type="submit"
              className="hover:text-primary"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
