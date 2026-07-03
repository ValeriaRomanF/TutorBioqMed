import { ThemeInfo, ClinicalCase } from "./types";

export const THEMES: ThemeInfo[] = [
  {
    id: "Agua",
    number: 1,
    name: "Agua y Osmolaridad",
    icon: "Droplet",
    description: "Estudia la distribución del agua corporal, presiones osmóticas, acuaporinas y el equilibrio hídrico celular en estados de salud y enfermedad.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    suggestedPathology: "Deshidratación e Hiponatremia"
  },
  {
    id: "pH",
    number: 2,
    name: "pH y Equilibrio Ácido-Base",
    icon: "Activity",
    description: "Aprende cómo los sistemas tampón (bicarbonato, proteínas) y la compensación pulmonar/renal mantienen el pH fisiológico dentro de rangos estrictos.",
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    suggestedPathology: "Cetoacidosis Diabética"
  },
  {
    id: "Carbohidratos",
    number: 3,
    name: "Carbohidratos y Metabolismo",
    icon: "Flame",
    description: "Analiza la estructura, digestión y absorción de azúcares, glucólisis, glucógenogénesis y patologías de almacenamiento o intolerancia digestiva.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    suggestedPathology: "Intolerancia a la Lactosa / Glucogenosis"
  },
  {
    id: "Proteínas",
    number: 4,
    name: "Proteínas y Estructura",
    icon: "ShieldAlert",
    description: "Explora los niveles de organización proteica, enlaces peptídicos, plegamiento, enzimas y cómo mutaciones de un solo aminoácido causan enfermedades graves.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    suggestedPathology: "Anemia Falciforme"
  },
  {
    id: "Lípidos",
    number: 5,
    name: "Lípidos y Transporte",
    icon: "Sparkles",
    description: "Comprende la estructura de ácidos grasos, almacenamiento en triglicéridos, función de lipoproteínas (LDL, HDL) y depósito arterial de colesterol.",
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    suggestedPathology: "Hipercolesterolemia Familiar"
  },
  {
    id: "Ácidos Nucleicos",
    number: 6,
    name: "Ácidos Nucleicos y Purinas",
    icon: "Dna",
    description: "Estudia la síntesis y degradación de nucleótidos (ADN/ARN), formación de ácido úrico, reparación del ADN y desórdenes metabólicos derivados.",
    color: "violet",
    gradient: "from-violet-500 to-fuchsia-500",
    suggestedPathology: "Gota (Artritis Urática)"
  }
];

