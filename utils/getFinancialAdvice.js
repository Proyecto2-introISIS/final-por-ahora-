import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });

export async function getFinancialAdvice(totalBudget, totalSpend) {
  console.log("Presupuesto Total:", totalBudget, "Gastos Totales:", totalSpend);

  try {
    const userPrompt = `
      Basado en los siguientes datos financieros:
      - Presupuesto Total: ${totalBudget} COP
      - Gastos Totales: ${totalSpend} COP
      Soy una persona que desea mejorar su situación financiera. Mi presupuesto total es de {totalBudget} COP y he gastado {totalSpend} COP hasta la fecha. Mis gastos están distribuidos de la siguiente manera: {budgetList}. Mi objetivo es optimizar mis finanzas, reducir mis gastos innecesarios y ahorrar más dinero. ¿Qué recomendaciones me darías para lograr estos objetivos? ¿Cómo puedo redistribuir mi presupuesto de manera más eficiente para alcanzar mis metas financieras a corto y largo plazo? Por favor, ten en cuenta mi situación actual y dame consejos prácticos sobre cómo puedo mejorar mi salud financiera. En un solo parrafo sin subtitulos, se detallado pero concreto
    `;

    // Enviar el prompt a la API de Groq
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-8b-8192",  // Ajusta el modelo según tus necesidades
      messages: [{ role: "user", content: userPrompt }],
    });

    // Verificar si la respuesta contiene lo esperado
    if (chatCompletion && chatCompletion.choices && chatCompletion.choices[0]) {
      const advice = chatCompletion.choices[0].message.content;
      console.log("Consejo Financiero:", advice);
      return advice;
    } else {
      throw new Error("No se recibió una respuesta válida de la API.");
    }

  } catch (error) {
    console.error("Error al obtener el consejo financiero:", error);
    return `Lo siento, no pude obtener el consejo financiero en este momento. Error: ${error.message}`;
  }
}

export default getFinancialAdvice;


