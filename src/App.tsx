import React, { useState } from "react";
import { 
  Droplet, 
  Activity, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Dna, 
  Award, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText, 
  Lightbulb, 
  Stethoscope, 
  Loader2, 
  User, 
  Calendar, 
  ArrowLeft, 
  ExternalLink, 
  HelpCircle,
  Clock,
  FlaskConical,
  MessageSquareQuote
} from "lucide-react";
import { THEMES, FALLBACK_CASES } from "./data";
import { ClinicalCase, ThemeInfo } from "./types";
import { motion, AnimatePresence } from "motion/react";

// Explicit mappings for Tailwind v4 compile-time safe coloring
const themeColors: Record<string, {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  hover: string;
}> = {
  blue: {
    bg: "bg-blue-50/80",
    text: "text-blue-600",
    border: "border-blue-200/80",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    ring: "group-hover:ring-blue-100",
    hover: "hover:border-blue-300 hover:bg-blue-50/20"
  },
  purple: {
    bg: "bg-purple-50/80",
    text: "text-purple-600",
    border: "border-purple-200/80",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    ring: "group-hover:ring-purple-100",
    hover: "hover:border-purple-300 hover:bg-purple-50/20"
  },
  amber: {
    bg: "bg-amber-50/80",
    text: "text-amber-600",
    border: "border-amber-200/80",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    ring: "group-hover:ring-amber-100",
    hover: "hover:border-amber-300 hover:bg-amber-50/20"
  },
  emerald: {
    bg: "bg-emerald-50/80",
    text: "text-emerald-600",
    border: "border-emerald-200/80",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    ring: "group-hover:ring-emerald-100",
    hover: "hover:border-emerald-300 hover:bg-emerald-50/20"
  },
  rose: {
    bg: "bg-rose-50/80",
    text: "text-rose-600",
    border: "border-rose-200/80",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    ring: "group-hover:ring-rose-100",
    hover: "hover:border-rose-300 hover:bg-rose-50/20"
  },
  violet: {
    bg: "bg-violet-50/80",
    text: "text-violet-600",
    border: "border-violet-200/80",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    ring: "group-hover:ring-violet-100",
    hover: "hover:border-violet-300 hover:bg-violet-50/20"
  }
};

// Safe, React 19 compatible simple markdown parser
export function RichText({ text }: { text: string }) {
  if (!text) return null;
  
  // Split by markdown links first [text](url)
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  
  return (
    <span>
      {parts.map((part, index) => {
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [_, label, url] = linkMatch;
          return (
            <a 
              key={index} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-0.5 font-medium transition-colors"
            >
              {label}
              <ExternalLink className="w-3.5 h-3.5 inline-block" />
            </a>
          );
        }
        
        // Split by bold **text**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={index}>
            {boldParts.map((bPart, bIndex) => {
              const boldMatch = bPart.match(/\*\*([^*]+)\*\*/);
              if (boldMatch) {
                return <strong key={bIndex} className="font-semibold text-slate-900">{boldMatch[1]}</strong>;
              }
              return bPart;
            })}
          </span>
        );
      })}
    </span>
  );
}

// Map string icon names to Lucide elements
const IconMapper = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Droplet":
      return <Droplet className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Dna":
      return <Dna className={className} />;
    default:
      return <FlaskConical className={className} />;
  }
};

