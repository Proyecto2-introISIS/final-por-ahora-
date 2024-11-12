import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarCharDashboard({ budgetList }) {
  // Calcular el valor restante para cada presupuesto
  const data = budgetList.map(budget => ({
    ...budget,
    remaining: budget.amount - budget.totalSpend
  }));

  // Formatear los valores con puntos de división y signo de pesos
  const formatCurrency = (value) => `$${value.toLocaleString('es-CO')}`;

  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Actividad</h2>
      <ResponsiveContainer width={"80%"} height={300} className="ml-auto mr-auto">
        <BarChart
          data={data}
          margin={{
            top: 7,
            left: 50 // Ajustar el margen izquierdo para centrar la gráfica
          }}
        >
          <XAxis dataKey="name" stroke="#000" tick={{ fill: '#000' }} />
          <YAxis tickFormatter={formatCurrency} stroke="#000" tick={{ fill: '#000' }} />
          <Tooltip formatter={formatCurrency} />
          <Legend formatter={(value) => {
            if (value === 'totalSpend') return 'Total gastado';
            if (value === 'remaining') return 'Total restante';
            return value;
          }} />
          <Bar dataKey="totalSpend" stackId="a" fill="#8B17FF" name="Total gastado" />
          <Bar dataKey="remaining" stackId="a" fill="#C1B1FF" name="Total restante" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarCharDashboard