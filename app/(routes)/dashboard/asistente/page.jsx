"use client"
import React, { useEffect, useState } from "react";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { db } from "@/utils/dbConfig"; // Configuración de Drizzle
import { Expenses, Budgets } from "@/utils/schema"; // Esquema de las tablas
import moment from "moment";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function VoiceExpenseAssistant({ refreshData }) {
  const [isClient, setIsClient] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Para manejar el estado de la transcripción y la escucha
  const { listening, transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const processCommand = async () => {
    setProcessing(true);

    // Expresión regular para extraer el monto, nombre del gasto y nombre del presupuesto
    const regex = /añade un gasto de ([\d\s,]+) con el nombre (.+) a (.+)/i;
    const match = transcript.match(regex);

    if (!match) {
      toast.error("No entendí tu comando. Usa el formato: 'Añade un gasto de [cantidad] con el nombre [nombre] a [presupuesto]'.");
      setProcessing(false);
      return;
    }

    const [, amountRaw, expenseName, budgetName] = match;
    const parsedAmount = parseInt(amountRaw.replace(/\s|,/g, "")); // Limpiar el monto

    console.log("Cantidad extraída:", parsedAmount); // Debug: Imprimir la cantidad extraída
    console.log("Nombre del gasto:", expenseName); // Debug: Imprimir el nombre del gasto
    console.log("Nombre del presupuesto:", budgetName); // Debug: Imprimir el nombre del presupuesto

    if (isNaN(parsedAmount)) {
      toast.error("No pude entender la cantidad. Intenta de nuevo.");
      setProcessing(false);
      return;
    }

    try {
      // Normalizar el nombre del presupuesto (en minúsculas)
      const normalizedBudgetName = budgetName.trim().toLowerCase();
      console.log("Presupuesto normalizado:", normalizedBudgetName); // Debug: Ver el presupuesto normalizado

      // Buscar el presupuesto en la base de datos
      const budget = await db.query.budgets.findFirst({
        where: {
          name: normalizedBudgetName, // Buscar presupuesto por nombre exacto
        },
      });

      if (!budget) {
        toast.error(`No encontré el presupuesto "${budgetName}".`);
        setProcessing(false);
        return;
      }

      console.log("Presupuesto encontrado:", budget); // Debug: Imprimir el presupuesto encontrado

      // Insertar el nuevo gasto con la misma lógica del ejemplo
      const result = await db.insert(Expenses).values({
        name: expenseName, // Nombre del gasto
        amount: parsedAmount, // Monto del gasto
        budgetId: budget.id, // ID del presupuesto encontrado
        createdAt: moment().format("YYYY-MM-DD"), // Fecha actual
      });

      if (result) {
        toast.success("Gasto añadido con éxito.");
        refreshData(); // Actualizar los datos después de añadir el gasto
      } else {
        toast.error("Ocurrió un error al añadir el gasto.");
      }
    } catch (error) {
      console.error("Error procesando el comando:", error);
      toast.error("Error al procesar el comando. Intenta de nuevo.");
    }

    setProcessing(false);
  };

  // Manejar el inicio de escucha
  const handleStartListening = () => {
    resetTranscript(); // Resetear la transcripción antes de iniciar
    speech.startListening({ language: "es-CO" });
  };

  // Manejar el detener la escucha
  const handleStopListening = () => {
    speech.stopListening(); // Detener escucha
  };

  if (!isClient) return null; // Evita el renderizado en SSR
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

          {/* Imagen */}
          <Image
            src="/cdd.png" 
            alt="Imagen del asistente de voz"
            width={1000}
            height={700}
            className="mt-5 rounded-xl border-2 border-[#8B17FF]"
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <p>{listening ? "Estoy escuchando 🦻" : "Haz clic en el botón y dime qué hacer"}</p>

            {/* Botón para iniciar la escucha */}
            <Button
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring"
              onClick={handleStartListening}
              disabled={processing}
            >
              🎤 {processing ? "Procesando..." : "¿En qué te puedo ayudar?"}
            </Button>

            {/* Botón para detener la escucha */}
            {listening && (
              <Button
                className="mt-2 bg-red-500 text-white px-6 py-2 rounded"
                onClick={handleStopListening}
              >
                Detener escucha
              </Button>
            )}

            {/* Mostrar transcripción */}
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
