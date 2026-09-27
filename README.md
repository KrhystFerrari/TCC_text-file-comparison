# TCC — Sistema de Comparação de Conteúdo de Textos

Sistema web para análise de inter-relações entre dois arquivos de texto, calculando um **índice de correlação/similaridade** entre eles. Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 1. Objetivo do projeto

Dado dois arquivos de texto, o sistema deve:

- Processar e comparar o conteúdo dos dois documentos;
- Calcular um ou mais índices de correlação/similaridade entre eles (léxica e, futuramente, semântica);
- Apresentar o resultado de forma visual e compreensível ao usuário através de uma interface web.

O trabalho contempla duas frentes principais, que devem ser exploradas no artigo:

1. **Engenharia de sistema**: escolha de plataforma, linguagem, arquitetura e ferramentas, com justificativa técnica de cada decisão;
2. **Desenvolvimento de front-end**: interface para upload dos arquivos e visualização dos resultados.

## 2. Arquitetura

Monorepo gerenciado com **Yarn Workspaces**, separando front-end e back-end como pacotes independentes que se comunicam via API HTTP (REST).

```
TCC_text-file-comparison/
├── frontend/   → Interface web (Vite + React + TypeScript)
└── backend/    → API de processamento e comparação de textos (NestJS + TypeScript)
```

### Por que monorepo com Yarn Workspaces?

- Permite versionar front-end e back-end juntos, com histórico único, facilitando a narrativa do TCC;
- Compartilha `node_modules` e dependências comuns entre os pacotes, evitando duplicação;
- Scripts centralizados na raiz (ver seção "Scripts disponíveis") para rodar/buildar cada parte sem precisar navegar entre pastas.

## 3. Stack tecnológica e justificativas

### 3.1 Linguagem: TypeScript (full-stack)

Optamos por **TypeScript em toda a aplicação** (front-end e back-end) para:

- Tipagem estática, reduzindo erros em tempo de desenvolvimento;
- Unificar a linguagem entre as camadas, reduzindo a curva de aprendizado e facilitando o compartilhamento de conhecimento/tipos entre front e back;
- Ecossistema maduro para Node.js, com bibliotecas de NLP e similaridade textual suficientes para os algoritmos propostos (evitando a necessidade de um segundo runtime, como Python, só para essa etapa).

### 3.2 Front-end: Vite + React + TypeScript

- **Vite** foi escolhido em vez de Next.js por ser um projeto **client-side puro** (sem necessidade de SSR, SEO ou rotas de API no próprio front-end). Vite oferece build e dev server extremamente rápidos (baseados em ESM nativo/esbuild/Rollup), com configuração mais simples e menos "mágica" para justificar/explicar na banca;
- **React** como biblioteca de UI, pela maturidade, documentação e familiaridade da comunidade acadêmica;
- **TypeScript** para tipar props, estados e o contrato de dados retornado pela API.

### 3.3 Estilização e componentes: Tailwind CSS + shadcn/ui

- **Tailwind CSS (v4)**: abordagem utility-first, permite estilizar rapidamente sem sair do JSX/TSX e sem necessidade de gerenciar arquivos CSS separados por componente;
- **shadcn/ui**: diferente de bibliotecas tradicionais (como Material UI), o shadcn/ui **não é instalado como dependência fechada** — os componentes (baseados em Radix/Base UI + Tailwind) são copiados para dentro do projeto (`src/components/ui`). Isso dá controle total sobre estilo e comportamento, facilita customização e evita o visual "genérico" de UI kits prontos, algo que costuma se destacar positivamente em apresentações;
- Ícones com `lucide-react` e fonte via `@fontsource-variable/geist`.

O usuário pode fornecer cada um dos dois textos de duas formas (alternadas via `Tabs`): enviando um **arquivo** `.txt` ou **colando/digitando** o texto diretamente em uma `Textarea`. A interface usa layout em duas colunas (entrada / resultado), suporte a **tema claro/escuro** (`useTheme`, com persistência em `localStorage` e detecção da preferência do sistema) e indicadores visuais (badge colorido) para o nível de correlação.

