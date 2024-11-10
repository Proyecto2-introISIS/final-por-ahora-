"use client";
import React, { useEffect, useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { db } from '@/utils/dbConfig';
import { eq, desc, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import ExpenseListTable from '../expenses/[id]/_components/ExpenseListTable'; // Asegúrate de que la ruta sea correcta
import CardInfo from '../_components/CardInfo';
import BarCharDashboard from '../_components/BarCharDashboard';
import BudgetItem from '../budgets/_components/BudgetItem';



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
       <div>
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={()=>getBudgetList()}
          />
          </div>
          
        
      </>
    );
  }
  
  function Dashboard() {
    const { user } = useUser();
  
    return (
      <div className="p-8">
        <h2 className="font-bold text-3xl">Mis gastos</h2>
        
        {user && <BudgetList user={user} />}
      </div>
    );
  }
  
  export default Dashboard;
  