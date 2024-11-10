import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import  {toast} from "sonner"

function ExpenseListTable({expensesList, refreshData}) {

    const deleteExpense=async(expense)=>{
        const result=await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))
        .returning();

        if (result)
        {
            toast("Gasto borrado")
            refreshData()
        }
    }
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Últimos gastos</h2>
      <div className="grid grid-cols-4 bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Nombre</h2>
        <h2 className="font-bold">Cantidad</h2>
        <h2 className="font-bold">Fecha</h2>
        <h2 className="font-bold">Acción</h2>
      </div>
      {expensesList.map((expenses,index)=>(
        <div className="grid grid-cols-4 bg-slate-50 p-2">
        <h2>{expenses.name}</h2>
        <h2>{expenses.amount}</h2>
        <h2>{expenses.createdAt}</h2>
        <h2>
            <Trash className="text-red-600 cursor-pointer"
                onClick={()=>deleteExpense(expenses)}
            />
        </h2>
      </div>
      ))}
    </div>
  )
}

export default ExpenseListTable
