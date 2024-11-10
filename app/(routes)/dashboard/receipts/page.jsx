import React from 'react'
import ReceiptList from './_components/ReceiptList'

function Receipts() {
    return (
        <div className="p-10">
          <h2 className="font-bold text-3xl"> Mis Facturas</h2>
          <ReceiptList/>
        </div>
      )
}

export default Receipts