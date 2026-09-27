import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const translations = {
  'pt-BR': {
    translation: {
      language: {
        label: 'Idioma',
        pt: 'Português',
        en: 'Inglês',
        es: 'Espanhol',
      },
      footer: {
        portfolioLink:
          'Visitar o portfólio de Krhyst Ferrari (abre em nova aba)',
      },
      theme: { light: 'Ativar tema claro', dark: 'Ativar tema escuro' },
      app: {
        name: 'Comparador de Textos',
        title: 'Compare dois textos',
        description:
          'Envie arquivos ou cole o texto para calcular o índice de correlação entre eles.',
        inputs: 'Textos de entrada',
        result: 'Resultado',
        emptyResult: 'O resultado da comparação aparecerá aqui.',
        compare: 'Comparar',
        comparing: 'Comparando...',
        batchTitle: 'Detectar plágio (1 para N)',
        batchDescription:
          'Compare um texto de origem contra vários arquivos candidatos e veja o ranking por similaridade.',
        batchInputs: 'Origem e candidatos',
        batchCompare: 'Comparar com candidatos',
        batchComparing: 'Comparando candidatos...',
        ranking: 'Ranking',
        emptyRanking: 'O ranking de similaridade aparecerá aqui.',
        history: 'Histórico de comparações',
      },
      input: {
        textA: 'Texto A',
        textB: 'Texto B',
        source: 'Texto de origem',
        fileTab: 'Arquivo',
        textTab: 'Texto colado',
        chooseFile: 'Escolher arquivo (.txt, .pdf, .docx)',
        fileInputLabel: '{{title}}: selecionar arquivo .txt, .pdf ou .docx',
        removeFile: 'Remover arquivo',
        pastedLabel: 'Texto colado',
        placeholder: 'Cole ou digite o texto aqui...',
        words_one: '{{count}} palavra',
        words_other: '{{count}} palavras',
      },
      batch: {
        addCandidates: 'Adicionar arquivos candidatos (.txt, .pdf, .docx)',
        removeCandidate: 'Remover {{name}}',
        rankingWith: 'Ranking de similaridade com {{source}}',
      },
      result: {
        correlation: 'Índice de correlação',
        low: 'Baixa similaridade',
        medium: 'Similaridade moderada',
        high: 'Alta similaridade',
        jaccard: 'Jaccard',
        dice: 'Dice',
        cosine: 'Cosseno',
        semantic: 'Semântica',
        tooltip: {
          jaccard:
            'Proporção de palavras em comum em relação ao total de palavras únicas dos dois textos.',
          dice: 'Similaridade entre pares de caracteres consecutivos (bigramas), sensível à ordem das letras.',
          cosine:
            'Similaridade entre a frequência dos termos de cada texto, tratados como vetores.',
          semantic:
            'Similaridade de significado via embeddings (modelo de linguagem), capaz de reconhecer sinônimos e paráfrases.',
          metricLabel: 'O que é a métrica {{metric}}?',
        },
        stats: '{{count}} palavras · {{unique}} únicas',
        diffTitle: 'Comparação lado a lado',
        common: 'Em comum',
        different: 'Diferente',
      },
      history: {
        empty: 'Nenhuma comparação registrada ainda.',
        loading: 'Carregando histórico...',
      },
      errors: {
        comparison: 'Não foi possível comparar os textos.',
        batch: 'Não foi possível comparar os candidatos.',
        history: 'Falha ao carregar o histórico de comparações.',
        invalidRequest:
          'Não foi possível processar a solicitação. Verifique os textos e arquivos enviados.',
      },
    },
  },
  en: {
    translation: {
      language: {
        label: 'Language',
        pt: 'Portuguese',
        en: 'English',
        es: 'Spanish',
      },
      footer: {
        portfolioLink: "Visit Krhyst Ferrari's portfolio (opens in a new tab)",
      },
      theme: { light: 'Switch to light theme', dark: 'Switch to dark theme' },
      app: {
        name: 'Text Comparison',
        title: 'Compare two texts',
        description:
          'Upload files or paste text to calculate their correlation score.',
        inputs: 'Input texts',
        result: 'Result',
        emptyResult: 'The comparison result will appear here.',
        compare: 'Compare',
        comparing: 'Comparing...',
        batchTitle: 'Plagiarism check (1-to-N)',
        batchDescription:
          'Compare a source text against multiple candidate files and view the similarity ranking.',
        batchInputs: 'Source and candidates',
        batchCompare: 'Compare with candidates',
        batchComparing: 'Comparing candidates...',
        ranking: 'Ranking',
        emptyRanking: 'The similarity ranking will appear here.',
        history: 'Comparison history',
      },
      input: {
        textA: 'Text A',
        textB: 'Text B',
        source: 'Source text',
        fileTab: 'File',
        textTab: 'Pasted text',
        chooseFile: 'Choose file (.txt, .pdf, .docx)',
        removeFile: 'Remove file',
        fileInputLabel: '{{title}}: choose a .txt, .pdf, or .docx file',
        pastedLabel: 'Pasted text',
        placeholder: 'Paste or type text here...',
        words_one: '{{count}} word',
        words_other: '{{count}} words',
      },
      batch: {
        addCandidates: 'Add candidate files (.txt, .pdf, .docx)',
        removeCandidate: 'Remove {{name}}',
        rankingWith: 'Similarity ranking for {{source}}',
      },
      result: {
        correlation: 'Correlation score',
        low: 'Low similarity',
        medium: 'Moderate similarity',
        high: 'High similarity',
        jaccard: 'Jaccard',
        dice: 'Dice',
        cosine: 'Cosine',
        semantic: 'Semantic',
        tooltip: {
          jaccard:
            'Ratio of shared words to the total number of unique words in both texts.',
          dice: 'Similarity based on consecutive character pairs (bigrams), sensitive to letter order.',
          cosine: 'Similarity between term-frequency vectors for each text.',
          semantic:
            'Meaning similarity using language-model embeddings; can recognize synonyms and paraphrases.',
          metricLabel: 'About the {{metric}} metric',
        },
        stats: '{{count}} words · {{unique}} unique',
        diffTitle: 'Side-by-side comparison',
        common: 'Shared',
        different: 'Different',
      },
      history: {
        empty: 'No comparisons recorded yet.',
        loading: 'Loading history...',
      },
      errors: {
        comparison: 'Could not compare the texts.',
        batch: 'Could not compare the candidates.',
        history: 'Could not load comparison history.',
        invalidRequest:
          'Could not process the request. Check the submitted texts and files.',
      },
    },
  },
  es: {
    translation: {
      language: {
        label: 'Idioma',
        pt: 'Portugués',
        en: 'Inglés',
        es: 'Español',
      },
      footer: {
        portfolioLink:
          'Visitar el portafolio de Krhyst Ferrari (se abre en una pestaña nueva)',
      },
      theme: { light: 'Cambiar al tema claro', dark: 'Cambiar al tema oscuro' },
      app: {
        name: 'Comparador de Textos',
        title: 'Compare dos textos',
        description:
          'Suba archivos o pegue texto para calcular el índice de correlación.',
        inputs: 'Textos de entrada',
        result: 'Resultado',
        emptyResult: 'El resultado de la comparación aparecerá aquí.',
        compare: 'Comparar',
        comparing: 'Comparando...',
        batchTitle: 'Detectar plagio (1 a N)',
        batchDescription:
          'Compare un texto de origen con varios archivos candidatos y consulte el ranking de similitud.',
        batchInputs: 'Origen y candidatos',
        batchCompare: 'Comparar con candidatos',
        batchComparing: 'Comparando candidatos...',
        ranking: 'Ranking',
        emptyRanking: 'El ranking de similitud aparecerá aquí.',
        history: 'Historial de comparaciones',
      },
      input: {
        textA: 'Texto A',
        textB: 'Texto B',
        source: 'Texto de origen',
        fileTab: 'Archivo',
        textTab: 'Texto pegado',
        chooseFile: 'Elegir archivo (.txt, .pdf, .docx)',
        removeFile: 'Eliminar archivo',
        fileInputLabel: '{{title}}: elegir un archivo .txt, .pdf o .docx',
        pastedLabel: 'Texto pegado',
        placeholder: 'Pegue o escriba el texto aquí...',
        words_one: '{{count}} palabra',
        words_other: '{{count}} palabras',
      },
      batch: {
        addCandidates: 'Agregar archivos candidatos (.txt, .pdf, .docx)',
        removeCandidate: 'Eliminar {{name}}',
        rankingWith: 'Ranking de similitud con {{source}}',
      },
      result: {
        correlation: 'Índice de correlación',
        low: 'Similitud baja',
        medium: 'Similitud moderada',
        high: 'Similitud alta',
        jaccard: 'Jaccard',
        dice: 'Dice',
        cosine: 'Coseno',
        semantic: 'Semántica',
        tooltip: {
          jaccard:
            'Proporción de palabras compartidas respecto al total de palabras únicas de ambos textos.',
          dice: 'Similitud entre pares de caracteres consecutivos (bigramas), sensible al orden de las letras.',
          cosine:
            'Similitud entre los vectores de frecuencia de términos de cada texto.',
          semantic:
            'Similitud de significado mediante embeddings; reconoce sinónimos y paráfrasis.',
          metricLabel: 'Acerca de la métrica {{metric}}',
        },
        stats: '{{count}} palabras · {{unique}} únicas',
        diffTitle: 'Comparación lado a lado',
        common: 'En común',
        different: 'Diferente',
      },
      history: {
        empty: 'Aún no hay comparaciones registradas.',
        loading: 'Cargando historial...',
      },
      errors: {
        comparison: 'No se pudieron comparar los textos.',
        batch: 'No se pudieron comparar los candidatos.',
        history: 'No se pudo cargar el historial de comparaciones.',
        invalidRequest:
          'No se pudo procesar la solicitud. Revise los textos y archivos enviados.',
      },
    },
  },
} as const

const storedLanguage =
  typeof localStorage === 'undefined' ? null : localStorage.getItem('language')
const initialLanguage =
  storedLanguage === 'en' || storedLanguage === 'es' ? storedLanguage : 'pt-BR'

void i18n.use(initReactI18next).init({
  resources: translations,
  lng: initialLanguage,
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
  returnNull: false,
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage
}

export default i18n
