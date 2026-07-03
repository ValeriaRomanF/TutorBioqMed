import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Parseo de JSON robusto entre entornos: en Vercel el body a veces ya viene parseado;
// en local (Express puro) llega sin parsear. Evita consumir el stream dos veces.
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") return next();
  express.json()(req, res, next);
});

// Array of models prioritized dynamically based on recent success/failure to prevent persistent 429 quota/503 load issues
let modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

function markModelAsSuccessful(modelName: string) {
  const index = modelsToTry.indexOf(modelName);
  if (index > 0) {
    // Move the successful model to the front so subsequent requests bypass rate limits or busy models instantly
    modelsToTry.splice(index, 1);
    modelsToTry.unshift(modelName);
    console.log(`[CARRIER] Route ${modelName} active. Sequence:`, modelsToTry);
  }
}

function markModelAsFailed(modelName: string) {
  const index = modelsToTry.indexOf(modelName);
  if (index !== -1 && modelsToTry.length > 1) {
    // Move the failed model to the end of the array so subsequent requests don't waste time on it
    if (index < modelsToTry.length - 1) {
      modelsToTry.splice(index, 1);
      modelsToTry.push(modelName);
      console.log(`[CARRIER] Route ${modelName} standby. Sequence:`, modelsToTry);
    }
  }
}

