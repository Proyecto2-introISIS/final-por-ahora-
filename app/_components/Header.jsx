"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
function Header() {

  const {user, isSignedIn}=useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm"> 
      <Image src={"./logoF.png"}
      alt="logo3"
      width={90}
      height={90}
      />
      {isSignedIn?
      <UserButton/> : 
      <Link href={"/sign-in"}>
        <Button>Empieza</Button>
      </Link> 
    }
      
    </div>
  )
}

export default Header
 