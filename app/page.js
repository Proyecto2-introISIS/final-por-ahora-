import { useState } from 'react';
import BudgetForm from '@/components/BudgetForm';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { Toaster } from "@/components/ui/toaster";
import 'regenerator-runtime/runtime';

export default function Home() {
  const [budgets, setBudgets] = useState([]);

  const handleCreateBudget = async (budget) => {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    const newBudget = await res.json();
    setBudgets([...budgets, newBudget]);
  };

  return (
    <div>
      <Header />
      <Hero />
      <BudgetForm onSubmit={handleCreateBudget} />
      <div>
        {budgets.map(budget => (
          <div key={budget._id}>
            <h2>{budget.name}</h2>
            <ul>
              {budget.participants.map(participant => (
                <li key={participant.email}>{participant.name} ({participant.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}