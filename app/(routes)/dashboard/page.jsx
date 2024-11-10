"use client";
import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BarCharDashboard from './_components/BarCharDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/[id]/_components/ExpenseListTable';

function BudgetList({ user }) {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList,setExpensesList] = useState([]);
  const getBudgetList = async () => {
    const result = await db
      .select({
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
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };

  const getAllExpenses=async()=>{
    const result=await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
    .orderBy((desc(Expenses.id)));
    setExpensesList(result);
    
  }

  useEffect(() => {
    if (user) getBudgetList();
  }, [user]);

  return (
    <>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarCharDashboard
          budgetList={budgetList}
          />
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={()=>getBudgetList()}
        />
        </div>
        <div className='grid gap-5'>
          <h2 className="font-bold text-lg">Últimos presupuestos</h2>
          {budgetList.map((budget,index)=>(
            <BudgetItem budget={budget} key={index}/>
          ))}
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl">Hola, {user?.fullName}</h2>
      <p className="text-gray-500">
        Esto es lo que está pasando con tu dinero, administremos tus gastos
      </p>
      {user && <BudgetList user={user} />}
    </div>
  );
}

export default Dashboard;
