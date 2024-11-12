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
import { Receipts } from '@/utils/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

function AddReceipt({ refreshData }) {
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
          if (refreshData) refreshData();
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
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md w-20">
            <h2 className="text-3xl">+</h2>
            <h2>Agregar Factura</h2>
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