A interface está disponível em português, inglês e espanhol por meio de `i18next`/`react-i18next`. O seletor de idioma no cabeçalho persiste a escolha no navegador e atualiza também o idioma da página e a formatação de datas.

Os principais controles têm nomes acessíveis, os seletores de arquivo e áreas de texto incluem rótulos para leitores de tela, os elementos interativos exibem foco de teclado e cursor apropriado, e regiões de resultado/erro usam anúncios ARIA para atualizações assíncronas. A página usa landmarks semânticos (`header`, `main`, `footer`) e oferece link acessível ao portfólio do autor.

### 3.4 Back-end: NestJS + TypeScript

- **NestJS** foi escolhido por trazer uma arquitetura opinativa e madura (módulos, controllers, services, injeção de dependência, decorators), o que favorece a explicação de **engenharia de software** exigida pelo trabalho — organização em camadas, separação de responsabilidades e testabilidade;
- Gera documentação de API de forma simples (Swagger/OpenAPI), o que ajuda a demonstrar o funcionamento do sistema na banca;
- Escrito 100% em TypeScript, mantendo a stack unificada com o front-end.

A API expõe documentação interativa via **Swagger/OpenAPI** em `/docs` (ex.: `http://localhost:3001/docs`), configurada em `main.ts` com `@nestjs/swagger`, incluindo o schema de request (multipart/form-data) e response do endpoint de comparação.

### 3.5 Algoritmos de comparação de texto

O endpoint `POST /text-comparison/compare` recebe, para cada lado (A e B), **ou** um arquivo (`fileA`/`fileB`, via `multipart/form-data`) **ou** um texto colado (`textA`/`textB`, campo de formulário), e calcula quatro métricas combinadas em um índice de correlação final (média simples):

- **Jaccard**: razão entre a interseção e a união dos conjuntos de palavras únicas de cada texto (`natural.WordTokenizer` para tokenização, após normalização — minúsculas e remoção de acentos);
- **Dice** (bigramas de caracteres): calculado via `string-similarity`, sensível à ordem e proximidade dos caracteres, não apenas ao vocabulário;
- **Cosseno**: similaridade de cosseno sobre vetores de frequência de termos (bag-of-words/TF) dos dois textos.
- **Semântica**: similaridade de cosseno entre embeddings de um modelo multilíngue sentence-transformers (`Xenova/paraphrase-multilingual-MiniLM-L12-v2`), que captura significado e paráfrases além da sobreposição de palavras.

A resposta também traz estatísticas (contagem de palavras e palavras únicas de cada arquivo).

O modelo semântico é carregado sob demanda na primeira comparação e reaproveitado nas chamadas seguintes. Ele roda localmente no backend; os testes unitários usam um fake determinístico e não baixam o modelo.

### Benchmark exploratório

O conjunto reproduzível está em `backend/benchmark/benchmark-dataset.json`. Execute `yarn workspace backend benchmark` para recalcular os scores com o modelo semântico real; o script exporta os resultados por par em `backend/benchmark/results.csv` e estatísticas em `backend/benchmark/results.json`.

A versão atual contém 18 pares em português, balanceados em 6 idênticos, 6 paráfrases e 6 não relacionados. As médias foram: similaridade semântica **1,000** para idênticos, **0,786** para paráfrases e **0,020** para não relacionados. Com o limiar exploratório de 0,5, a métrica semântica classificou 18/18 pares; cada métrica léxica classificou 12/18.

> **Limitação metodológica:** os pares são curados manualmente e a amostra é pequena. Os resultados demonstram o funcionamento e ilustram diferenças entre métricas, mas não estimam desempenho generalizável. Para o artigo, amplie o corpus, registre critérios de anotação e calibre/valide limiares com dados separados.

### Comparação 1-para-N

O endpoint `POST /text-comparison/compare-many` recebe um texto de origem (arquivo `sourceFile` ou texto `sourceText`) e até 20 arquivos candidatos (`candidateFiles`). Retorna os candidatos ordenados do mais similar ao menos similar, com métricas, diff e posição no ranking. Cada par comparado também é salvo no histórico.

