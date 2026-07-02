import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints
app.post("/api/generate-case", async (req, res) => {
  const { theme, customPrompt } = req.body;

  if (!theme) {
    return res.status(400).json({ error: "El tema es obligatorio." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
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
- Todos los enlaces provistos ('repassLinkUrl' y 'linkUrl' en 'datoCurioso') deben ser 100% reales, activos, estar en español o inglés y corresponder exactamente al tema de estudio.
- NO DEBES incluir enlaces a artículos científicos, papers de revistas académicas o repositorios de investigación (como PubMed, NCBI, ResearchGate, Elsevier o Springer). Los enlaces deben dirigir únicamente a páginas web oficiales de instituciones de salud, organizaciones internacionales o enciclopedias médicas confiables (ej. MedlinePlus, OMS/WHO, CDC, Mayo Clinic o Khan Academy).
- Está TERMINANTEMENTE PROHIBIDO inventar rutas de subpáginas específicas o códigos alfanuméricos aleatorios de artículos que puedan cambiar o no existir (lo cual generaría errores 404).
- Para garantizar que el enlace SIEMPRE exista y esté activo, utiliza preferentemente URLs de búsquedas directas o índices temáticos estables de sitios oficiales. Sigue estos formatos exactos:
  - Buscador oficial de MedlinePlus en español: 'https://find.medlineplus.gov/search?query=[tema_relevante]' (ej. 'https://find.medlineplus.gov/search?query=deshidratacion+isotonica' o 'https://find.medlineplus.gov/search?query=gota+acido+urico').
  - Enlace directo a temas estables de MedlinePlus: 'https://medlineplus.gov/spanish/[nombre_tema].html' (ej. 'https://medlineplus.gov/spanish/diabetes.html').
  - Buscador de la Organización Mundial de la Salud (OMS/WHO): 'https://www.who.int/es/home/search?indexBy=keywords&searchText=[tema_relevante]'.
  - Buscador de los Centros para el Control y la Prevención de Enfermedades (CDC): 'https://search.cdc.gov/search/?query=[tema_relevante]'.
  - Enlaces de temas de Khan Academy estables: 'https://es.khanacademy.org/science/biology' o 'https://es.khanacademy.org/science/health-and-medicine'.
- Realiza una autoverificación mental antes de generar el JSON para asegurar que la URL sea sintácticamente válida, apunte a un dominio institucional legítimo y oficial, y que no corresponda a un artículo o paper científico.
10. IDENTIDAD DINÁMICA Y CONGRUENTE DEL PACIENTE: Cada vez que generes un caso, debes variar completamente la identidad del paciente (nombre completo ficticio aleatorio, género, y edad). ESTÁ TOTALMENTE PROHIBIDO usar siempre los mismos nombres (no repitas siempre Abigail, Mateo, Ernesto, Rodrigo, Valeria, etc.). Sin embargo, la edad, el género y las características del paciente deben ser rigurosamente congruentes con la epidemiología y evidencia científica donde esa enfermedad es más frecuente (ej. la gota suele ser más frecuente en hombres adultos o de mediana edad; la galactosemia, en neonatos/lactantes; la anemia falciforme, se manifiesta con frecuencia en la infancia, etc.). Asegura esta congruencia clínica real en tus elecciones.`;

    const promptText = `Genera un caso clínico único e interactivo de bioquímica médica para el bloque de estudio: "${theme}".
El alumno ha indicado que quiere repasar y enfocar la simulación específicamente en este subtema o concepto molecular de la bioquímica: "${customPrompt ? customPrompt : 'Aspectos fisiológicos y metabólicos generales del bloque'}".
Modula el caso clínico, la definición de la enfermedad y especialmente las 5 preguntas de opción múltiple para que giren en torno a y evalúen de forma rigurosa y directa este subtema solicitado, relacionándolo siempre de manera lógica con la patología del expediente del paciente.`;

    let response;
    let attempts = 4;
    let delayMs = 1000;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
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
        break; // Success
      } catch (err: any) {
        console.warn(`Intento ${attempt} de llamar a la API de Gemini falló:`, err);
        const errStr = JSON.stringify(err) || err.toString() || "";
        const isTransient = err.status === 503 || err.status === 429 || errStr.includes("503") || errStr.includes("demand") || errStr.includes("UNAVAILABLE") || errStr.includes("429") || errStr.includes("Too Many Requests");
        if (attempt < attempts && isTransient) {
          console.log(`Reintentando en ${delayMs}ms debido a indisponibilidad o alta demanda temporal de la API...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2.5; // Exponential backoff with a factor of 2.5
        } else {
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

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
