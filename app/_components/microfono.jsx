"use client";
import speech, { useSpeechRecognition } from 'react-speech-recognition';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import 'regenerator-runtime/runtime';

function App_microfono() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // Solo se monta en el cliente
  }, []);

  const { listening, transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Verificar si el navegador soporta el reconocimiento de voz
  if (!isClient) return null; // Evita el renderizado en SSR
  if (!browserSupportsSpeechRecognition) {
    return <span>El navegador no soporta el reconocimiento de voz.</span>;
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {listening ? (
        <p> Habla, estoy escuchando 🦻 </p>
      ) : ( 
        <p> Dale click al botón y dime qué hacer</p>
      )}
        
      <button className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring"
        onClick={() => {
          speech.startListening({ language: 'es-CO' });
        }}>
        🎤 ¿En qué te puedo ayudar?
      </button>
      {transcript && <div>{transcript}</div>}
    </div>
  );
}

export default App_microfono;