### Formatos de arquivo suportados

Além de texto colado, o upload aceita **`.txt`**, **`.pdf`** e **`.docx`**, com a extração de texto isolada em `text-comparison/extractors/` (um módulo por formato, despachados por `extractFileText` de acordo com a extensão do arquivo):

- `.txt` → leitura direta do buffer como UTF-8;
- `.pdf` → biblioteca `pdf-parse` (extrai texto de PDFs não-escaneados);
- `.docx` → biblioteca `mammoth` (extrai texto de documentos Word modernos, formato OOXML).

> O formato legado `.doc` (binário, pré-2007) **não é suportado**: não há biblioteca madura para esse formato no ecossistema Node sem depender de conversão externa (ex.: LibreOffice headless), o que fugiria do escopo do projeto.

### Diff visual palavra a palavra

Além das métricas numéricas, a API calcula um **diff clássico por palavra** (algoritmo de LCS — Longest Common Subsequence, implementado em `text-comparison/diff/word-diff.ts`) comparando os textos de forma case-insensitive, mas preservando a grafia original na resposta. O resultado marca cada palavra de cada texto como "em comum" ou "diferente", permitindo que o front-end destaque visualmente as divergências lado a lado.

> Por ter complexidade O(n·m), o diff é pulado (retorna `null`) quando um dos textos ultrapassa `MAX_DIFF_TOKENS` (4000 palavras) — as métricas numéricas continuam sendo calculadas normalmente nesse caso.

O destaque de palavras é uma explicação visual complementar; o score de correlação continua sendo calculado separadamente pelas métricas descritas acima.

### Histórico de comparações (SQLite)

Cada comparação bem-sucedida é persistida em um banco **SQLite** local (via `better-sqlite3`, arquivo em `backend/data/history.sqlite3` por padrão, configurável pela variável `HISTORY_DB_PATH`), no módulo `HistoryModule`:

- `GET /history?limit=20` — lista as comparações mais recentes;
- `GET /history/:id` — busca uma comparação específica;
- `DELETE /history/:id` — remove um registro.

A gravação acontece no `TextComparisonController` (não no `TextComparisonService`), mantendo o serviço de comparação livre de efeitos colaterais/persistência — se o histórico falhar ao salvar, a resposta da comparação não é afetada (o erro é apenas logado). O front-end exibe o histórico em uma seção dedicada, atualizada automaticamente após cada nova comparação.

### 3.6 Gerenciador de pacotes: Yarn

- Uso do **Yarn (Classic/v1)** como gerenciador de pacotes e para o suporte nativo a **Workspaces**, permitindo administrar front-end e back-end como um monorepo único a partir da raiz do projeto.

## 4. Estrutura de pastas

```
TCC_text-file-comparison/
├── package.json                 # Configuração dos workspaces e scripts agregados
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Componentes shadcn/ui (button, card, tabs, textarea...)
│   │   │   ├── text-source-input.tsx  # Alterna entre upload de arquivo e texto colado
│   │   │   └── comparison-result.tsx  # Exibição do índice de correlação e métricas
│   │   ├── hooks/
│   │   │   └── use-text-comparison.ts # Estado e orquestração da chamada à API
│   │   ├── lib/
│   │   │   ├── api.ts           # Cliente HTTP da API de comparação
│   │   │   └── text-input.ts    # Função pura de validação de entrada
│   │   ├── App.tsx              # Composição/apresentação (sem lógica de negócio)
│   │   └── main.tsx
│   └── ...
└── backend/
    ├── src/
    │   ├── app.module.ts
    │   ├── app.controller.ts
    │   ├── app.service.ts
    │   ├── main.ts
    │   └── text-comparison/
    │       ├── text-comparison.module.ts
    │       ├── text-comparison.controller.ts   # Resolve arquivo/texto colado por lado
    │       ├── text-comparison.service.ts       # Orquestra o cálculo do índice
    │       ├── text-comparison.constants.ts     # Token de injeção do tokenizer
    │       ├── dto/
    │       └── similarity/    # Algoritmos puros (Jaccard, Dice, cosseno, tokenizer)
    └── ...
```

