"use client";
import React from 'react';
import Image from "next/image";
import { LayoutGrid, Mic, PiggyBank, ReceiptText, Download } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';

function SideNav() {
    const menuList = [
        {
            id: 1,
            name: "Tablero",
            icon: LayoutGrid,
            path: "/dashboard"
        },
        {
            id: 2,
            name: "Presupuesto",
            icon: PiggyBank,
            path: "/dashboard/budgets"
        },
        {
            id: 3,
            name: "Gastos",
            icon: ReceiptText,
            path: "/dashboard/gastos"
        },
        {
            id: 4,
            name: "Asistente de voz",
            icon: Mic,
            path: "/dashboard/asistente"
        },
        {
            id: 5,
            name: "Recibos",
            icon: Download,
            path: "/dashboard/receipts"
        }
    ];

    const path = usePathname();

    useEffect(() => {
        if (path) {
            console.log(path);
        }
    }, [path]);

    return (
        <div className="h-screen p-5 shadow-sm bg-[#17ff8b]">
            <Image src={"/Logo Financial.lly color.svg"}
                alt="logo3"
                width={120}
                height={70}
            />
            <div className="mt-5">
                {menuList.map((menu) => (
                    <Link href={menu.path} key={menu.id}>
                        <h2
                            className={`group flex gap-2 items-center font-medium p-5 cursor-pointer rounded-md 
                    ${path === menu.path ? "text-[#8B17FF] bg-[#FFE686]/80" : "text-white"} 
                    hover:text-[#8B17FF] hover:bg-[#FFE686]/80`}
                        >
                            <menu.icon
                                className={`group-hover:text-[#8B17FF] 
                                ${path === menu.path ? "text-[#8B17FF]" : "text-white"}`}
                            />
                            <span className={`${path === menu.path ? "text-[#8B17FF]" : ""}`}>
                                {menu.name}
                            </span>
                        </h2>
                    </Link>
                ))}
            </div>
            <div className="fixed bottom-10 p-5 flex gap-2 items-center text-white">
                <UserButton />
                Perfil
            </div>
        </div>
    );
}

export default SideNav;