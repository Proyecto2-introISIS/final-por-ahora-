import React from 'react';
import AddReceipt from './AddReceipt';
import ReceiptGallery from './ReceiptGallery'; // Importa el componente de la galería

function ReceiptList() {
  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AddReceipt />
      </div>
      <ReceiptGallery /> {/* Llama a ReceiptGallery debajo de AddReceipt */}
    </div>
  );
}

export default ReceiptList;