> **Decisão de design**: os algoritmos de similaridade e a lógica de estado do front-end foram extraídos em módulos/funções puras e hooks isolados (em vez de ficarem embutidos direto nos controllers/componentes). Isso reduz o acoplamento com frameworks (NestJS, React) e faz com que a maior parte da lógica de negócio seja testável isoladamente, sem subir um servidor ou renderizar a árvore inteira de componentes.

## 5. Pré-requisitos

- Node.js 20+
- Yarn (Classic 1.22+)

## 6. Instalação

Na raiz do projeto:

```bash
yarn install
```

O Yarn Workspaces instala as dependências de `frontend/` e `backend/` de forma unificada.

## 7. Scripts disponíveis (executados na raiz)

| Script                  | Descrição                                      |
| ----------------------- | ----------------------------------------------- |
| `yarn dev:frontend`     | Inicia o servidor de desenvolvimento do Vite     |
| `yarn dev:backend`      | Inicia a API NestJS em modo watch                |
| `yarn build:frontend`   | Gera o build de produção do front-end            |
| `yarn build:backend`    | Compila o back-end (TypeScript → JavaScript)     |

## 8. Status do projeto

- [x] Estruturação do monorepo (Yarn Workspaces) e scaffolding do front-end e back-end;
- [x] Algoritmos de cálculo do índice de correlação (Jaccard, Dice, cosseno);
- [x] Endpoint da API para upload dos dois arquivos e retorno do resultado (`POST /text-comparison/compare`);
- [x] Tela de upload dos arquivos e visualização dos resultados no front-end;
- [x] Testes automatizados com cobertura mínima de 80% no front-end e no back-end;
- [x] Suporte a upload de `.pdf` e `.docx` além de `.txt`;
- [x] Diff visual palavra a palavra (destaque de trechos iguais/diferentes);
- [x] Documentação da API (Swagger, disponível em `/docs`);
- [x] Histórico de comparações persistido em SQLite;
- [x] Métrica de similaridade semântica (embeddings) como complemento às métricas léxicas;
- [x] Comparação 1-para-N com ranking de candidatos por similaridade;
- [x] Benchmark exploratório reproduzível com dataset rotulado e exportação CSV/JSON;
- [x] Internacionalização da interface em português, inglês e espanhol.

### Rodando localmente

```bash
yarn dev:backend    # API em http://localhost:3001
yarn dev:frontend   # Front-end em http://localhost:5173
```

O front-end lê a URL da API da variável `VITE_API_URL` (ver `frontend/.env.example`), com fallback para `http://localhost:3001`.

## 9. Testes automatizados

Ambos os pacotes têm suíte de testes unitários com meta de **cobertura mínima de 80%** (linhas, funções, branches e statements), configurada como threshold obrigatório — o comando de cobertura falha caso a meta não seja atingida.

### Back-end (Jest, via NestJS)

```bash
yarn workspace backend test       # roda os testes
yarn workspace backend test:cov   # roda com relatório de cobertura
yarn workspace backend benchmark  # recalcula o benchmark com o modelo semântico real
```

Cobre os algoritmos puros de similaridade (`similarity/*.spec.ts`), o `TextComparisonService` (regras de negócio) e o `TextComparisonController` (resolução de arquivo vs. texto colado), usando dublês de teste (fakes/mocks) em vez de dependências reais como a lib `natural`.

### Front-end (Vitest + Testing Library)

```bash
yarn workspace frontend test       # roda os testes
yarn workspace frontend test:cov   # roda com relatório de cobertura
```

Cobre a função pura de validação (`lib/text-input.ts`), o cliente de API (`lib/api.ts`, com `fetch` mockado), o hook `useTextComparison` (via `renderHook`) e os componentes (`TextSourceInput`, `ComparisonResult`, `App`) com `@testing-library/react`.

## 10. Autor

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) por Krhystofferson Ferrari.
