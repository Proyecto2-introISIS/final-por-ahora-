"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'; 

function Hero() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard'); 
  };

  return (
    <section className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Gestiona tus gastos
          <strong className="font-extrabold text-[#8B17FF] sm:block"> Controla tu dinero </strong>
        </h1>

        <p className="mt-4 sm:text-xl">
          Empieza a crear tu presupuesto y ahorra dinero
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button 
            onClick={handleClick} 
            className="block w-full rounded bg-[#8B17FF] px-12 py-3 text-sm font-medium text-white shadow hover:bg-[#FFC217] focus:outline-none focus:ring"
          >
            Comienza 
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero