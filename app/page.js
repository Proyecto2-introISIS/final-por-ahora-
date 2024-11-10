import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { Toaster } from "@/components/ui/toaster"
import 'regenerator-runtime/runtime';

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
    </div>
  );
}
