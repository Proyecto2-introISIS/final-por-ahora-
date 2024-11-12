"use client"

import React, { useState } from 'react';
import AddReceipt from './AddReceipt';
import ReceiptGallery from './ReceiptGallery';

function ReceiptList() {
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev); 
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AddReceipt refreshData={refreshData} /> 
      </div>
      <ReceiptGallery refresh={refresh} /> 
    </div>
  );
}

export default ReceiptList;