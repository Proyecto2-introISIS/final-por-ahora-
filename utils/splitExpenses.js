export function splitExpenses(expenses) {
    const balances = {};
  
    expenses.forEach(expense => {
      const { amount, paidBy, splitAmong } = expense;
      const splitAmount = amount / splitAmong.length;
  
      splitAmong.forEach(participant => {
        if (!balances[participant]) balances[participant] = 0;
        if (!balances[paidBy]) balances[paidBy] = 0;
  
        if (participant === paidBy) {
          balances[paidBy] += amount - splitAmount;
        } else {
          balances[participant] -= splitAmount;
          balances[paidBy] += splitAmount;
        }
      });
    });
  
    return balances;
  }