export default function App() {
  // Application State
  const [phase, setPhase] = useState<"selection" | "case" | "questions" | "summary">("selection");
  const [selectedTheme, setSelectedTheme] = useState<ThemeInfo | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string>("Agua");
  const [customPrompt, setCustomPrompt] = useState("");
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [apiKeyMissingError, setApiKeyMissingError] = useState<string | null>(null);

  // Quiz States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // indexes of chosen options
  const [score, setScore] = useState(0);

  // Start case generation (API or Fallback)
  const handleSelectTheme = async (theme: ThemeInfo, forceFallback = false) => {
    setSelectedTheme(theme);
    setLoading(true);
    setApiKeyMissingError(null);
    setIsFallbackMode(false);

    if (forceFallback) {
      setTimeout(() => {
        setClinicalCase(FALLBACK_CASES[theme.id]);
        setIsFallbackMode(true);
        setLoading(false);
        setPhase("case");
        resetQuiz();
      }, 700);
      return;
    }

    try {
      const response = await fetch("/api/generate-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          theme: theme.id,
          customPrompt: customPrompt.trim() || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setClinicalCase(data);
        setPhase("case");
        resetQuiz();
      } else if (data.error === "api_key_missing") {
        setApiKeyMissingError(data.message);
      } else {
        throw new Error(data.message || "Error al obtener respuesta del servidor");
      }
    } catch (err: any) {
      console.warn("API request failed. Falling back to local high-quality medical cases.", err);
      // Fallback automatically
      setClinicalCase(FALLBACK_CASES[theme.id]);
      setIsFallbackMode(true);
      setPhase("case");
      resetQuiz();
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsQuestionAnswered(false);
    setUserAnswers([]);
    setScore(0);
  };

  const handleStartQuestions = () => {
    setPhase("questions");
  };

  const handleSelectOption = (idx: number) => {
    if (isQuestionAnswered) return;
    setSelectedAnswerIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIdx === null || isQuestionAnswered || !clinicalCase) return;

    const currentQuestion = clinicalCase.questions[currentQuestionIdx];
    const isCorrect = selectedAnswerIdx === currentQuestion.correctIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, selectedAnswerIdx]);
    setIsQuestionAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!clinicalCase) return;
    
    if (currentQuestionIdx < clinicalCase.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswerIdx(null);
      setIsQuestionAnswered(false);
    } else {
      setPhase("summary");
    }
  };

  const handleRestart = () => {
    setPhase("selection");
    setSelectedTheme(null);
    setClinicalCase(null);
    setCustomPrompt("");
    setApiKeyMissingError(null);
    setIsFallbackMode(false);
    resetQuiz();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Bento Header */}
      <header id="app-header" className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 sm:px-8 shrink-0 border-b border-slate-700 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleRestart}>
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-slate-900 shadow-sm">
            <Stethoscope className="w-4.5 h-4.5 text-slate-900" />
          </div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight font-display text-white">
            Tutor de Bioquímica Médica 
            <span className="text-slate-400 font-normal text-xs ml-2 hidden sm:inline">| Simulación v1.0</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Estudiante</p>
            <p className="text-xs font-semibold text-slate-300">Primer Semestre • Medicina</p>
          </div>
          
          {phase !== "selection" && selectedTheme && (
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono">
              <IconMapper name={selectedTheme.icon} className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{selectedTheme.name}</span>
            </div>
          )}

          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-emerald-400 shadow-inner">
            EM
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-start">
        
        {/* Loading Spinner Screen */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center min-h-[450px]"
            >
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 max-w-md w-full text-center flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <FlaskConical className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-lg">Sintetizando Expediente Clínico...</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    El tutor está diseñando un caso médico bioquímico {customPrompt ? "con tus pautas personalizadas" : "único"} basado en procesos fisiológicos reales de alta fidelidad.
                  </p>
                </div>
                <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-3 text-left">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Sabías que:</strong> Un análisis de caso clínico ayuda a retener hasta un 40% más los conceptos metabólicos complejos en comparación con la lectura memorística pasiva.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* API Key Missing error view */}
          {!loading && apiKeyMissingError && (
            <motion.div 
              key="api-error"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center min-h-[450px]"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100 max-w-lg w-full text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-xl">¿Sin Clave API de Gemini? No hay problema</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    No se ha detectado una clave API activa. No te preocupes, hemos preparado **casos clínicos de respaldo extremadamente completos y revisados académicamente** para los 6 temas fundamentales.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left text-xs text-slate-500 leading-relaxed flex flex-col gap-2">
                  <span className="font-semibold text-slate-700">Para una experiencia dinámica posterior:</span>
                  <p>Puedes añadir tu clave <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-indigo-600">GEMINI_API_KEY</code> en la sección de <strong>Secrets</strong> de AI Studio y reiniciar la simulación para generar casos ilimitados.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => selectedTheme && handleSelectTheme(selectedTheme, true)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Usar Caso de Respaldo Académico 🩺
                  </button>
                  <button
                    onClick={handleRestart}
                    className="sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-5 rounded-xl transition-colors text-xs"
                  >
                    Volver a Temas
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 1: Theme Selection Screen */}
          {!loading && !apiKeyMissingError && phase === "selection" && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow grid grid-cols-12 gap-5 items-start"
            >
              
              {/* Introduction Column (Bento Cards Span 4) */}
              <div id="intro-column" className="col-span-12 lg:col-span-4 flex flex-col gap-5 h-full">
                
                {/* Intro Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4 flex-1 justify-between">
                  <div>
                    <div className="inline-flex w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 items-center justify-center mb-3">
                      <Award className="w-5.5 h-5.5" />
                    </div>
                    <h2 className="font-display font-bold text-slate-900 text-xl leading-tight">¡Hola, futuro médico!</h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Soy tu **Tutor de Bioquímica Médica**. Juntos integraremos las bases macromoleculares y biológicas con la práctica clínica diaria de manera amigable, apasionante y rigurosa.
                    </p>
                  </div>
                  
                  <div className="h-px bg-slate-100 my-2" />
                  
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Guía de Entrenamiento</h4>
                    <ul className="mt-2.5 space-y-2.5">
                      <li className="flex gap-2.5 text-xs text-slate-600">
                        <span className="flex-none w-5 h-5 rounded-full bg-slate-100 text-indigo-600 font-bold flex items-center justify-center text-[10px]">1</span>
                        <span>Selecciona uno de los **6 bloques obligatorios** de primer semestre.</span>
                      </li>
                      <li className="flex gap-2.5 text-xs text-slate-600">
                        <span className="flex-none w-5 h-5 rounded-full bg-slate-100 text-indigo-600 font-bold flex items-center justify-center text-[10px]">2</span>
                        <span>Estudiaremos un **Caso Clínico interactivo** con expediente, notas y laboratorios.</span>
                      </li>
                      <li className="flex gap-2.5 text-xs text-slate-600">
                        <span className="flex-none w-5 h-5 rounded-full bg-slate-100 text-indigo-600 font-bold flex items-center justify-center text-[10px]">3</span>
                        <span>Responderás **5 preguntas de opción múltiple** con retroalimentación científica paso a paso.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Specific Biochemistry Topic to Review (Bento style) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h3 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">Generador por Tema de Repaso</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Personaliza y genera tu propio caso clínico eligiendo un bloque académico e indicando el subtema o concepto molecular exacto que quieres evaluar.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">1. Bloque de la Asignatura</label>
                    <select
                      value={selectedBlockId}
                      onChange={(e) => setSelectedBlockId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {THEMES.map((t) => (
                        <option key={t.id} value={t.id}>
                          Bloque {t.number}: {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">2. Subtema o Concepto Específico (Opcional)</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      maxLength={150}
                      placeholder="Ej. Ciclo de Krebs, Enlaces peptídicos, Mutación posicional, Regulación enzimática..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20 bg-slate-50 text-slate-700 font-medium placeholder-slate-400 transition-all"
                    />
                    <div className="text-right text-[9px] text-slate-400 font-semibold font-mono">
                      {customPrompt.length}/150 CARACTERES
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const theme = THEMES.find(t => t.id === selectedBlockId);
                      if (theme) {
                        handleSelectTheme(theme);
                      }
                    }}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generando Caso...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Generar Caso Clínico 🧬
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grid Column (Bento Cards Span 8) */}
              <div id="grid-column" className="col-span-12 lg:col-span-8 flex flex-col h-full gap-4">
                <div className="mb-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase rounded tracking-wider font-mono">Programa Académico Activo</span>
                  <h3 className="font-display font-bold text-slate-900 text-lg mt-1">Elige un Tema de Estudio</h3>
                  <p className="text-xs text-slate-500">Selecciona el bloque del temario de bioquímica que deseas simular hoy:</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {THEMES.map((theme) => {
                    const colorStyles = themeColors[theme.color] || themeColors.blue;

                    return (
                      <motion.div
                        key={theme.id}
                        whileHover={{ y: -3, scale: 1.01 }}
                        onClick={() => handleSelectTheme(theme)}
                        className={`group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 transition-all shadow-xs flex flex-col justify-between gap-4 ${colorStyles.hover}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`w-11 h-11 rounded-xl ${colorStyles.bg} flex items-center justify-center ${colorStyles.text} transition-all group-hover:scale-105 group-hover:ring-4 ${colorStyles.ring} border ${colorStyles.border}`}>
                            <IconMapper name={theme.icon} className="w-5.5 h-5.5" />
                          </div>
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-full uppercase border border-slate-200">
                            Bloque {theme.number}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {theme.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {theme.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <span className="text-[10px] font-mono font-medium text-slate-400">Asociación común: <span className="font-bold text-slate-500">{theme.suggestedPathology}</span></span>
                          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 2: Clinical Case Presentation */}
          {!loading && !apiKeyMissingError && phase === "case" && clinicalCase && selectedTheme && (
            <motion.div 
              key="case"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow grid grid-cols-12 gap-4 items-start"
            >
              {/* Card 1: Active Topic & Status (Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between h-full min-h-[220px]">
                <div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase rounded tracking-wider font-mono">Tema Activo</span>
                  <h2 className="text-xl font-bold mt-2.5 text-slate-800 italic leading-snug font-display">
                    {selectedTheme.number}. {selectedTheme.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    {selectedTheme.description}
                  </p>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Progreso del Caso</span>
                    <span className="font-bold text-emerald-600 font-mono">Fase 1: Análisis</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Card 2: Clinical Case Presentation (Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-6 bg-indigo-600 rounded-full"></div>
                      <h3 className="font-bold text-base text-slate-800 font-display">{clinicalCase.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      ID: BIO-{selectedTheme.id.substring(0,3).toUpperCase()}-2026
                    </span>
                  </div>

                  {/* Patient Information Grid */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-3 gap-3 mb-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Paciente</span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {clinicalCase.patient.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Edad / Periodo</span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {clinicalCase.patient.age}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Género</span>
                      <span className="text-xs font-semibold text-slate-800 uppercase font-mono">
                        {clinicalCase.patient.gender}
                      </span>
                    </div>
                  </div>

                  {/* Disease Definition Section */}
                  {clinicalCase.diseaseDefinition && (
                    <div className="mb-4 bg-blue-50/45 p-3.5 rounded-xl border border-blue-100 flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider font-mono">Definición de la Enfermedad</span>
                      <p className="text-xs text-blue-900 leading-relaxed font-medium">
                        {clinicalCase.diseaseDefinition}
                      </p>
                    </div>
                  )}

                  {/* Narrative paragraph */}
                  <div className="text-xs text-slate-600 leading-relaxed space-y-2 bg-amber-50/10 p-4 rounded-xl border border-amber-200/20 italic">
                    <p>"{clinicalCase.narrative}"</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 font-mono">Patología Asociada</p>
                    <p className="text-xs text-slate-700 font-semibold">{selectedTheme.suggestedPathology}</p>
                  </div>
                  <div className="flex-1 min-w-[200px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 font-mono">Enfoque Semestral</p>
                    <p className="text-xs text-slate-700 font-semibold">Integración de rutas moleculares y biomarcadores.</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Laboratory Results Panel (Sleek Dark Bento - Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest font-mono">Resultados de Laboratorio</h3>
                  
                  <div className="space-y-3.5">
                    {clinicalCase.laboratory.map((lab, i) => {
                      const isAbnormal = lab.interpretation.toLowerCase().includes("alto") || 
                                         lab.interpretation.toLowerCase().includes("bajo") || 
                                         lab.interpretation.toLowerCase().includes("severa") || 
                                         lab.interpretation.toLowerCase().includes("positivo") ||
                                         lab.interpretation.toLowerCase().includes("concentrada") ||
                                         lab.interpretation.toLowerCase().includes("ácidas") ||
                                         lab.interpretation.toLowerCase().includes("anemia");

                      return (
                        <div key={i} className="flex flex-col border-b border-slate-800 pb-2.5 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-slate-400 font-medium">{lab.parameter}</span>
                            <span className="text-[9px] font-mono text-slate-500 italic">{lab.reference}</span>
                          </div>
                          <div className="flex justify-between items-baseline mt-1">
                            <span className={`text-sm font-mono font-bold ${isAbnormal ? "text-red-400" : "text-emerald-400"}`}>
                              {lab.value}
                            </span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isAbnormal ? "bg-red-950/50 text-red-300 border border-red-900/40" : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/30"}`}>
                              {lab.interpretation}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 text-[9px] text-slate-500 font-medium flex items-center justify-between font-mono">
                  <span>DISPOSITIVO: ANALIZADOR CLÍNICO v4</span>
                  <span>PREVIO REGISTRO</span>
                </div>
              </div>

              {/* Card 4: Glossary / Expert Support (Emerald Bento - Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                      <BookOpen className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <h3 className="font-bold text-emerald-800 text-xs uppercase tracking-wider font-mono">Glosario de Apoyo</h3>
                  </div>
                  
                  <p className="text-[11px] text-emerald-950/80 leading-relaxed mb-4">
                    Conceptos clínicos fundamentales explicados para primer semestre de medicina:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[160px] overflow-y-auto pr-2">
                    {clinicalCase.glossary && clinicalCase.glossary.map((g, i) => (
                      <div key={i} className="bg-white/80 p-3 rounded-xl border border-emerald-100/50 flex flex-col gap-1 text-xs">
                        <span className="font-bold text-emerald-900 font-display flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {g.term}
                        </span>
                        <span className="text-emerald-800/85 text-[11px] leading-relaxed pl-3 font-medium">
                          {g.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-between text-[10px] text-emerald-700 font-mono font-bold">
                  <span>RECURSOS: HARPER & LEHNINGER BIOQUÍMICA</span>
                  <span className="underline cursor-pointer">Ver fuentes online</span>
                </div>
              </div>

              {/* Card 5: Tutor Speach Bubble / Interactive CTA (Span 12) */}
              <div className="col-span-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-5 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                    <MessageSquareQuote className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-slate-900 text-sm">Instrucciones del Tutor Académico</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                      "Excelente lectura. Como estudiante de medicina, concéntrate en la lógica molecular de estos síntomas y biomarcadores. ¿Listo para responder las 5 preguntas del caso?"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                  <button
                    onClick={handleRestart}
                    className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-50 text-slate-600 bg-white font-medium py-3 px-5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                  </button>
                  <button
                    onClick={handleStartQuestions}
                    className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group text-xs cursor-pointer"
                  >
                    Comenzar Evaluación
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* PHASE 3: Round of Questions */}
          {!loading && !apiKeyMissingError && phase === "questions" && clinicalCase && selectedTheme && (
            <motion.div 
              key="questions-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow grid grid-cols-12 gap-4 items-start"
            >
              
              {/* Card 1: Evaluation Status & Topic Info (Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between min-h-[220px] h-full">
                <div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[9px] font-bold uppercase rounded tracking-wider font-mono">Fase de Evaluación</span>
                  <h2 className="text-lg font-bold mt-2 text-slate-800 font-display">
                    Módulo: {selectedTheme.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Responde críticamente las preguntas diseñadas para vincular teoría macromolecular con la clínica.
                  </p>
                </div>

                <div className="space-y-3 mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Progreso del Bloque</span>
                    <span className="font-bold text-indigo-600 font-mono">Pregunta {currentQuestionIdx + 1} de {clinicalCase.questions.length}</span>
                  </div>
                  
                  {/* Progress Indicators dots array */}
                  <div className="flex items-center justify-between gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {clinicalCase.questions.map((_, idx) => {
                      let bgClass = "bg-slate-200 border-slate-300";
                      let textClass = "text-slate-500";
                      
                      if (idx === currentQuestionIdx) {
                        bgClass = "bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-100";
                        textClass = "text-white";
                      } else if (idx < currentQuestionIdx) {
                        const chosenOpt = userAnswers[idx];
                        const q = clinicalCase.questions[idx];
                        if (chosenOpt === q.correctIndex) {
                          bgClass = "bg-emerald-500 text-white border-emerald-600";
                          textClass = "text-white";
                        } else {
                          bgClass = "bg-rose-500 text-white border-rose-600";
                          textClass = "text-white";
                        }
                      }
                      
                      return (
                        <div 
                          key={idx}
                          className={`w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center ${bgClass} transition-all`}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Question Area (Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase rounded font-mono">Pregunta {currentQuestionIdx + 1}</span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      Aciertos: <span className="text-emerald-600">{score}</span> / {currentQuestionIdx + (isQuestionAnswered ? 1 : 0)}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-base leading-relaxed mb-6">
                    {clinicalCase.questions[currentQuestionIdx].questionText}
                  </h3>

                  {/* Interactive Options grid (Bento Grid matching aesthetic) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {clinicalCase.questions[currentQuestionIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswerIdx === idx;
                      const isCorrectAnswer = idx === clinicalCase.questions[currentQuestionIdx].correctIndex;
                      
                      let cardStyle = "border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-200 cursor-pointer text-slate-700";
                      let indicatorStyle = "border-slate-300 bg-white text-slate-500";
                      
                      if (isQuestionAnswered) {
                        const userChosen = userAnswers[currentQuestionIdx];
                        if (idx === userChosen) {
                          if (isCorrectAnswer) {
                            cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                            indicatorStyle = "border-emerald-600 bg-emerald-500 text-white";
                          } else {
                            cardStyle = "border-rose-400 bg-rose-50 text-rose-950 font-bold";
                            indicatorStyle = "border-rose-600 bg-rose-500 text-white";
                          }
                        } else if (isCorrectAnswer) {
                          cardStyle = "border-emerald-300 bg-emerald-50/50 text-emerald-900 font-bold";
                          indicatorStyle = "border-emerald-500 bg-emerald-500 text-white";
                        } else {
                          cardStyle = "border-slate-100 bg-slate-50/20 text-slate-400 opacity-55";
                          indicatorStyle = "border-slate-200 bg-slate-100 text-slate-300";
                        }
                      } else {
                        if (isSelected) {
                          cardStyle = "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-xs ring-2 ring-indigo-50 font-semibold";
                          indicatorStyle = "border-indigo-700 bg-indigo-600 text-white shadow-inner";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isQuestionAnswered}
                          className={`p-4 text-left border-2 rounded-xl transition-all flex items-start gap-3 text-xs leading-relaxed ${cardStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${indicatorStyle}`}>
                            {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submitting Actions */}
                <div className="flex items-center justify-end border-t border-slate-100 pt-5 mt-6">
                  {!isQuestionAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswerIdx === null}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                        selectedAnswerIdx !== null 
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      Confirmar Selección
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-sm transition-all flex items-center gap-1.5 group cursor-pointer"
                    >
                      {currentQuestionIdx < clinicalCase.questions.length - 1 ? (
                        <>
                          Siguiente Pregunta
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        "Ver Diagnóstico Final 🏁"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Card 3: Expediente de Consulta Rápida (Emerald Bento style Sidebar - Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-emerald-50 rounded-2xl border border-emerald-100 p-5 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-emerald-800 text-xs uppercase tracking-wider font-mono">Consulta Rápida</h3>
                  </div>

                  <div className="space-y-3.5 text-xs text-emerald-950 font-medium">
                    <div>
                      <span className="text-[10px] text-emerald-700/80 font-bold uppercase block font-mono">Paciente</span>
                      <p className="text-emerald-900 font-semibold">{clinicalCase.patient.name} ({clinicalCase.patient.age})</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-700/80 font-bold uppercase block font-mono">Anamnesis Clave</span>
                      <p className="text-[11px] text-emerald-800/90 leading-relaxed italic line-clamp-3 mt-0.5">
                        "{clinicalCase.narrative}"
                      </p>
                    </div>

                    {clinicalCase.diseaseDefinition && (
                      <div>
                        <span className="text-[10px] text-emerald-700/80 font-bold uppercase block font-mono">Definición de la Condición</span>
                        <p className="text-[11px] text-emerald-900 leading-relaxed mt-0.5 font-semibold bg-white/40 p-2 rounded border border-emerald-100/60">
                          {clinicalCase.diseaseDefinition}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-emerald-200/50 space-y-1.5">
                      <span className="text-[10px] text-emerald-700/80 font-bold uppercase block font-mono">Indicadores Críticos</span>
                      {clinicalCase.laboratory.slice(0,3).map((lab, i) => (
                        <div key={i} className="flex justify-between text-[11px] font-mono py-0.5 bg-white/50 px-2 rounded">
                          <span className="text-emerald-800 font-medium">{lab.parameter}:</span>
                          <span className="font-bold text-rose-700">{lab.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/50 flex flex-col gap-2">
                  <button
                    onClick={handleRestart}
                    className="w-full bg-white hover:bg-emerald-100/50 text-emerald-800 border border-emerald-200 font-semibold py-2.5 px-4 rounded-xl transition-colors text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reiniciar Simulación
                  </button>
                </div>
              </div>

              {/* Card 4: Animated Tutor Feedback Speech Bubble (Span 8) */}
              <div className="col-span-12 lg:col-span-8">
                <AnimatePresence>
                  {isQuestionAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col gap-4 mt-2"
                    >
                      {userAnswers[currentQuestionIdx] === clinicalCase.questions[currentQuestionIdx].correctIndex ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider">¡Excelente deducción molecular, colega!</h4>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-500">
                          <XCircle className="w-5 h-5 shrink-0" />
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider">Análisis y Fisiopatología del Error</h4>
                        </div>
                      )}

                      <div className="text-xs text-slate-600 leading-relaxed font-medium">
                        {userAnswers[currentQuestionIdx] === clinicalCase.questions[currentQuestionIdx].correctIndex ? (
                          clinicalCase.questions[currentQuestionIdx].correctExplanation
                        ) : (
                          <>
                            {clinicalCase.questions[currentQuestionIdx].incorrectExplanation}
                            
                            <div className="mt-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950">
                              <div>
                                <span className="font-bold text-[11px] block font-mono uppercase tracking-wider text-rose-800">Material de Apoyo Académico:</span>
                                <span className="text-[11px] text-rose-700 font-medium">Revisa esta fuente internacional para consolidar el fundamento:</span>
                              </div>
                              <a
                                href={clinicalCase.questions[currentQuestionIdx].repassLinkUrl}
                                target="_blank"
                                  rel="noopener noreferrer"
                                className="shrink-0 bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase tracking-wider py-2 px-3.5 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1"
                              >
                                {clinicalCase.questions[currentQuestionIdx].repassLinkLabel}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {/* PHASE 4: Summary, Score & Dato Curioso */}
          {!loading && !apiKeyMissingError && phase === "summary" && clinicalCase && selectedTheme && (
            <motion.div 
              key="summary-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow grid grid-cols-12 gap-5 items-start"
            >
              
              {/* Card 1: Score & Personalized Evaluation Message (Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                
                {/* Colored gradient banner */}
                <div className={`w-full py-8 px-6 bg-gradient-to-br ${selectedTheme.gradient} text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                      <Award className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg sm:text-xl leading-none">Simulación Completada</h2>
                      <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold mt-1 font-mono">
                        Módulo: {selectedTheme.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-white/10 text-white shadow-xs">
                    Evaluación Final
                  </div>
                </div>

                {/* Score and assessment narrative */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 w-full bg-white">
                  <div className="flex-none bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center w-28 shadow-inner flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono tracking-wider">Aciertos</span>
                    <span className="text-4xl font-black text-indigo-700 font-display mt-1">{score}</span>
                    <span className="text-xs font-bold text-indigo-400 border-t border-indigo-200/40 w-full mt-1.5 pt-1 font-mono">DE 5</span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      {score === 5 && "¡Excelente, diagnóstico impecable! 🌟"}
                      {score === 4 && "¡Muy bien! Tienes bases bioquímicas sólidas. 🩺"}
                      {(score === 3 || score === 2) && "¡Buen esfuerzo! Continúa repasando. 📚"}
                      {score < 2 && "Sigue estudiando. La bioquímica es exigente pero fascinante. 🧪"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                      {score === 5 && "Has integrado perfectamente la teoría macromolecular con la fisiopatología humana clínica. ¡Sigue así, futuro médico!"}
                      {score === 4 && "Dominas la estructura molecular, digestión e interpretación. Revisa las explicaciones para alcanzar el 100%."}
                      {score <= 3 && "Identificaste las bases biológicas esenciales. Haz clic en las lecturas que guardamos para tu autoestudio."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Dato Curioso / Scientific Trivia (Emerald Bento style - Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col justify-between h-full min-h-[220px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                      <Lightbulb className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h3 className="font-bold text-emerald-800 text-xs uppercase tracking-wider font-mono">Dato Curioso Científico</h3>
                  </div>

                  <p className="text-xs text-emerald-950 font-medium italic leading-relaxed">
                    "{clinicalCase.datoCurioso.trivia}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-emerald-700 font-mono">
                  <span className="font-bold">Fuente: {clinicalCase.datoCurioso.reference}</span>
                  <a
                    href={clinicalCase.datoCurioso.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-emerald-900 inline-flex items-center gap-0.5"
                  >
                    {clinicalCase.datoCurioso.linkLabel}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 3: Detailed Questions Checklist (Span 8) */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Desglose de Respuestas</h4>
                
                <div className="space-y-3">
                  {clinicalCase.questions.map((q, idx) => {
                    const userAnsIdx = userAnswers[idx];
                    const isCorrect = userAnsIdx === q.correctIndex;
                    
                    return (
                      <div key={idx} className="flex items-start gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100 font-medium">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-slate-800 font-semibold">{idx + 1}. {q.questionText}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Tu respuesta: <span className={isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                              {q.options[userAnsIdx]?.substring(0, 60)}...
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Action Block (Span 4) */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-center items-stretch gap-4 min-h-[220px]">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-2">
                    <FlaskConical className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">¿Qué deseas estudiar ahora?</h4>
                  <p className="text-xs text-slate-400 mt-1">Elige otro bloque del plan de estudios.</p>
                </div>

                <button
                  onClick={handleRestart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Elegir Otro Tema
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer matching standard aesthetic */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-4 shrink-0 font-medium">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-[10px] sm:text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="font-mono tracking-wider">SIMULACIÓN MÉDICA ACTIVA — BIOQUÍMICA MÉDICA I</span>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-slate-500 font-mono">
            <span>© 2026 BioquímicaMed</span>
            <span className="hidden sm:inline">•</span>
            <span>Basado en Harper, Lehninger y Devlin</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
