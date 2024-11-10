import React from 'react'
import AddReceipt from './AddReceipt'

function ReceiptList() {
  return (
    <div className= "mt-7">
        <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AddReceipt/>
        </div>
        
    </div>
  )
}

export default ReceiptList