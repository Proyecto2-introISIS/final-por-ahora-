import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc.toFixed(2);
  }

  // Formatear los valores con puntos de división y signo de pesos
  const formatCurrency = (value) => `$${value.toLocaleString('es-CO')}`;

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px] bg-[#e7d5ff]">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl p-3 px-4 bg-[#8B17FF] rounded-full">{budget?.icon}</h2>
            <div>
              <h2 className="font-bold text-black">{budget.name}</h2>
              <h2 className="text-sm text-gray-600">{budget.totalItem} Artículo</h2>
            </div>
          </div>
          <h2 className="font-bold text-lg text-black"> {formatCurrency(budget.amount)}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-gray-600">{formatCurrency(budget.totalSpend ? budget.totalSpend : 0)} Gastado</h2>
            <h2 className="text-xs text-gray-600">{formatCurrency(budget.amount - budget.totalSpend)} Restante</h2>
          </div>
          <div className="w-full bg-[#FFE686] h-2 rounded-full">
            <div className="bg-[#FFC217] h-2 rounded-full" style={{ width: `${calculateProgressPerc()}%` }}></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BudgetItem;