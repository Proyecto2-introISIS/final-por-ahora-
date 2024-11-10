"use client";
import React, { useEffect, useState } from 'react';
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from '@/utils/schema';  
import { useUser } from "@clerk/nextjs"; 
import { sql, eq, desc } from 'drizzle-orm';  
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Pen, PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from './_components/EditBudget';

function ExpensesScreen({ params }) {
  const { user } = useUser();
    const [budgetInfo,setbudgetInfo]=useState();
  const [expensesList, setExpensesList] = useState([]);
  const route=useRouter();
  const getBudgetInfo = async () => {
    const result = await db.select({
      id: Budgets.id,
      name: Budgets.name,
      amount: Budgets.amount,
      icon: Budgets.icon,
      totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number), 
      totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),   
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
    .where(eq(Budgets.id, params.id))
    .groupBy(Budgets.id);

    setbudgetInfo(result[0]);
    getExpensesList();
  };

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
    
  }, [user, params]);

  const getExpensesList=async()=>{
    const result=await db.select().from(Expenses)
    .where(eq(Expenses.budgetId,params.id))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
    console.log(result)
  }

  const deleteBudget=async()=>{

    const deleteExpenseResult=await db.delete(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .returning()

    if (deleteExpenseResult)
    {
      const result=await db.delete(Budgets)
      .where(eq(Budgets.id,params.id))
      .returning();
    }
    toast("Presupuesto borrado");
    route.replace("/dashboard/budgets");
  }

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between place-items-center">Mis gastos
        
          <div className= "flex gap-2 items-center">
            <EditBudget budgetInfo={budgetInfo}
            refreshData={()=>getBudgetInfo()} />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex gap-2" variant="destructive"> 
                <Trash/> Borrar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Esta segur@?</AlertDialogTitle>
                  <AlertDialogDescription>
                  Esto eliminará permanentemente su presupuesto actual junto con los gastos
                  y eliminará sus datos de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>deleteBudget()}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>

           

      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo? <BudgetItem 
        budget={budgetInfo}/>:
        <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse">
        </div>}
        <AddExpense budgetId={params.id}
        user={user}
        refreshData={()=>getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        
        <ExpenseListTable expensesList={expensesList}
        refreshData={()=>getBudgetInfo()}/>
      </div>
    </div>
  );
}

export default ExpensesScreen;
