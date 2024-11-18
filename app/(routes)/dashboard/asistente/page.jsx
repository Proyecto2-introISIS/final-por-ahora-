"use client"; 
import React, { useEffect, useState } from "react";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { db } from "@/utils/dbConfig"; 
import { Expenses, Budgets } from "@/utils/schema"; 
import moment from "moment";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { eq } from "drizzle-orm"; 

function VoiceExpenseAssistant({ refreshData = () => {} }) { 
  const [isClient, setIsClient] = useState(false);
  const [processing, setProcessing] = useState(false);

  
  const { listening, transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const processCommand = async () => {
    setProcessing(true);

    
    const regex = /añade un gasto de ([\d\s,]+) con el nombre (.+) a (.+)/i;
    const match = transcript.match(regex);

    if (!match) {
      toast.error("No entendí tu comando. Usa el formato: 'Añade un gasto de [cantidad] con el nombre [nombre] a [presupuesto]'.");
      setProcessing(false);
      return;
    }

    const [, amountRaw, expenseName, budgetName] = match;
    const parsedAmount = parseInt(amountRaw.replace(/\s|,/g, "")); // Limpiar el monto

    console.log("Cantidad extraída:", parsedAmount); 
    console.log("Nombre del gasto:", expenseName); 
    console.log("Nombre del presupuesto:", budgetName); 

    if (isNaN(parsedAmount)) {
      toast.error("No pude entender la cantidad. Intenta de nuevo.");
      setProcessing(false);
      return;
    }

    try {
      
      const capitalizedBudgetName = budgetName.trim().charAt(0).toUpperCase() + budgetName.trim().slice(1);
      console.log("Presupuesto capitalizado:", capitalizedBudgetName); 

      
      const budgetResult = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.name, capitalizedBudgetName));

      if (!budgetResult || budgetResult.length === 0) {
        toast.error(`No encontré el presupuesto "${budgetName}".`);
        setProcessing(false);
        return;
      }

      const budget = budgetResult[0];
      console.log("Presupuesto encontrado:", budget); 
      
      const result = await db
        .insert(Expenses)
        .values({
          name: expenseName, 
          amount: parsedAmount, 
          budgetId: budget.id, 
          createdAt: moment().format("YYYY-MM-DD"), 
        });

      if (result) {
        toast.success("Gasto añadido con éxito.");
        refreshData(); 
      } else {
        toast.error("Ocurrió un error al añadir el gasto.");
      }
    } catch (error) {
      console.error("Error procesando el comando:", error);
      toast.error("Error al procesar el comando. Intenta de nuevo.");
    }

    setProcessing(false);
  };

  
  const handleStartListening = () => {
    resetTranscript(); 
    speech.startListening({ language: "es-CO" });
  };

  
  const handleStopListening = () => {
    speech.stopListening(); 
  };

  if (!isClient) return null; 
  if (!browserSupportsSpeechRecognition) {
    return <span>Tu navegador no soporta el reconocimiento de voz.</span>;
  }

  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-screen-xl px-4 py-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            ¡Prueba nuestro asistente de voz!
            <strong className="font-extrabold text-[#8B17FF] sm:block">
              Añadir gastos nunca fue tan fácil
            </strong>
          </h1>
          <p className="mt-4 sm:text-xl/relaxed text-[#8B17FF]">
            Usa el comando: "Añade un gasto de [cantidad] con el nombre [nombre] a [presupuesto]".
          </p>

          
          <Image
            src="/cdd.png" 
            alt="Imagen del asistente de voz"
            width={1000}
            height={700}
            className="mt-5 rounded-xl border-2 border-[#8B17FF]"
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <p>{listening ? "Estoy escuchando 🦻" : "Haz clic en el botón y dime qué hacer"}</p>

            
            <Button
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring"
              onClick={handleStartListening}
              disabled={processing}
            >
              🎤 {processing ? "Procesando..." : "¿En qué te puedo ayudar?"}
            </Button>

            
            {listening && (
              <Button
                className="mt-2 bg-red-500 text-white px-6 py-2 rounded"
                onClick={handleStopListening}
              >
                Detener escucha
              </Button>
            )}

            
            {transcript && (
              <div className="mt-4 p-2 border rounded">
                <p>Transcripción: {transcript}</p>
                <Button
                  className="mt-2 bg-green-500 text-white px-6 py-2 rounded"
                  onClick={processCommand}
                  disabled={processing}
                >
                  Procesar comando
                </Button>
                <Button
                  className="mt-2 ml-2 bg-red-500 text-white px-6 py-2 rounded"
                  onClick={resetTranscript}
                >
                  Resetear
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VoiceExpenseAssistant;
