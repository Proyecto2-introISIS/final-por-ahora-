"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbConfig';
import { eq, desc } from 'drizzle-orm';
import { Receipts } from '@/utils/schema';
import { useUser } from "@clerk/nextjs";

function ReceiptGallery() {
  const [receipts, setReceipts] = useState([]);
  const { user } = useUser();

  const getReceipts = async () => {
    const result = await db.select({
      id: Receipts.id,
      name: Receipts.name,
      imageUrl: Receipts.image_url,
      uploadedAt: Receipts.uploaded_at
    })
    .from(Receipts)
    .where(eq(Receipts.user_id, user.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Receipts.uploaded_at));

    setReceipts(result);
  };

  useEffect(() => {
    if (user) getReceipts();
  }, [user]);

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {receipts?.length > 0 ? (
          receipts.map((receipt, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={receipt.imageUrl} alt={receipt.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{receipt.name}</h3>
                <p className="text-sm text-gray-500">
                  Cargado el {new Date(receipt.uploadedAt).toLocaleDateString()}
                </p>
              </div>
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