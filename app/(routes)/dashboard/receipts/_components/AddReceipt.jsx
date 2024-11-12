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

function AddReceipt({ refreshData }) { // Recibe refreshData como prop
  const [receiptName, setReceiptName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useUser();

  const handleUpload = async () => {
    if (selectedFile && receiptName) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;

        const result = await db.insert(Receipts).values({
          name: receiptName,
          image_url: dataUrl,
          user_id: user?.primaryEmailAddress?.emailAddress,
          uploaded_at: new Date(),
        }).returning();

        if (result) {
          toast("Factura subida exitosamente");
          setSelectedFile(null);
          setReceiptName('');
          if (refreshData) refreshData(); // Llama a refreshData aquí
        } else {
          toast("Error al subir la factura");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast("Debe ingresar un nombre y seleccionar un archivo");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-purple-700 p-5 rounded-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg w-full md:w-40 h-20 text-center text-white">
            <h2 className="text-4xl font-bold">+</h2>
            <h2 className="text-md mt-2">Agregar Factura</h2>
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
              disabled={!(selectedFile && receiptName)}
              className="mt-3 w-full"
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