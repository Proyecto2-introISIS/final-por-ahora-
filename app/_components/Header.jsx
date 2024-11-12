"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm bg-[#8B17FF]"> 
      <Image src={"/Logo Financial.lly color.svg"}
        alt="logo3"
        width={90}
        height={90}
      />
      {isSignedIn ?
        <UserButton /> :
        <Link href={"/sign-in"}>
          <Button className="bg-[#FFE686] text-[#8B17FF] hover:bg-[#FFC217] font-bold">
            Inicia sesión / Regístate
          </Button>
        </Link>
      }
    </div>
  )
}

export default Header