// API Endpoints
app.post("/api/generate-case", async (req, res) => {
  const { theme, customPrompt } = req.body;

  if (!theme) {
    return res.status(400).json({ error: "El tema es obligatorio." });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.TUTOR_BIOQMED;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(400).json({
      error: "api_key_missing",
      message: "No se ha configurado la clave API de Gemini (GEMINI_API_KEY) en los Secretos. Por favor, añádela en la sección de Secretos/Configuración para poder generar casos dinámicos."
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Provide detailed instructions to the model based on the theme
    const systemPrompt = `Eres un Tutor Experto en Bioquímica Médica y simulación de casos clínicos, diseñado para estudiantes de primer semestre de medicina.
Tu objetivo es ayudarles a integrar conceptos básicos de biología y química con la fisiología y fisiopatología humana de forma interactiva, amigable y rigurosa.

Pautas para la generación:
1. Nivel académico: Estudiantes de primer semestre. Evita tecnicismos excesivamente complejos. Si usas algún término clínico indispensable (ej. ictericia, esplenomegalia, oliguria, disnea), debes definirlo de forma sencilla entre paréntesis inmediatamente, ej: "oliguria (disminución en la producción de orina)".
2. Céntrate en la relevancia bioquímica del caso: cómo la estructura, enlace, digestión, transporte, almacenamiento, ruta o regulación de las moléculas se altera en la enfermedad.
3. El caso clínico debe ser creativo, realista, conciso (máximo 2 párrafos) y clínicamente coherente con la patología real asociada al tema.
4. DEFINICIÓN DE LA ENFERMEDAD: Debes proporcionar obligatoriamente un apartado breve en "diseaseDefinition" que defina de forma sencilla y concisa (1 o 2 líneas) la patología o condición principal del paciente para que el alumno aprenda su definición fundamental en este bloque.
5. PROCESO DE VERIFICACIÓN ESTRICTA DE PREGUNTAS: Proporciona exactamente 5 preguntas de opción múltiple basadas en el caso. CADA PREGUNTA Y SU RESPUESTA DEBEN ESTAR DIRECTAMENTE VINCULADAS Y PODER DEDUCIRSE O SUSTENTARSE A PARTIR DE LOS DATOS, SÍNTOMAS, ANAMNESIS O RESULTADOS DE LABORATORIO EXPUESTOS EN EL CASO CLÍNICO DEL PACIENTE. No hagas preguntas de conceptos teóricos generales que no tengan sustento directo en la información de este expediente específico. Realiza una doble verificación interna antes de responder para asegurar que la respuesta correcta sea deducible a partir del caso de este paciente.
6. Para cada pregunta, define la opción correcta (correctIndex entre 0 y 3 para A, B, C, D) y provee explicaciones detalladas para el flujo de retroalimentación:
- correctExplanation: Explicación científica y entusiasta sobre por qué es correcta bioquímica y clínicamente basándote en los datos del paciente.
- incorrectExplanation: Explicación amable aclarando el error bioquímico y guiando hacia la respuesta correcta utilizando los datos del caso.
- repassLinkUrl: Obligatoriamente provee un enlace real, activo, verificado y de excelente calidad para repasar el concepto en un sitio oficial institucional. No debe ser un artículo o paper científico.
- repassLinkLabel: Una etiqueta legible y profesional para el enlace, ej. "MedlinePlus - Cetoacidosis Diabética" o "CDC - Deshidratación".
7. Proporciona un "Dato Curioso" científico de alto valor basado en la evidencia sobre el tema, con una referencia académica formal (autor/organización, año) y un enlace web de un sitio oficial o institucional verificado y funcional (OMS, CDC, etc.) para que exploren más. No utilices PubMed ni artículos de investigación.
8. Crea un glosario con los términos complejos usados en el caso para mostrarlos por separado en una sección de apoyo.
9. PROCESO DE VERIFICACIÓN ESTRICTA DE ENLACES (LINKS):
- Todos los enlaces provistos ('repassLinkUrl' y 'linkUrl' en 'datoCurioso') deben ser 100% reales, activos, seguros, funcionales y corresponder exactamente al tema de estudio.
- NO DEBES incluir enlaces a artículos científicos específicos, papers de revistas académicas, repositorios de investigación (como PubMed, NCBI, ResearchGate, Elsevier o Springer) ni PDFs directos. Los enlaces deben dirigir únicamente a páginas web oficiales de instituciones de salud, organizaciones internacionales, enciclopedias médicas confiables o portales educativos de alta calidad (ej. MedlinePlus, OMS/WHO, CDC, Mayo Clinic, Wikipedia, Khan Academy).
- Está TERMINANTEMENTE PROHIBIDO inventar u adivinar rutas de subpáginas estáticas específicas, códigos numéricos, archivos .html o IDs de artículos específicos (ya que la gran mayoría de ellos no existen o cambian con el tiempo, causando errores 404 fatales para la experiencia del usuario).
- Para garantizar al 100% que el enlace SIEMPRE exista, esté activo y sea de utilidad inmediata, DEBES UTILIZAR ÚNICAMENTE URLs de búsquedas directas basadas en parámetros de consulta (query) en sitios de confianza. Sigue estos formatos exactos sustituyendo '[termino_busqueda]' por palabras clave simples en español (en minúsculas, sin acentos y separadas por signos + si son más de una; NUNCA dejes los corchetes o el texto '[termino_busqueda]' literal en el enlace final):
  - Buscador oficial de MedlinePlus en español (Recomendado para patologías y síntomas): 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=[termino_busqueda]&v%3Aproject=medlineplus-spanish' (ej. 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=acidosis+lactica&v%3Aproject=medlineplus-spanish' o 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=anemia+falciforme&v%3Aproject=medlineplus-spanish'). El sufijo '&v%3Aproject=medlineplus-spanish' es OBLIGATORIO y debe conservarse literal al final.
  - Wikipedia en español (Excelente para conceptos moleculares, enzimas y bioquímica general): 'https://es.wikipedia.org/w/index.php?search=[termino_busqueda]' (ej. 'https://es.wikipedia.org/w/index.php?search=acuaporina' o 'https://es.wikipedia.org/w/index.php?search=ciclo+de+krebs').
  - Khan Academy en español (Excelente para bases químicas y biológicas): 'https://es.khanacademy.org/search?page_search_query=[termino_busqueda]' (ej. 'https://es.khanacademy.org/search?page_search_query=osmosis' o 'https://es.khanacademy.org/search?page_search_query=enlace+peptidico').
  - Buscador de la Organización Mundial de la Salud (OMS/WHO): 'https://www.who.int/search?query=[termino_busqueda]' (ej. 'https://www.who.int/search?query=malaria').
  - Buscador de los Centros para el Control y la Prevención de Enfermedades (CDC): 'https://search.cdc.gov/search/?query=[termino_busqueda]' (ej. 'https://search.cdc.gov/search/?query=deshidratacion').
  - Buscador de Mayo Clinic (en español o inglés): 'https://www.mayoclinic.org/search/search-results?q=[termino_busqueda]' (ej. 'https://www.mayoclinic.org/search/search-results?q=galactosemia').
- Realiza una autoverificación mental estricta antes de generar el JSON para asegurar que la URL sea sintácticamente válida, siga estrictamente este formato de búsqueda query y no intente navegar a una ruta estática inventada. No incluyas corchetes ni texto literal de ejemplo en las URLs generadas. Ej. NUNCA generes algo como 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=[acidosis+lactica]&v%3Aproject=medlineplus-spanish', el formato correcto es 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=acidosis+lactica&v%3Aproject=medlineplus-spanish'.
10. IDENTIDAD DINÁMICA Y CONGRUENTE DEL PACIENTE: Cada vez que generes un caso, debes variar completamente la identidad del paciente (nombre completo ficticio aleatorio, género, y edad). ESTÁ TOTALMENTE PROHIBIDO usar siempre los mismos nombres (no repitas siempre Abigail, Mateo, Ernesto, Rodrigo, Valeria, etc.). Sin embargo, la edad, el género y las características del paciente deben ser rigurosamente congruentes con la epidemiología y evidencia científica donde esa enfermedad es más frecuente (ej. la gota suele ser más frecuente en hombres adultos o de mediana edad; la galactosemia, en neonatos/lactantes; la anemia falciforme, se manifiesta con frecuencia en la infancia, etc.). Asegura esta congruencia clínica real en tus elecciones.`;

    const promptText = `Genera un caso clínico único e interactivo de bioquímica médica para el bloque de estudio: "${theme}".
El alumno ha indicado que quiere repasar y enfocar la simulación específicamente en este subtema o concepto molecular de la bioquímica: "${customPrompt ? customPrompt : 'Aspectos fisiológicos y metabólicos generales del bloque'}".
Modula el caso clínico, la definición de la enfermedad y especialmente las 5 preguntas de opción múltiple para que giren en torno a y evalúen de forma rigurosa y directa este subtema solicitado, relacionándolo siempre de manera lógica con la patología del expediente del paciente.`;

    const localModels = [...modelsToTry];
    let response;
    let attempts = 6;
    let modelIdx = 0;
    let delayMs = 1500;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const modelName = localModels[modelIdx];
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                patient: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    age: { type: Type.STRING },
                    gender: { type: Type.STRING },
                  },
                  required: ["name", "age", "gender"],
                },
                narrative: {
                  type: Type.STRING,
                  description: "Narrativa del caso clínico, máximo 2 párrafos. Incluye términos médicos con definiciones breves entre paréntesis.",
                },
                diseaseDefinition: {
                  type: Type.STRING,
                  description: "Definición concisa, rigurosa y a nivel de primer semestre de medicina de la patología o condición principal del paciente.",
                },
                laboratory: {
                  type: Type.ARRAY,
                  description: "Conjunto mínimo de parámetros clínicos y laboratorios con valores y referencias.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING, description: "Nombre del parámetro, ej. pH sanguíneo, Glucosa, Ácido úrico" },
                      value: { type: Type.STRING, description: "Valor del paciente, ej. 7.15, 280 mg/dL" },
                      reference: { type: Type.STRING, description: "Rango de referencia normal, ej. 7.35 - 7.45" },
                      interpretation: { type: Type.STRING, description: "Interpretación corta, ej. Acidemia severa, Hiperglucemia" },
                    },
                    required: ["parameter", "value", "reference", "interpretation"],
                  },
                },
                questions: {
                  type: Type.ARRAY,
                  description: "Exactamente 5 preguntas de opción múltiple relacionadas con la bioquímica del caso.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionText: { type: Type.STRING, description: "Pregunta enfocada en bioquímica médica." },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Cuatro opciones que representan las respuestas A, B, C, D.",
                      },
                      correctIndex: { type: Type.INTEGER, description: "Índice de la respuesta correcta (0=A, 1=B, 2=C, 3=D)." },
                      correctExplanation: { type: Type.STRING, description: "Explicación de la respuesta correcta desde el punto de vista bioquímico." },
                      incorrectExplanation: { type: Type.STRING, description: "Explicación del error y orientación al alumno." },
                      repassLinkUrl: { type: Type.STRING, description: "URL de un sitio confiable para repasar (ej: https://medlineplus.gov/...)." },
                      repassLinkLabel: { type: Type.STRING, description: "Nombre del sitio y tema, ej: 'MedlinePlus - Acidosis Láctica'." },
                    },
                    required: [
                      "questionText",
                      "options",
                      "correctIndex",
                      "correctExplanation",
                      "incorrectExplanation",
                      "repassLinkUrl",
                      "repassLinkLabel",
                    ],
                  },
                },
                datoCurioso: {
                  type: Type.OBJECT,
                  properties: {
                    trivia: { type: Type.STRING, description: "Dato curioso científico y de alto valor sobre la molécula o patología." },
                    reference: { type: Type.STRING, description: "Referencia formal de la fuente (ej: OMS, 2023)." },
                    linkUrl: { type: Type.STRING, description: "Enlace web real y funcional para más información." },
                    linkLabel: { type: Type.STRING, description: "Etiqueta para el enlace, ej. 'Organización Mundial de la Salud - Dislipidemias'." },
                  },
                  required: ["trivia", "reference", "linkUrl", "linkLabel"],
                },
                glossary: {
                  type: Type.ARRAY,
                  description: "Glosario de términos clínicos complejos utilizados en el caso.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING, description: "El término clínico, ej: 'Esplenomegalia'." },
                      definition: { type: Type.STRING, description: "La definición sencilla, ej: 'Agrandamiento anormal del bazo'." },
                    },
                    required: ["term", "definition"],
                  },
                },
              },
              required: ["title", "patient", "narrative", "diseaseDefinition", "laboratory", "questions", "datoCurioso", "glossary"],
            },
          },
        });
        markModelAsSuccessful(modelName);
        break; // Success
      } catch (err: any) {
        const errMsg = err?.message || err?.toString() || "Error desconocido";
        const errStr = JSON.stringify(err) || err.toString() || "";
        const isTransient = err.status === 503 || err.status === 429 || errStr.includes("503") || errStr.includes("demand") || errStr.includes("UNAVAILABLE") || errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Too Many Requests");
        
        if (attempt < attempts && isTransient) {
          markModelAsFailed(modelName);
          if (modelIdx < localModels.length - 1) {
            console.log(`[TRANSITION] Adjusting query routing to ${localModels[modelIdx + 1]} (Route ${attempt}/${attempts}).`);
            modelIdx++;
            await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
            console.log(`[TRANSITION] Re-routing backup queue (Delay: ${delayMs}ms)...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            modelIdx = 0; // Reiniciar para volver a intentar con el principal
            delayMs *= 2.5;
          }
        } else {
          console.error(`[ERROR] Unrecoverable exception on model ${modelName}:`, err);
          throw err;
        }
      }
    }

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta de texto del modelo de IA.");
    }

    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating clinical case:", error);
    res.status(500).json({
      error: "server_error",
      message: "Ocurrió un error al generar el caso clínico bioquímico. Inténtalo de nuevo.",
      details: error.message || error
    });
  }
});

app.get("/api/validate-link", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.json({ reachable: false });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout (evita falsos negativos en sitios lentos)
    
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const isOk = response.status >= 200 && response.status < 400;
    res.json({ reachable: isOk });
  } catch (err) {
    res.json({ reachable: false });
  }
});

app.post("/api/verify-answer", async (req, res) => {
  const { clinicalCase, questionIndex, selectedAnswerIdx } = req.body;

  const apiKey = process.env.GEMINI_API_KEY || process.env.TUTOR_BIOQMED;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Fallback locally
    const question = clinicalCase.questions[questionIndex];
    const isCorrect = selectedAnswerIdx === question.correctIndex;
    return res.json({
      isCorrect,
      actualCorrectIndex: question.correctIndex,
      feedbackExplanation: isCorrect ? question.correctExplanation : question.incorrectExplanation
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const question = clinicalCase.questions[questionIndex];
    const chosenOptionText = question.options[selectedAnswerIdx];

    const systemPrompt = `Eres un Tutor de Bioquímica Médica de primer nivel. Tu tarea es verificar la respuesta de un estudiante a una pregunta de opción múltiple de un caso clínico específico de primer semestre de medicina.
A veces, el generador automático de preguntas puede cometer un error en el "correctIndex" (índice correcto pre-calculado) o en las explicaciones de la pregunta. Tú debes actuar como la autoridad académica máxima, verificar con absoluto rigor científico si la opción que eligió el alumno es bioquímicamente la respuesta correcta o no, y ofrecer una explicación impecable y amigable.

Responde ÚNICAMENTE con un objeto JSON válido con los siguientes campos:
1. "isCorrect": true/false (indica si la opción seleccionada por el estudiante es bioquímica y clínicamente la respuesta más adecuada y correcta para la pregunta planteada).
2. "actualCorrectIndex": número entre 0 y 3 (el índice de la opción realmente correcta).
3. "feedbackExplanation": string (una explicación clara, motivadora y científicamente rigurosa en español para el estudiante, fundamentando por qué la respuesta que seleccionó es correcta o incorrecta en base al caso clínico).`;

    const promptText = `
Caso Clínico:
Título: ${clinicalCase.title}
Paciente: ${clinicalCase.patient?.name} (${clinicalCase.patient?.age} años, ${clinicalCase.patient?.gender})
Narrativa: ${clinicalCase.narrative}
Explicación de la enfermedad: ${clinicalCase.diseaseDefinition}

Resultados de Laboratorio:
${JSON.stringify(clinicalCase.laboratory)}

Pregunta a evaluar (Pregunta #${questionIndex + 1}):
Texto: ${question.questionText}
Opciones:
0: ${question.options[0]}
1: ${question.options[1]}
2: ${question.options[2]}
3: ${question.options[3]}

Índice pre-definido como correcto: ${question.correctIndex}

Selección del estudiante:
Índice seleccionado por el estudiante: ${selectedAnswerIdx}
Texto de la opción seleccionada: "${chosenOptionText}"

Por favor, determina si la opción seleccionada es bioquímica y fisiopatológicamente la correcta. Si el índice pre-definido original estuviera equivocado, corrígelo e indícalo en "actualCorrectIndex", asegurándote de que coincida con la ciencia médica real. Devuelve el JSON correspondiente.
`;

    const localModels = [...modelsToTry];
    let response;
    let attempts = 5;
    let modelIdx = 0;
    let delayMs = 1000;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const modelName = localModels[modelIdx];
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isCorrect: { type: Type.BOOLEAN, description: "True si la opción del alumno es la correcta." },
                actualCorrectIndex: { type: Type.INTEGER, description: "El índice real de la opción correcta (0-3)." },
                feedbackExplanation: { type: Type.STRING, description: "Explicación académica detallada de la retroalimentación en español." }
              },
              required: ["isCorrect", "actualCorrectIndex", "feedbackExplanation"]
            }
          }
        });
        markModelAsSuccessful(modelName);
        break; // success
      } catch (err: any) {
        const errMsg = err?.message || err?.toString() || "Error desconocido";
        const errStr = JSON.stringify(err) || err.toString() || "";
        const isTransient = err.status === 503 || err.status === 429 || errStr.includes("503") || errStr.includes("demand") || errStr.includes("UNAVAILABLE") || errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Too Many Requests");
        
        if (attempt < attempts && isTransient) {
          markModelAsFailed(modelName);
          if (modelIdx < localModels.length - 1) {
            console.log(`[TRANSITION] Adjusting verification routing to ${localModels[modelIdx + 1]} (Route ${attempt}/${attempts}).`);
            modelIdx++;
            await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
            console.log(`[TRANSITION] Re-routing verification queue (Delay: ${delayMs}ms)...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            modelIdx = 0; // Reiniciar para volver a intentar con el principal
            delayMs *= 2.5;
          }
        } else {
          console.error(`[ERROR] Unrecoverable exception during verification on model ${modelName}:`, err);
          throw err;
        }
      }
    }

    const text = response?.text;
    if (!text) {
      throw new Error("No se recibió respuesta del modelo de verificación.");
    }

    const verificationResult = JSON.parse(text.trim());
    res.json(verificationResult);
  } catch (err: any) {
    console.error("Error verifying answer:", err);
    // Secure failover
    const question = clinicalCase.questions[questionIndex];
    const isCorrect = selectedAnswerIdx === question.correctIndex;
    res.json({
      isCorrect,
      actualCorrectIndex: question.correctIndex,
      feedbackExplanation: isCorrect ? question.correctExplanation : question.incorrectExplanation,
      fallbackUsed: true
    });
  }
});

// Se exporta la app de Express para reutilizarla como función serverless en Vercel
// (api/index.ts) y como servidor local de desarrollo (server.ts).
export default app;
