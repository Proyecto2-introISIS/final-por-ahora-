"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbConfig';
import { eq, desc } from 'drizzle-orm';
import { Receipts } from '@/utils/schema';
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

function ReceiptGallery({ refresh }) { 
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { user } = useUser();

  const getReceipts = async () => {
    const result = await db.select({
      id: Receipts.id,
      name: Receipts.name,
      imageUrl: Receipts.image_url,
      amount: Receipts.amount,
      budgetSource: Receipts.budget_source,  
      uploadedAt: Receipts.uploaded_at
    })
    .from(Receipts)
    .where(eq(Receipts.user_id, user.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Receipts.uploaded_at));

    setReceipts(result);
  };

  const deleteReceipt = async (receiptId) => {
    await db.delete(Receipts).where(eq(Receipts.id, receiptId));
    setReceipts((prevReceipts) => prevReceipts.filter((receipt) => receipt.id !== receiptId));
    toast("Factura eliminada exitosamente");
  };

  useEffect(() => {
    if (user) getReceipts();
  }, [user, refresh]); 

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {receipts?.length > 0 ? (
          receipts.map((receipt) => (
            <div key={receipt.id} className="bg-[#FFF7CE] shadow-md rounded-lg overflow-hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <img 
                    src={receipt.imageUrl} 
                    alt={receipt.name} 
                    className="w-full h-48 object-cover cursor-pointer" 
                    onClick={() => setSelectedReceipt(receipt)}
                  />
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center">
                    <img src={receipt.imageUrl} alt={receipt.name} className="w-full max-h-[500px] object-cover mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{receipt.name}</h3>
                    {receipt.amount !== undefined && (
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Gasto Total: ${parseFloat(receipt.amount || 0).toFixed(2)}
                      </p>
                    )}
                    {receipt.budgetSource && (
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Presupuesto: {receipt.budgetSource}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                      Cargado el {new Date(receipt.uploadedAt).toLocaleDateString()}
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        deleteReceipt(receipt.id);
                        setSelectedReceipt(null);
                      }}
                      className="bg-[#8B17FF] text-white hover:bg-[#FFC217]"
                    >
                      Eliminar Factura
                    </Button>
                  </div>
                  <DialogClose asChild>
                    <Button variant="secondary" className="mt-4">Cerrar</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"></div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReceiptGallery;
