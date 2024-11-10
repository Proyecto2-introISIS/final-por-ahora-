"use client";
import React from 'react'
import Image from "next/image";
import { LayoutGrid, Mic, PiggyBank, ReceiptText, Download } from 'lucide-react'
import {UserButton} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';

function SideNav() {
    const menuList=[
        {
            id:1,
            name:"Tablero",
            icon:LayoutGrid,
            path: "/dashboard"
        },
        {
            id:2,
            name:"Presupuesto",
            icon:PiggyBank,
            path: "/dashboard/budgets"
        },
        {
            id:3,
            name:"Gastos",
            icon:ReceiptText,
            path: "/dashboard/gastos"
        },
        {
        id:4,
            name:"Asistente de voz",
            icon:Mic,
            path: "/dashboard/asistente"
        },
        {
            id:4,
            name:"Recibos",
            icon:Download,
            path: "/dashboard/receipts"
        } 
        
    ]
    
    const path = usePathname();
    
        useEffect(() => {
            if (path) {
                console.log(path);
            }
        }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
        <Image src={"/logoF.png"}
        alt="logo3"
        width={100}
        height={50}
        />
        <div className="mt-5">
            {menuList.map((menu) => (
                <Link href={menu.path} key={menu.id}>
                    <h2
                    className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md 
                    hover:text-primary hover:bg-blue-100 
                    ${path === menu.path ? "text-primary bg-blue-100" : ""}`}
                    >
                        <menu.icon />
                        {menu.name}
                    </h2>
                </Link>
            ))}
        </div>
            <div className="fixed bottom-10 p-5 flex gap-2 items-center">
                <UserButton/>
                Perfil
            </div>
    </div>
  )
}

export default SideNav