export const FALLBACK_CASES: Record<string, ClinicalCase> = {
  Agua: {
    title: "Caso Clínico: Deshidratación Isotónica por Gastroenteritis Aguda",
    patient: {
      name: "Mateo",
      age: "8 meses",
      gender: "Masculino"
    },
    narrative: "Llega a urgencias un lactante con cuadro de 3 días de diarrea líquida abundante y vómitos. La madre refiere que ha dejado de orinar en las últimas 8 horas y se nota sumamente decaído. Al examen físico se observa letargo (estado de somnolencia profunda), mucosas secas, ausencia de lágrimas al llorar y el signo del pliegue positivo (la piel tarda en volver a su posición normal al pellizcarla), reflejo de una pérdida grave de volumen extracelular. Se sospecha una deshidratación isotónica, donde se pierde agua y sodio en proporciones equivalentes, comprometiendo la presión osmótica e hídrica de los tejidos.",
    diseaseDefinition: "La deshidratación isotónica es una pérdida equitativa de agua y electrolitos corporales del espacio extracelular, común en gastroenteritis agudas, que mantiene la osmolaridad sérica normal pero compromete la volemia y la perfusión adecuada de los tejidos.",
    laboratory: [
      { parameter: "Sodio Sérico (Na+)", value: "139 mEq/L", reference: "135 - 145 mEq/L", interpretation: "Normonatremia (Sodio normal)" },
      { parameter: "Osmolaridad Plasmática", value: "292 mOsm/kg", reference: "280 - 295 mOsm/kg", interpretation: "Normal (Garantiza isotonicidad)" },
      { parameter: "Densidad Urinaria", value: "1.032 g/mL", reference: "1.002 - 1.030 g/mL", interpretation: "Orina muy concentrada por acción de ADH" },
      { parameter: "Presión Arterial", value: "70/45 mmHg", reference: "85/50 mmHg para la edad", interpretation: "Hipotensión arterial (Compromiso hemodinámico)" }
    ],
    questions: [
      {
        questionText: "¿Por qué se mantiene el sodio sérico y la osmolaridad plasmática en rango normal a pesar de la deshidratación severa en Mateo?",
        options: [
          "A) Porque se ha perdido exclusivamente agua pura a través de la sudoración excesiva.",
          "B) Porque las pérdidas de agua y electrolitos (como el sodio) han ocurrido en proporciones equivalentes (pérdida isotónica).",
          "C) Porque los riñones han aumentado la excreción de sodio para compensar la falta de agua en el cuerpo.",
          "D) Porque las acuaporinas celulares se han cerrado bloqueando toda salida de iones del compartimento celular."
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! En la deshidratación isotónica, la pérdida de agua y solutos (principalmente sodio) es proporcional, por lo que la concentración extracelular de sodio y la osmolaridad permanecen dentro de rangos normales, aunque el volumen del espacio extracelular disminuye drásticamente.",
        incorrectExplanation: "Incorrecto. Si Mateo perdiera agua pura de forma exclusiva, estaríamos ante una deshidratación hipertónica con sodio sérico elevado (hipernatremia). Revisa la dinámica de los compartimentos corporales de agua.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000982.htm",
        repassLinkLabel: "MedlinePlus - Deshidratación"
      },
      {
        questionText: "Si la osmolaridad extracelular se mantiene constante, ¿cómo se afecta el volumen de agua dentro de las células de Mateo (compartimento intracelular)?",
        options: [
          "A) El agua intracelular sale masivamente al espacio extracelular por ósmosis, deshidratando las células.",
          "B) El agua extracelular ingresa a las células causando hinchazón celular (edema celular).",
          "C) No ocurre movimiento neto de agua entre los compartimentos, las células conservan su volumen original pero el espacio extracelular está vacío.",
          "D) Las células se rompen debido a la presión hidrostática acumulada en el intersticio tisular."
        ],
        correctIndex: 2,
        correctExplanation: "¡Excelente deducción bioquímica! Al ser una deshidratación isotónica, no existe un gradiente de concentración (diferencia de osmolaridad) entre el interior y el exterior celular. Por ende, no hay flujo neto de agua por ósmosis, y las células preservan su volumen, recayendo todo el déficit hídrico en el espacio extracelular (plasma e intersticio).",
        incorrectExplanation: "Incorrecto. Para que ocurra un movimiento neto de agua hacia adentro o hacia afuera de las células se requiere un gradiente osmótico. Al ser isotónica la pérdida, las osmolaridades de ambos compartimentos siguen iguales.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/membranes-and-transport/diffusion-and-osmosis/a/osmosis",
        repassLinkLabel: "Khan Academy - Difusión y Ósmosis"
      },
      {
        questionText: "¿Cuál es la hormona liberada por la neurohipófisis en respuesta a la disminución de volumen que estimula la reabsorción selectiva de agua en los túbulos colectores renales?",
        options: [
          "A) Aldosterona",
          "B) Hormona Antidiurética (ADH / Vasopresina)",
          "C) Péptido Natriurético Auricular (ANP)",
          "D) Angiotensina II"
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! La ADH o Vasopresina se secreta ante estímulos barorreceptores (baja presión/volumen) u osmorreceptores (alta osmolaridad). Esta hormona induce la translocación de acuaporinas-2 en los túbulos renales para absorber agua libre y concentrar la orina.",
        incorrectExplanation: "Incorrecto. La aldosterona estimula la reabsorción de sodio y secreción de potasio/hidrógeno, pero no reabsorbe directamente agua libre de forma aislada. La hormona principal para absorber agua pura es la ADH.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=vasopresina+antidiuretica&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Hormona Antidiurética"
      },
      {
        questionText: "¿A través de qué proteínas de membrana específicas fluye el agua a través de las células renales para concentrar la orina?",
        options: [
          "A) Bombas de sodio y potasio (Na+/K+ ATPasa)",
          "B) Canales SGLT de transporte de glucosa",
          "C) Acuaporinas (principalmente AQP2 en túbulo colector)",
          "D) Canales de escape de potasio dependientes de voltaje"
        ],
        correctIndex: 2,
        correctExplanation: "¡Así es! Las acuaporinas son canales proteicos transmembrana altamente selectivos para las moléculas de agua, permitiendo su paso rápido a favor de un gradiente osmótico sin consumir energía directa.",
        incorrectExplanation: "Incorrecto. Los transportadores SGLT transportan glucosa acoplada a sodio, y la Na+/K+ ATPasa es una bomba de iones. Las proteínas dedicadas específicamente al flujo selectivo de agua son las acuaporinas.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=acuaporinas&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Acuaporinas"
      },
      {
        questionText: "¿Qué tipo de solución intravenosa es la más indicada bioquímicamente para expandir el volumen extracelular de Mateo sin alterar el volumen celular?",
        options: [
          "A) Solución Salina Isotónica al 0.9% (Fisiológica)",
          "B) Agua destilada pura sin electrolitos",
          "C) Solución Salina Hipertónica al 3.0%",
          "D) Solución de Glucosa al 10% sin sodio"
        ],
        correctIndex: 0,
        correctExplanation: "¡Brillante! La Solución Salina al 0.9% tiene una osmolaridad de ~308 mOsm/L, muy cercana a la del plasma. Permite reponer agua y sodio en el espacio extracelular sin inducir gradientes osmóticos que deshidraten o hinchen las células cerebrales.",
        incorrectExplanation: "Incorrecto. El agua destilada pura por vía intravenosa causaría una hemólisis (ruptura de glóbulos rojos) masiva debido a que es una solución hipotónica extrema que hincharía las células sanguíneas hasta reventarlas.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=fluidoterapia+suero+fisiologico&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Suero Fisiológico e Hidratación"
      }
    ],
    datoCurioso: {
      trivia: "El cuerpo humano de un recién nacido es aproximadamente 75% agua, mientras que en un adulto representa un 60%. Debido a esta alta proporción de agua extracelular y a su inmadurez renal, los lactantes pierden agua con mayor velocidad y sufren deshidrataciones clínicas graves mucho antes que los adultos.",
      reference: "Organización Mundial de la Salud (OMS), 2023",
      linkUrl: "https://www.who.int/es/news-room/fact-sheets/detail/diarrhoeal-disease",
      linkLabel: "OMS - Enfermedades Diarreicas e Hidratación"
    },
    glossary: [
      { term: "Signo del pliegue", definition: "Prueba clínica para valorar la deshidratación, donde la piel tarda en recuperar su forma lisa tras ser pellizcada delicadamente." },
      { term: "Isotónica", definition: "Solución que posee la misma presión osmótica o concentración de solutos que el interior celular." },
      { term: "Letargo", definition: "Estado de adormecimiento, inactividad y disminución de la respuesta ante estímulos externos." }
    ]
  },
  pH: {
    title: "Caso Clínico: Cetoacidosis Diabética e Hiperventilación Compensatoria",
    patient: {
      name: "Valeria",
      age: "19 años",
      gender: "Femenino"
    },
    narrative: "Valeria, diagnosticada recientemente con Diabetes Mellitus Tipo 1, es llevada a la sala de emergencias con respiración de Kussmaul (respiraciones muy profundas y rápidas), aliento con olor frutal (olor a manzana/acetona), náuseas intensas y letargo. Refiere haber olvidado aplicarse su dosis de insulina en las últimas 36 horas. Al no haber insulina, sus tejidos periféricos no pueden absorber la glucosa sérica, por lo que su hígado interpreta que está en ayuno y activa la beta-oxidación de grasas a nivel mitocondrial de manera masiva, produciendo cuerpos cetónicos (ácido acetoacético y ácido beta-hidroxibutírico), los cuales liberan una gran cantidad de protones (H+), saturando los amortiguadores plasmáticos y desplomando el pH arterial.",
    diseaseDefinition: "La cetoacidosis diabética es una complicación metabólica aguda caracterizada por hiperglucemia severa, acidosis metabólica de brecha aniónica elevada y cetonuria, secundaria a una deficiencia absoluta o relativa de insulina que activa una producción descontrolada de cuerpos cetónicos ácidos.",
    laboratory: [
      { parameter: "pH Arterial", value: "7.12", reference: "7.35 - 7.45", interpretation: "Acidemia severa" },
      { parameter: "Bicarbonato (HCO3-)", value: "9 mEq/L", reference: "22 - 26 mEq/L", interpretation: "Consumido totalmente amortiguando H+" },
      { parameter: "Glucemia", value: "380 mg/dL", reference: "70 - 100 mg/dL", interpretation: "Hiperglucemia severa" },
      { parameter: "Presión parcial de CO2 (pCO2)", value: "24 mmHg", reference: "35 - 45 mmHg", interpretation: "Disminuida por hiperventilación compensatoria" }
    ],
    questions: [
      {
        questionText: "¿Cuál es el principal sistema amortiguador extracelular encargado de unirse a los protones libres generados por los cuerpos cetónicos para intentar frenar la caída del pH en Valeria?",
        options: [
          "A) Sistema Amortiguador de Fosfato",
          "B) Amortiguador de Hemoglobina en el eritrocito",
          "C) Sistema de Amortiguación del Bicarbonato (HCO3- / H2CO3)",
          "D) Proteínas plasmáticas como la albúmina"
        ],
        correctIndex: 2,
        correctExplanation: "¡Correcto! El sistema bicarbonato/ácido carbónico es el principal amortiguador del líquido extracelular. El bicarbonato (HCO3-) reacciona con los protones (H+) excedentes para formar ácido carbónico (H2CO3), el cual se disocia en agua y CO2 para ser eliminado por la respiración.",
        incorrectExplanation: "Incorrecto. El amortiguador de fosfato es fundamental en el líquido intracelular y en la orina (túbulo renal), pero en el plasma sanguíneo, el bicarbonato es el amortiguador cuantitativamente más importante y regulable.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/water-acids-and-bases/acids-bases-and-ph/a/acids-bases-ph-and-buffering",
        repassLinkLabel: "Khan Academy - Ácidos, Bases y Buffers"
      },
      {
        questionText: "¿Cómo se explica la respiración de Kussmaul (hiperventilación) de Valeria desde la ecuación de Henderson-Hasselbalch y el equilibrio ácido-base?",
        options: [
          "A) Al espirar más rápido, Valeria retiene más CO2, aumentando los niveles de ácido carbónico.",
          "B) Al hiperventilar, Valeria elimina más CO2 (gas ácido), desplazando el equilibrio químico hacia la izquierda y reduciendo la concentración de protones (H+).",
          "C) La hiperventilación introduce más oxígeno que oxida directamente los cuerpos cetónicos a glucosa.",
          "D) Es un fallo puramente mecánico de los pulmones debido a la fatiga del músculo diafragma."
        ],
        correctIndex: 1,
        correctExplanation: "¡Excelente! Los quimiorreceptores detectan la caída del pH y estimulan el centro respiratorio para hiperventilar. Al 'soplar' o eliminar CO2 gaseoso, la reacción [H+] + [HCO3-] <=> [H2CO3] <=> [H2O] + [CO2] se desplaza hacia la derecha, consumiendo protones y ayudando a elevar el pH de vuelta al rango seguro.",
        incorrectExplanation: "Incorrecto. Retener CO2 (opción A) aumentaría la acidez de la sangre, empeorando el estado de Valeria. Ella está hiperventilando para eliminar CO2 y así disminuir los hidrogeniones libres.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000320.htm",
        repassLinkLabel: "MedlinePlus - Cetoacidosis Diabética"
      },
      {
        questionText: "Químicamente, los cuerpos cetónicos ácido acetoacético y ácido beta-hidroxibutírico son considerados:",
        options: [
          "A) Ácidos fuertes que se disocian al 100% en el agua plasmática.",
          "B) Bases débiles que capturan protones y aumentan el bicarbonato plasmático.",
          "C) Ácidos débiles que se disocian parcialmente liberando protones de su grupo carboxilo (-COOH) a pH fisiológico.",
          "D) Alcoholes neutros incapaces de alterar el pH o la concentración de electrolitos."
        ],
        correctIndex: 2,
        correctExplanation: "¡Correcto! Poseen un grupo funcional carboxilo (-COOH) con un pKa de aproximadamente 3.8 a 4.8. Al estar expuestos al pH plasmático normal de 7.4 (mucho mayor que su pKa), se disocian liberando una avalancha de protones y formando sus bases conjugadas (acetoacetato y beta-hidroxibutirato).",
        incorrectExplanation: "Incorrecto. No son ácidos fuertes como el HCl. Son ácidos orgánicos débiles, pero debido a su masiva producción en ausencia de insulina, liberan suficientes protones para sobrepasar la capacidad tampón del bicarbonato corporal.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=cuerpos+cetonicos&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Cuerpos Cetónicos"
      },
      {
        questionText: "¿Qué enzima mitocondrial hepática, inhibida por altos niveles de insulina, se encuentra sobreactivada en Valeria, acelerando la producción de cuerpos cetónicos?",
        options: [
          "A) Glucógeno Sintasa",
          "B) HMG-CoA Sintasa Mitocondrial",
          "C) Piruvato Deshidrogenasa",
          "D) Acetil-CoA Carboxilasa"
        ],
        correctIndex: 1,
        correctExplanation: "¡Excelente nivel! La HMG-CoA Sintasa mitocondrial es la enzima clave limitante en la cetogénesis. Al no haber insulina, los ácidos grasos libres entran en abundancia a la beta-oxidación, generando un exceso de Acetil-CoA que es condensado por esta enzima para iniciar la síntesis de cuerpos cetónicos.",
        incorrectExplanation: "Incorrecto. La glucógeno sintasa sintetiza glucógeno en el citosol y está inactiva en este estado. La enzima clave de la cetogénesis mitocondrial es la HMG-CoA Sintasa.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/lipids/a/lipids",
        repassLinkLabel: "Khan Academy - Bioquímica de Lípidos y Cetonas"
      },
      {
        questionText: "Si se administra insulina a Valeria para tratar la cetoacidosis, ¿cuál es el efecto metabólico inmediato a nivel de los transportadores celulares de glucosa?",
        options: [
          "A) La insulina bloquea los receptores GLUT1 del cerebro previniendo el coma diabético.",
          "B) La insulina induce la translocación de transportadores GLUT4 a la membrana de células del músculo esquelético y tejido adiposo para captar glucosa.",
          "C) La insulina destruye de manera selectiva los canales de sodio/glucosa SGLT en el intestino delgado.",
          "D) Provoca que los lípidos de membrana de los eritrocitos se vuelvan impermeables a los azúcares."
        ],
        correctIndex: 1,
        correctExplanation: "¡Maravilloso! El músculo esquelético y el tejido adiposo requieren de insulina para mobilizar los transportadores GLUT4 desde las vesículas intracelulares hacia la superficie de la membrana. Una vez en la membrana, estos transportadores facilitan la entrada de glucosa por difusión facilitada, resolviendo la hiperglucemia.",
        incorrectExplanation: "Incorrecto. Los transportadores cerebrales son principalmente GLUT1 y GLUT3, los cuales son independientes de insulina (el cerebro capta glucosa sin necesidad de insulina). El blanco insulinodependiente por excelencia es GLUT4.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=insulina+glucosa&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Acción de la Insulina"
      }
    ],
    datoCurioso: {
      trivia: "El 'olor a frutas' en el aliento de los pacientes con cetoacidosis se debe a la eliminación de acetona por vía pulmonar. La acetona es un compuesto altamente volátil que se produce por la descarboxilación espontánea (no enzimática) del acetoacetato en la sangre.",
      reference: "Asociación Americana de la Diabetes (ADA), 2024",
      linkUrl: "https://www.diabetes.org/espanol",
      linkLabel: "Asociación Americana de la Diabetes"
    },
    glossary: [
      { term: "Respiración de Kussmaul", definition: "Tipo de respiración profunda y rápida que realiza el organismo para deshacerse del CO2 y combatir la acidosis." },
      { term: "Beta-oxidación", definition: "Ruta metabólica celular en la cual los ácidos grasos se oxidan paso a paso en las mitocondrias para producir energía." },
      { term: "Cetogénesis", definition: "Proceso bioquímico hepático por el cual se sintetizan cuerpos cetónicos a partir de Acetil-CoA." }
    ]
  },
  Carbohidratos: {
    title: "Caso Clínico: Intolerancia Primaria a la Lactosa (Déficit de Lactasa)",
    patient: {
      name: "Camila",
      age: "6 años",
      gender: "Femenino"
    },
    narrative: "Camila es llevada a consulta pediátrica por presentar distensión abdominal (inflamación del abdomen), borborigmos (ruidos intestinales aumentados), flatulencias explosivas y diarrea ácida que inician aproximadamente entre 1 y 2 horas después de consumir leche o derivados lácteos. El pediatra sospecha una intolerancia a la lactosa. La lactosa es un disacárido de la leche constituido por glucosa y galactosa unidos por un enlace beta-1,4-glucosídico. En condiciones normales, una enzima del borde en cepillo intestinal hidroliza este enlace, pero su deficiencia provoca que la lactosa llegue intacta al colon, donde bacterias la fermentan generando gases y ácido láctico de alta carga osmótica.",
    diseaseDefinition: "La intolerancia a la lactosa es un trastorno digestivo causado por la deficiencia o nula expresión de la enzima lactasa en el borde en cepillo intestinal, impidiendo la hidrólisis de la lactosa en glucosa y galactosa, lo que genera fermentación bacteriana colónica, flatulencias y diarrea osmótica.",
    laboratory: [
      { parameter: "pH de las Heces", value: "5.2", reference: "6.0 - 7.5", interpretation: "Heces ácidas debido a la fermentación de ácido láctico" },
      { parameter: "Prueba de Hidrógeno en Aliento", value: "35 ppm", reference: "< 20 ppm", interpretation: "Positivo por liberación de gas H2 bacteriano" },
      { parameter: "Prueba de Tolerancia a la Lactosa", value: "Incremento de 8 mg/dL", reference: "Incremento > 20 mg/dL", interpretation: "Mala absorción (No se digiere ni absorbe glucosa plasmática)" }
    ],
    questions: [
      {
        questionText: "¿Qué tipo de enlace químico une a las moléculas de glucosa y galactosa en el disacárido lactosa y cuál es la enzima deficiente en Camila?",
        options: [
          "A) Enlace alfa-1,4-glucosídico; Amilasa pancreática.",
          "B) Enlace beta-1,4-glucosídico; Lactasa (beta-galactosidasa).",
          "C) Enlace alfa-1,6-glucosídico; Isomaltasa.",
          "D) Enlace beta-1,2-glucosídico; Sacarasa."
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! La lactosa posee un enlace glicosídico de tipo beta-1,4, el cual requiere específicamente la enzima lactasa (una beta-galactosidasa) localizada en las microvellosidades del enterocito para romperlo y permitir la absorción de los monosacáridos glucosa y galactosa.",
        incorrectExplanation: "Incorrecto. Los enlaces alfa-1,4 se encuentran en el almidón y son hidrolizados por la amilasa. La lactosa tiene enlace beta-1,4, hidrolizado de forma exclusiva por la lactasa.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/carbohydrates-and-lipids/a/carbohydrates",
        repassLinkLabel: "Khan Academy - Carbohidratos y Enlaces"
      },
      {
        questionText: "¿Por qué se genera diarrea líquida y distensión gaseosa en Camila tras consumir leche?",
        options: [
          "A) Porque la lactosa intacta actúa como un soluto osmóticamente activo que retiene agua en la luz intestinal, y las bacterias colónicas la fermentan produciendo gases (H2, CO2, CH4).",
          "B) Porque la lactosa precipita formando cristales sólidos cortantes que lesionan las paredes celulares del intestino delgado.",
          "C) Porque el sistema inmunitario de Camila produce anticuerpos IgE que destruyen las uniones estrechas del colon.",
          "D) Porque la galactosa no absorbida bloquea directamente los canales de potasio e impide la reabsorción celular de fluidos."
        ],
        correctIndex: 0,
        correctExplanation: "¡Excelente explicación bioquímica! La lactosa que no es digerida no se puede absorber, actuando como soluto osmótico que arrastra agua hacia la luz intestinal (diarrea osmótica). En el colon, las bacterias fermentan la lactosa produciendo ácidos de cadena corta y gases, causando borborigmos, dolor y flatulencias.",
        incorrectExplanation: "Incorrecto. La intolerancia a la lactosa no es una alergia mediada por anticuerpos (eso sería alergia a la proteína de la leche de vaca, PLV). Es un déficit enzimático meramente metabólico y osmótico.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000276.htm",
        repassLinkLabel: "MedlinePlus - Intolerancia a la Lactosa"
      },
      {
        questionText: "Una vez hidrolizada la lactosa, ¿cómo ingresan la glucosa y la galactosa a las células intestinales (enterocitos) desde la luz del intestino?",
        options: [
          "A) Por transporte pasivo simple atravesando directamente la bicapa lipídica.",
          "B) Por transporte activo secundario acoplado a sodio mediante el transportador SGLT1.",
          "C) Por pinocitosis englobando fluidos de la luz intestinal en vesículas de membrana.",
          "D) A través de canales de acuaporinas modificados que reconocen azúcares hexosas."
        ],
        correctIndex: 1,
        correctExplanation: "¡Fantástico! La glucosa y galactosa ingresan por el polo apical del enterocito mediante SGLT-1, un transportador que realiza transporte activo secundario usando el gradiente de sodio generado por la bomba Na+/K+ ATPasa.",
        incorrectExplanation: "Incorrecto. Las hexosas son moléculas polares grandes que no pueden cruzar la bicapa por difusión simple, ni usan acuaporinas. SGLT1 es el transportador acoplado a sodio responsable de este paso.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=fisiologia+enterocito+absorpcion&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Absorción Intestinal de Azúcares"
      },
      {
        questionText: "¿Cómo se transporta la galactosa liberada al hígado para su conversión en metabolitos de la glucólisis, y qué transportador de difusión facilitada la introduce a las células hepáticas?",
        options: [
          "A) GLUT4 estimulado de forma directa por la adrenalina.",
          "B) GLUT2, un transportador bidireccional de alta capacidad e independiente de insulina.",
          "C) SGLT2 localizado en las paredes de las arteriolas hepáticas.",
          "D) Mediante quilomicrones por la vía linfática esplénica."
        ],
        correctIndex: 1,
        correctExplanation: "¡Excepcional! Los monosacáridos salen del enterocito hacia la circulación portal por el transportador GLUT2. Luego, en el hígado, los hepatocitos captan la galactosa y la glucosa a través de GLUT2, facilitando su metabolismo de almacenamiento o degradación.",
        incorrectExplanation: "Incorrecto. Los hepatocitos no expresan GLUT4 (que es dependiente de insulina y exclusivo de músculo y grasa), sino GLUT2, un transportador de alta capacidad que permite flujos masivos bidireccionales de azúcares.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=galactosa+gluts&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Catabolismo de Galactosa"
      },
      {
        questionText: "¿Cuál es la enzima del hígado responsable de la fosforilación inicial de la galactosa (vía de Leloir) para que no pueda escapar de la célula hepática?",
        options: [
          "A) Hexocinasa IV (Glucocinasa)",
          "B) Galactocinasa (GALK)",
          "C) Fosfofructocinasa-1 (PFK-1)",
          "D) Lactato Deshidrogenasa"
        ],
        correctIndex: 1,
        correctExplanation: "¡Perfecto! La galactocinasa fosforila la galactosa consumiendo ATP para producir galactosa-1-fosfato. Esto introduce una carga negativa que impide que el azúcar cruce los transportadores de membrana, atrapándola en la célula hepática para su procesamiento metabólico.",
        incorrectExplanation: "Incorrecto. La glucocinasa actúa principalmente sobre la glucosa. El metabolismo hepático de la galactosa requiere de la galactocinasa (GALK) para su atrapamiento inicial.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=galactosemia&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Galactosemia"
      }
    ],
    datoCurioso: {
      trivia: "Aproximadamente el 65% al 70% de la población humana mundial experimenta una pérdida gradual en la capacidad de digerir lactosa después de la infancia (hipolactasia no persistente). Esto se debe a la regulación genética que apaga gradualmente la transcripción del gen LCT (que codifica para la lactasa) después del destete.",
      reference: "Institutos Nacionales de Salud (NIH / NCBI), 2023",
      linkUrl: "https://medlineplus.gov/genetics/condition/lactose-intolerance/",
      linkLabel: "NIH - Genética de la Intolerancia a la Lactosa"
    },
    glossary: [
      { term: "Dismisinución de lactasa", definition: "Pérdida progresiva de la actividad enzimática de la lactasa tras el destete, genéticamente determinada." },
      { term: "Borborigmo", definition: "Sonido de burbujeo o borboteo producido por el movimiento de gases y líquidos a través de los intestinos." },
      { term: "Enterocito", definition: "Célula epitelial altamente especializada encargada de la absorción de nutrientes en el intestino delgado." }
    ]
  },
  Proteínas: {
    title: "Caso Clínico: Anemia Falciforme y Estructura Cuaternaria de la Hemoglobina",
    patient: {
      name: "Abigail",
      age: "4 años",
      gender: "Femenino"
    },
    narrative: "Abigail, de origen afrodescendiente, es traída a urgencias con un cuadro de dolor óseo severo en extremidades y abdomen. La madre menciona que Abigail tuvo un leve resfriado común hace dos días. Al examen físico se observa ictericia (coloración amarillenta de piel y conjuntivas oculares) y palidez. El frotis de sangre periférica revela eritrocitos con forma de media luna o falce. El análisis genético confirma que Abigail padece anemia falciforme, una hemoglobinopatía (enfermedad de la hemoglobina) hereditaria caracterizada por una mutación de un único nucleótido en el gen de la beta-globina que cambia el ácido glutámico por valina en la posición 6 de la cadena proteica.",
    diseaseDefinition: "La anemia falciforme es un trastorno genético hereditario autosómico recesivo causado por una mutación puntual en el gen de la beta-globina (sustitución de ácido glutámico por valina en la posición 6), originando la Hemoglobina S (HbS) que polimeriza en estado desoxigenado y deforma los eritrocitos en forma de media luna, provocando hemólisis y vasooclusión dolorosa.",
    laboratory: [
      { parameter: "Hemoglobina", value: "7.2 g/dL", reference: "11.5 - 13.5 g/dL", interpretation: "Anemia severa" },
      { parameter: "Reticulocitos", value: "11%", reference: "0.5% - 1.5%", interpretation: "Reticulocitosis (Gran regeneración eritroide por destrucción celular)" },
      { parameter: "Bilirrubina Indirecta", value: "3.4 mg/dL", reference: "< 0.8 mg/dL", interpretation: "Elevada por hemólisis (Destrucción de glóbulos rojos)" },
      { parameter: "Electroforesis de Hemoglobina", value: "Hemoglobina S (HbS) detectable", reference: "Hemoglobina A (HbA) normal", interpretation: "Confirma presencia de hemoglobina falciforme" }
    ],
    questions: [
      {
        questionText: "¿Cuál es el cambio de aminoácido específico en la cadena beta de la hemoglobina de Abigail y cómo altera las propiedades químicas de la molécula?",
        options: [
          "A) Un ácido glutámico cargado negativamente (polar) es reemplazado por una valina hidrofóbica (no polar).",
          "B) Una lisina básica se sustituye por un triptófano aromático muy grande.",
          "C) Una glicina flexible es reemplazada por una prolina rígida desnaturalizando la proteína.",
          "D) Un residuo de cisteína que forma puentes disulfuro es sustituido por una alanina inerte."
        ],
        correctIndex: 0,
        correctExplanation: "¡Excelente! Al cambiar un aminoácido hidrófilo y cargado (ácido glutámico) por uno hidrófobo y neutro (valina) en la superficie de la proteína, se genera un 'parche' hidrofóbico que busca unirse a otras áreas hidrofóbicas para ocultarse del agua.",
        incorrectExplanation: "Incorrecto. La mutación exacta en la anemia falciforme (HbS) sustituye el ácido glutámico (Glu) por valina (Val) en el codón 6 de la cadena beta. Esto altera la solubilidad de la hemoglobina desoxigenada.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/proteins-and-amino-acids/a/orders-of-protein-structure",
        repassLinkLabel: "Khan Academy - Estructura de las Proteínas"
      },
      {
        questionText: "¿Bajo qué condición bioquímica la Hemoglobina S (HbS) mutada polimeriza en fibras insolubles que deforman al glóbulo rojo?",
        options: [
          "A) Niveles altos de oxígeno (saturación del 100%) en la sangre arterial.",
          "B) En estado desoxigenado (baja presión de oxígeno, acidosis o deshidratación) que expone el parche de valina mutado.",
          "C) En presencia de monóxido de carbono (carboxihemoglobina estable).",
          "D) Cuando el pH sanguíneo se eleva por encima de 7.55 (alcalosis)."
        ],
        correctIndex: 1,
        correctExplanation: "¡Excelente nivel! Cuando la HbS se desoxigena (libera O2 en los tejidos), su conformación estructural cambia (estado T). En este estado, el parche de valina mutada en la cadena beta se expone y encaja en una cavidad hidrófoba de otra cadena beta vecina, polimerizando en largas fibras rígidas que curvan el eritrocito en forma de falce o media luna.",
        incorrectExplanation: "Incorrecto. En estado oxigenado (estado R), la valina mutada está oculta y la hemoglobina se disuelve bien. La polimerización dañina ocurre exclusivamente ante la desoxigenación (bajos niveles de O2, ejercicio, frío, deshidratación).",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000527.htm",
        repassLinkLabel: "MedlinePlus - Anemia de Células Falciformes"
      },
      {
        questionText: "¿Por qué los eritrocitos falciformes provocan crisis de dolor agudo tan intensas en las extremidades de Abigail?",
        options: [
          "A) Porque estimulan la proliferación acelerada de células nerviosas sensoriales de nocicepción.",
          "B) Porque son rígidos y poco deformables, lo que obstruye la microcirculación tisular (vasooclusión) provocando isquemia (falta de riego sanguíneo e hipoxia).",
          "C) Porque consumen todo el calcio extracelular de los huesos debilitándolos mecánicamente.",
          "D) Porque liberan grandes volúmenes de histamina que inducen quemaduras químicas en los capilares."
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! Los eritrocitos rígidos en forma de media luna pierden su capacidad de deformarse para pasar por los pequeños capilares sanguíneos, provocando eventos de vasooclusión (isquemia) y la consecuente hipoxia (falta de oxígeno) en los tejidos afectados, lo que genera crisis dolorosas y daños a los órganos.",
        incorrectExplanation: "Incorrecto. No hay un daño de quemadura química o sobrecrecimiento nervioso. Las crisis de dolor se deben puramente a la oclusión mecánica de microvasos (isquemia tisular) por los eritrocitos rígidos.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000527.htm",
        repassLinkLabel: "MedlinePlus - Crisis Drepanocítica"
      },
      {
        questionText: "¿Cuál es el nivel de estructura proteica alterado de forma directa por esta sustitución del sexto aminoácido de la beta-globina, y cuál se ve comprometido de forma secundaria al formar las fibras de HbS?",
        options: [
          "A) Estructura primaria (secuencia); Estructura cuaternaria (asociación de subunidades e interacción intermolecular).",
          "B) Estructura secundaria (alfa hélice); Estructura terciaria (plegamiento de dominios).",
          "C) Estructura terciaria (puentes de hidrógeno); Estructura secundaria (láminas beta).",
          "D) Estructura cuaternaria; Sin efectos en otros niveles proteicos."
        ],
        correctIndex: 0,
        correctExplanation: "¡Impresionante! El cambio de un solo aminoácido altera por definición la secuencia lineal de aminoácidos, es decir, la estructura primaria. De manera secundaria, al unirse las subunidades e interaccionar de forma anómala con otras moléculas de HbS para polimerizar, se compromete la interacción cuaternaria y supramolecular de la proteína.",
        incorrectExplanation: "Incorrecto. Un cambio en la secuencia es siempre una alteración de la estructura primaria. Las interacciones entre subunidades independientes de hemoglobina corresponden al nivel de organización cuaternaria.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/proteins-and-amino-acids/v/four-levels-of-protein-structure",
        repassLinkLabel: "Khan Academy - Niveles Proteicos"
      },
      {
        questionText: "¿Qué tipo de enlace químico fuerte une covalentemente a los aminoácidos individuales en la estructura primaria de la cadena de beta-globina?",
        options: [
          "A) Enlace Glicosídico",
          "B) Puentes de Hidrógeno",
          "C) Enlace Peptídico (tipo amida)",
          "D) Puentes Disulfuro"
        ],
        correctIndex: 2,
        correctExplanation: "¡Excelente! El enlace peptídico es un enlace covalente fuerte de tipo amida que se forma mediante condensación del grupo carboxilo de un aminoácido y el grupo amino del siguiente, liberando una molécula de agua y dando estabilidad a la cadena polipeptídica.",
        incorrectExplanation: "Incorrecto. Los puentes de hidrógeno estabilizan estructuras secundarias (alfa hélice/lámina beta), pero no unen los aminoácidos covalentemente en la secuencia principal. Ese es el enlace peptídico.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=enlaces+peptidicos+proteinas&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Enlaces Peptídicos y Proteínas"
      }
    ],
    datoCurioso: {
      trivia: "La mutación de la anemia falciforme proporciona una ventaja adaptativa: ofrece resistencia a la malaria (causada por el parásito Plasmodium falciparum). Los eritrocitos portadores de HbS se destruyen más rápido al ser infectados, impidiendo que el parásito complete su ciclo biológico. Esto explica por qué el gen persiste con alta frecuencia en regiones endémicas de malaria.",
      reference: "Organización Mundial de la Salud / CDC, 2022",
      linkUrl: "https://www.who.int/es/news-room/fact-sheets/detail/malaria",
      linkLabel: "OMS - Malaria y Genética"
    },
    glossary: [
      { term: "Ictericia", definition: "Coloración amarillenta de la piel, membranas mucosas y ojos debido a una acumulación de bilirrubina plasmática." },
      { term: "Hemólisis", definition: "Destrucción prematura de los glóbulos rojos o eritrocitos con la consecuente liberación de hemoglobina al torrente sanguíneo." },
      { term: "Isquemia", definition: "Disminución o detención del flujo sanguíneo a través de una arteria que priva a las células de oxígeno y nutrientes." }
    ]
  },
  Lípidos: {
    title: "Caso Clínico: Hipercolesterolemia Familiar Heterocigota por Defecto de Receptores LDL",
    patient: {
      name: "Rodrigo",
      age: "24 años",
      gender: "Masculino"
    },
    narrative: "Rodrigo acude a una revisión general donde se detectan niveles de colesterol total extraordinariamente elevados. Durante la exploración física, el médico detecta xantomas tendinosos (depósitos de colesterol nodulares amarillentos) en los tendones de Aquiles y arco corneal (un anillo blanquecino de lípidos alrededor de la córnea). Rodrigo menciona que su padre falleció a los 42 años de un infarto agudo de miocardio. Se sospecha Hipercolesterolemia Familiar tipo IIa. Esta enfermedad genética se debe a mutaciones que alteran el receptor de lipoproteínas de baja densidad (rLDL), impidiendo que el hígado internalice las partículas LDL séricas, acumulando colesterol en el torrente sanguíneo y acelerando la aterogénesis.",
    diseaseDefinition: "La hipercolesterolemia familiar heterocigota es un trastorno genético del metabolismo de lípidos, principalmente autosómico dominante, caracterizado por mutaciones que alteran el funcionamiento del receptor de LDL (rLDL), provocando niveles extremadamente altos de colesterol sérico y un riesgo cardiovascular acelerado desde la juventud.",
    laboratory: [
      { parameter: "Colesterol Total", value: "390 mg/dL", reference: "< 200 mg/dL", interpretation: "Hipercolesterolemia severa" },
      { parameter: "Colesterol LDL ('Malo')", value: "310 mg/dL", reference: "< 100 mg/dL", interpretation: "Extremadamente alto" },
      { parameter: "Colesterol HDL ('Bueno')", value: "45 mg/dL", reference: "> 40 mg/dL", interpretation: "Normal" },
      { parameter: "Triglicéridos", value: "140 mg/dL", reference: "< 150 mg/dL", interpretation: "Normal" }
    ],
    questions: [
      {
        questionText: "¿Cuál es la función bioquímica principal de la lipoproteína LDL en el cuerpo humano?",
        options: [
          "A) Transportar los triglicéridos de la dieta desde el intestino a los tejidos musculares por vía linfática.",
          "B) Transportar el colesterol desde los tejidos periféricos de vuelta al hígado para su excreción en la bilis (transporte reverso).",
          "C) Transportar el colesterol sintetizado en el hígado hacia los tejidos periféricos para la síntesis de membranas y hormonas esteroideas.",
          "D) Disolver de forma directa los coágulos de fibrina presentes en las arterias coronarias."
        ],
        correctIndex: 2,
        correctExplanation: "¡Excelente! Las LDL son lipoproteínas formadas a partir de la degradación de las VLDL y las IDL en la circulación. Tienen una alta concentración de ésteres de colesterol y su función es entregar este lípido a los tejidos periféricos mediante endocitosis mediada por receptores.",
        incorrectExplanation: "Incorrecto. La lipoproteína encargada del transporte de triglicéridos de la dieta es el quilomicrón. La encargada del transporte reverso de colesterol al hígado es la HDL.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/carbohydrates-and-lipids/a/lipids",
        repassLinkLabel: "Khan Academy - Bioquímica de Lípidos"
      },
      {
        questionText: "¿Qué apoproteína específica, presente en la superficie de la partícula LDL, es reconocida por el receptor celular hepático (rLDL) para permitir su endocitosis?",
        options: [
          "A) Apolipoproteína A-I (ApoA-1)",
          "B) Apolipoproteína B-100 (ApoB-100)",
          "C) Apolipoproteína C-II (ApoC-2)",
          "D) Apolipoproteína E (ApoE)"
        ],
        correctIndex: 1,
        correctExplanation: "¡Perfecto! La ApoB-100 es el único ligando proteico presente en las partículas LDL puras. El rLDL reconoce específicamente a la ApoB-100, permitiendo que la partícula LDL sea internalizada por la célula hepática mediante una fosa revestida de clatrina.",
        incorrectExplanation: "Incorrecto. ApoA-1 es característica de la HDL. ApoC-2 activa a la lipoproteína lipasa (LPL). El ligando exclusivo de reconocimiento de la LDL madura es la ApoB-100.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=lipoproteinas+apoproteinas&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Lipoproteínas y Colesterol"
      },
      {
        questionText: "A nivel celular, ¿qué ocurre con el colesterol y el rLDL una vez que la vesícula de endocitosis con LDL se une a un lisosoma celular?",
        options: [
          "A) Los receptores se degradan totalmente, y el colesterol cristaliza destruyendo las mitocondrias hepáticas.",
          "B) La acidez lisosomal disocia el rLDL (que vuelve a la membrana) y las enzimas degradan la ApoB-100 liberando colesterol libre que autorregula la síntesis interna hepática.",
          "C) La partícula de LDL intacta es re-exportada al torrente sanguíneo enriquecida con triglicéridos.",
          "D) El rLDL se fusiona con el núcleo celular induciendo la transcripción de proteínas inflamatorias."
        ],
        correctIndex: 2,
        correctExplanation: "¡Excelente nivel celular! El pH ácido del endosoma/lisosoma disocia el complejo ligando-receptor. El receptor LDL se recicla hacia la membrana plasmática, mientras que los ésteres de colesterol son hidrolizados liberando colesterol libre, el cual regula a la baja la enzima HMG-CoA Reductasa hepática.",
        incorrectExplanation: "Incorrecto. El receptor rLDL normalmente se recicla a la membrana plasmática (no se destruye) para continuar captando LDL. El colesterol se libera para cubrir necesidades celulares o regular la síntesis.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=receptores+ldl&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Receptores LDL"
      },
      {
        questionText: "¿Cuál es la enzima clave reguladora en la síntesis del colesterol intracelular, que es inhibida de manera farmacológica por las estatinas administradas a Rodrigo?",
        options: [
          "A) Colesterol aciltransferasa (ACAT)",
          "B) Lipoproteína Lipasa (LPL)",
          "C) HMG-CoA Reductasa",
          "D) Carnitina Palmitoiltransferasa 1 (CPT-1)"
        ],
        correctIndex: 2,
        correctExplanation: "¡Correcto! La HMG-CoA Reductasa es la enzima limitante de la vía del mevalonato para la síntesis de colesterol. Las estatinas son inhibidores competitivos de esta enzima, reduciendo la producción endógena de colesterol y forzando a la célula a sobreexpresar receptores rLDL para captar colesterol de la sangre.",
        incorrectExplanation: "Incorrecto. La CPT-1 participa en la entrada de ácidos grasos a la mitocondria. La enzima reguladora clave en la biosíntesis de novo del colesterol es la HMG-CoA Reductasa.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/patientinstructions/000795.htm",
        repassLinkLabel: "MedlinePlus - Estatinas y Colesterol"
      },
      {
        questionText: "Químicamente, el colesterol libre posee una estructura molecular anfipática caracterizada por:",
        options: [
          "A) Una larga cadena hidrocarbonada totalmente hidrofílica y un grupo fosfato soluble.",
          "B) Un núcleo de ciclopentanoperhidrofenantreno (esterano) hidrofóbico y un único grupo hidroxilo (-OH) polar en el carbono 3.",
          "C) Tres ácidos grasos unidos covalentemente a una molécula de glicerol por enlaces éster.",
          "D) Un anillo de purina nitrogenado sumamente insoluble en solventes polares."
        ],
        correctIndex: 1,
        correctExplanation: "¡Excelente! El colesterol posee un núcleo esteroide plano muy rígido e hidrófobo, con un grupo hidroxilo (-OH) polar en un extremo. Esta modesta anfipatía le permite intercalarse perfectamente entre los fosfolípidos de las bicapas lipídicas, controlando la fluidez de las membranas.",
        incorrectExplanation: "Incorrecto. Tres ácidos grasos unidos a un glicerol corresponden a un triglicérido. El colesterol tiene como base el núcleo hidrocarbonado de 4 anillos fusionados conocido como ciclopentanoperhidrofenantreno.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=colesterol+estructura&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Estructura del Colesterol"
      }
    ],
    datoCurioso: {
      trivia: "La Hipercolesterolemia Familiar es una de las enfermedades genéticas más comunes del mundo (afecta a 1 de cada 250-310 personas). Un diagnóstico precoz y tratamiento farmacológico reduce el riesgo de padecer enfermedad cardiovascular prematura en más de un 80%, demostrando el impacto directo de la bioquímica en la medicina preventiva.",
      reference: "Organización Mundial de la Salud / ACC, 2023",
      linkUrl: "https://www.who.int/es/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)",
      linkLabel: "OMS - Enfermedades Cardiovasculares y Prevención"
    },
    glossary: [
      { term: "Xantoma", definition: "Depósito de material lipídico rico en colesterol que aparece como un nódulo amarillento bajo la piel o los tendones." },
      { term: "Aterogénesis", definition: "Proceso patológico por el cual se forman placas de lípidos y tejido fibroso (ateromas) en la pared interna de las arterias." },
      { term: "Estatinas", definition: "Grupo de medicamentos que reducen el colesterol inhibiendo competitivamente a la enzima HMG-CoA Reductasa." }
    ]
  },
  "Ácidos Nucleicos": {
    title: "Caso Clínico: Gota Aguda por Hiperuricemia y Depósito de Cristales",
    patient: {
      name: "Ernesto",
      age: "52 años",
      gender: "Masculino"
    },
    narrative: "Ernesto acude de urgencia a medianoche debido a un dolor lacerante e insoportable en el dedo gordo del pie derecho (podagra). Al examen físico se observa la primera articulación metatarsofalángica extremadamente roja, brillante, caliente e inflamada al menor roce. Refiere haber tenido una cena copiosa rica en carnes rojas y mariscos, acompañada de abundante cerveza el día anterior. La degradación de las purinas de estos alimentos (adenina y guanina) culmina en la formación de ácido úrico. Cuando la concentración plasmática supera el límite de solubilidad fisiológica, el ácido úrico precipita en forma de cristales de urato monosódico, los cuales se depositan en el espacio articular induciendo una respuesta inflamatoria inmunitaria masiva.",
    diseaseDefinition: "La gota es una forma dolorosa de artritis inflamatoria desencadenada por la precipitación y depósito de cristales de urato monosódico en el espacio sinovial de las articulaciones, secundaria a niveles crónicamente elevados de ácido úrico plasmático (hiperuricemia) por sobreproducción o baja excreción renal del urato.",
    laboratory: [
      { parameter: "Ácido Úrico Sérico", value: "9.6 mg/dL", reference: "3.5 - 7.2 mg/dL", interpretation: "Hiperuricemia severa" },
      { parameter: "Leucocitos", value: "13,500 /uL", reference: "4,500 - 11,000 /uL", interpretation: "Leucocitosis reactiva" },
      { parameter: "Líquido Sinovial", value: "Cristales aciculares con birrefringencia negativa", reference: "Ausencia de cristales", interpretation: "Patognomónico (Confirma diagnóstico de Gota)" }
    ],
    questions: [
      {
        questionText: "¿Cuál es la ruta bioquímica final de degradación de las purinas en humanos y qué enzima clave cataliza la oxidación de hipoxantina y xantina a ácido úrico?",
        options: [
          "A) Ciclo de la Urea; Arginasa.",
          "B) Catabolismo de purinas; Xantina Oxidasa.",
          "C) Ciclo de Krebs; Succinato Deshidrogenasa.",
          "D) Síntesis de Novo de pirimidinas; Aspartato Transcarbamilasa."
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! En los seres humanos, la degradación de los nucleótidos de purina (AMP y GMP) converge en la formación de xantina. La xantina oxidasa cataliza las reacciones sucesivas de oxidación de hipoxantina a xantina, y de esta a ácido úrico, el producto final excretado por la orina.",
        incorrectExplanation: "Incorrecto. El ciclo de la urea degrada el amonio de los aminoácidos para excretarlo como urea. Las purinas (adenina/guanina) se catabolizan de forma exclusiva hasta ácido úrico por acción de la xantina oxidasa.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=metabolismo+purinas&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Metabolismo de Purinas"
      },
      {
        questionText: "Ernesto toma alopurinol de forma habitual para evitar nuevas crisis. ¿Cómo actúa este fármaco a nivel bioquímico?",
        options: [
          "A) Es un inhibidor análogo que se une covalentemente a la xantina oxidasa bloqueando la síntesis de ácido úrico.",
          "B) Estimula la filtración glomerular del riñón multiplicando por diez la excreción de uratos.",
          "C) Disuelve físicamente las membranas de los macrófagos impidiendo que reconozcan los cristales.",
          "D) Bloquea la absorción digestiva de carnes y mariscos a nivel del intestino delgado."
        ],
        correctIndex: 0,
        correctExplanation: "¡Brillante! El alopurinol es un análogo de la hipoxantina. Actúa como un inhibidor suicida o de unión fuerte a la xantina oxidasa: la enzima lo metaboliza a oxipurinol, el cual queda fuertemente coordinado en el sitio activo de la enzima, inhibiendo de forma irreversible la producción adicional de ácido úrico.",
        incorrectExplanation: "Incorrecto. El alopurinol no afecta el riñón directamente ni bloquea la absorción gástrica de carnes. Es un potente inhibidor enzimático de la xantina oxidasa reduciendo la síntesis de novo del urato.",
        repassLinkUrl: "https://medlineplus.gov/spanish/ency/article/000386.htm",
        repassLinkLabel: "MedlinePlus - Gota y Alopurinol"
      },
      {
        questionText: "¿Por qué los humanos excretamos ácido úrico insoluble en lugar de alantoína, un compuesto soluble presente en la mayoría de otros mamíferos?",
        options: [
          "A) Porque los humanos carecemos de la enzima urato oxidasa (uricasa) debido a una mutación evolutiva inactivadora en nuestro genoma.",
          "B) Porque nuestro riñón reabsorbe activamente la alantoína para fabricar hormonas esteroideas.",
          "C) Porque la alantoína bloquea la respiración mitocondrial en el cerebro humano.",
          "D) Porque los humanos no poseemos el nucleótido guanina, metabolizando solo la adenina."
        ],
        correctIndex: 0,
        correctExplanation: "¡Excelente dato evolutivo! Durante la evolución de los homínidos, el gen de la urato oxidasa (uricasa) sufrió mutaciones que lo inactivaron. Como resultado, carecemos de esta enzima hepática y excretamos ácido úrico insoluble en lugar de alantoína soluble, predisponiéndonos a padecer gota.",
        incorrectExplanation: "Incorrecto. Los humanos sí poseemos y requerimos guanina (el ADN/ARN la tiene). El defecto evolutivo real es la ausencia genética de la enzima uricasa encargada de oxidar el ácido úrico a alantoína soluble.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=enfermedad+gota&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Diagnóstico de Gota"
      },
      {
        questionText: "¿Cuáles son las bases nitrogenadas clasificadas químicamente como purinas (que contienen dos anillos fusionados de carbono y nitrógeno), cuya degradación genera el ácido úrico?",
        options: [
          "A) Timina y Citocina",
          "B) Adenina y Guanina",
          "C) Uracilo y Timina",
          "D) Adenina y Uracilo"
        ],
        correctIndex: 1,
        correctExplanation: "¡Correcto! Las purinas son la Adenina (A) y la Guanina (G). Se componen de un sistema bicíclico (dos anillos de carbono y nitrógeno condensados). Por otro lado, la citosina, timina y uracilo son pirimidinas de un solo anillo.",
        incorrectExplanation: "Incorrecto. Timina, citosina y uracilo son pirimidinas (un solo anillo). Las purinas bicíclicas son exclusivamente la adenina y la guanina.",
        repassLinkUrl: "https://es.khanacademy.org/science/biology/macromolecules/nucleic-acids/a/nucleic-acids",
        repassLinkLabel: "Khan Academy - Ácidos Nucleicos"
      },
      {
        questionText: "¿Cuál es la ruta metabólica de reciclaje o 'salvamento' de purinas que evita que estas bases se degraden a ácido úrico, cuya ausencia causa el Síndrome de Lesch-Nyhan?",
        options: [
          "A) Vía de Leloir",
          "B) Ruta de Salvamento de Purinas mediada por la enzima HGPRT",
          "C) Beta-oxidación mitocondrial de purinas",
          "D) Ruta de la Pentosa Fosfato"
        ],
        correctIndex: 1,
        correctExplanation: "¡Fantástico! La vía de salvamento recupera bases libres (hipoxantina, guanina) y las reincorpora a nucleótidos usando la enzima Hipoxantina-Guanina Fosforribosiltransferasa (HGPRT). Su ausencia total provoca la acumulación masiva de purinas destinadas a la degradación, disparando el ácido úrico y originando el grave Síndrome de Lesch-Nyhan.",
        incorrectExplanation: "Incorrecto. La vía de Leloir metaboliza la galactosa. El salvamento o rescate de bases libres de purina depende fundamentalmente de la enzima HGPRT, vital para regular los niveles de ácido úrico sérico.",
        repassLinkUrl: "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?query=sindrome+lesch+nyhan&v%3Aproject=medlineplus-spanish",
        repassLinkLabel: "MedlinePlus - Síndrome de Lesch-Nyhan"
      }
    ],
    datoCurioso: {
      trivia: "Históricamente, la gota se conoció como 'la enfermedad de los reyes' o de los ricos, ya que se asociaba estrechamente al consumo abundante de carnes, mariscos y alcohol, alimentos que históricamente solo las clases acomodadas podían permitirse regularmente. Científicamente, se ha demostrado que la cerveza eleva el ácido úrico no solo por aportar purinas del lúpulo, sino porque el alcohol compite en el riñón impidiendo la excreción renal de ácido úrico.",
      reference: "Arthritis Foundation, 2024",
      linkUrl: "https://medlineplus.gov/spanish/ency/article/000422.htm",
      linkLabel: "MedlinePlus - Gota"
    },
    glossary: [
      { term: "Podagra", definition: "Ataque agudo de gota que afecta específicamente a la articulación metatarsofalángica del dedo gordo del pie." },
      { term: "Hiperuricemia", definition: "Presencia de niveles elevados de ácido úrico en la sangre, por encima de 7.0 mg/dL." },
      { term: "Líquido Sinovial", definition: "Líquido viscoso y transparente que se encuentra en las cavidades articulares para reducir la fricción en el movimiento." }
    ]
  }
};
