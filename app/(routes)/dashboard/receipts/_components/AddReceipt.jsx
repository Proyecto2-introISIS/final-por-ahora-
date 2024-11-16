"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from '@/utils/dbConfig';
import { Budgets, Receipts, Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

//... (el resto de los imports y configuración se mantienen)

function AddReceipt({ refreshData }) { 
  const [receiptName, setReceiptName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [budgetId, setBudgetId] = useState('');
  const [amount, setAmount] = useState('');
  const [budgets, setBudgets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user) {
        const result = await db.select({
          id: Budgets.id,
          name: Budgets.name,
          amount: Budgets.amount,
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress));
        setBudgets(result);
      }
    };

    fetchBudgets();
  }, [user]);

  const handleUpload = async () => {
    if (selectedFile && receiptName && budgetId && amount) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;

        const result = await db.insert(Receipts).values({
          name: receiptName,
          image_url: dataUrl,
          budget_id: budgetId,
          amount: parseFloat(amount),
          user_id: user?.primaryEmailAddress?.emailAddress,
          uploaded_at: new Date(),
        }).returning();

        if (result) {
          const budget = budgets.find(b => b.id === parseInt(budgetId));
          if (budget) {
            const newAmount = budget.amount - parseFloat(amount);

            await db.update(Budgets)
              .set({ amount: newAmount })
              .where(eq(Budgets.id, budgetId))
              .returning();

            // Crear un gasto en la base de datos de gastos con formato de fecha DD/MM/YYYY
            if (parseFloat(amount) > 0) {
              const today = new Date();
              const createdAt = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

              await db.insert(Expenses).values({
                name: receiptName,
                amount: parseFloat(amount),
                budgetId: budgetId,
                createdAt: createdAt,
              }).returning();
            }

            toast("Factura subida exitosamente");
            toast("Presupuesto editado exitosamente");
            setSelectedFile(null);
            setReceiptName('');
            setBudgetId('');
            setAmount('');
            if (refreshData) refreshData(); 
          } else {
            toast("Presupuesto no encontrado");
          }
        } else {
          toast("Error al subir la factura");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast("Debe ingresar un nombre, seleccionar un archivo, un presupuesto y el monto total");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-[#824cff] p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl text-white">+</h2>
            <h2 className="text-white">Agregar Factura</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Factura</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Nombre de la factura</h2>
                  <Input 
                    placeholder="Ejemplo: Recibo de supermercado" 
                    value={receiptName}
                    onChange={(e) => setReceiptName(e.target.value)} 
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Presupuesto de origen</h2>
                  <select
                    value={budgetId}
                    onChange={(e) => setBudgetId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Seleccione un presupuesto</option>
                    {budgets.map((budget) => (
                      <option key={budget.id} value={budget.id}>
                        {budget.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Monto total</h2>
                  <Input 
                    placeholder="Ejemplo: 50000" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Selecciona el archivo</h2>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cerrar</Button>
            </DialogClose>
            <Button
              onClick={handleUpload}
              disabled={!(selectedFile && receiptName && budgetId && amount)}
              className="mt-3 w-full bg-[#8B17FF] text-white hover:bg-[#FFC217]"
            >
              Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddReceipt;
