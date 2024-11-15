"use client";
import React, { useState } from 'react';
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
import { Receipts } from '@/utils/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function AddReceipt({ refreshData }) { 
  const [receiptName, setReceiptName] = useState('');
  const [amount, setAmount] = useState('');
  const [budgetSource, setBudgetSource] = useState('');  // Nuevo estado para el presupuesto
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useUser();

  const handleUpload = async () => {
    if (selectedFile && receiptName && amount && budgetSource) {  // Validar también `budgetSource`
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;

        const result = await db.insert(Receipts).values({
          name: receiptName,
          image_url: dataUrl,
          amount: parseFloat(amount),
          budget_source: budgetSource,  // Guardar `budgetSource`
          user_id: user?.primaryEmailAddress?.emailAddress,
          uploaded_at: new Date(),
        }).returning();

        if (result) {
          toast("Factura subida exitosamente");
          setSelectedFile(null);
          setReceiptName('');
          setAmount('');
          setBudgetSource('');  // Restablecer `budgetSource`
          if (refreshData) refreshData(); 
        } else {
          toast("Error al subir la factura");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast("Debe ingresar un nombre, archivo, gasto total y presupuesto de origen");
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
                  <h2 className="text-black font-medium my-1">Gasto total de la factura</h2>
                  <Input 
                    placeholder="Ejemplo: 15000" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                    type="number" 
                    step="0.01" 
                    min="0"
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Presupuesto de origen</h2>
                  <Input 
                    placeholder="Ejemplo: Presupuesto de oficina" 
                    value={budgetSource}
                    onChange={(e) => setBudgetSource(e.target.value)} 
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
              disabled={!(selectedFile && receiptName && amount && budgetSource)}  // Asegurarse de que `budgetSource` esté presente
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