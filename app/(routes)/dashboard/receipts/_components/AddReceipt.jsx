"use client"
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

function AddReceipt({children}) {
  return (
    <div>
        
        <Dialog>
            <DialogTrigger asChild>
            <div className= "bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
                <h2 className= "text-3xl">+</h2>
                <h2>Agregar Factura</h2>
            </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Agregar Factura</DialogTitle>
                <DialogDescription asChild>

                    <div>

                      <h2>Selecciona el archivo a  cargar</h2>
                      <div className=' mt-3 gap-2 p-3 rounded-md border'>
                        
                        <input type="file"/>
                      </div>
                      <div className= "mt-2">
                        <label>¿De qué es la factura?*</label>
                        <Input placeholder="ej: Mercado"/> 
                      </div>
                        
                    </div>
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button>Upload</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    </div>
  )
}

export default AddReceipt