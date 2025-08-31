/**
 * RAG para checagem de consistência entre FORMULÁRIO e DOCUMENTOS
 * ---------------------------------------------------------------
 * Agora com extração de texto de PDFs e imagens (OCR com Tesseract.js).
 *
 * Stack sugerida:
 *   npm i @langchain/openai @langchain/core @langchain/community langchain zod dotenv
 *   npm i pdf-parse tesseract.js
 *
 * Pré-requisitos:
 *   - OPENAI_API_KEY no .env
 *   - Coloque os arquivos (PDFs, imagens) em um diretório acessível.
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import Tesseract from 'tesseract.js'
import { z } from 'zod'
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { Document as LCDocument } from "@langchain/core/documents"

// ===============================================================
// EXTRAÇÃO DE TEXTO (PDF e imagens)
// ===============================================================

export async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath)
    const data = await pdf(buffer)
    if (data.text && data.text.trim().length > 20) {
      return normalizeText(data.text)
    } else {
      console.log(`[OCR] PDF sem texto nativo, tentando OCR...`)
      return normalizeText(await extractTextWithOCR(filePath))
    }
  }

  if ([".jpg", ".jpeg", ".png", ".bmp", ".tiff"].includes(ext)) {
    return normalizeText(await extractTextWithOCR(filePath))
  }

  throw new Error(`Formato de arquivo não suportado: ${ext}`)
}

async function extractTextWithOCR(filePath: string): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(filePath, "por")
  return text
}

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // remove quebras de linha excessivas
    .replace(/\u00A0/g, ' ') // espaços não separáveis
    .trim()
}

// ===============================================================
// INDEXAÇÃO
// ===============================================================

export async function buildIndex(docs: { id: string, filename: string, text: string }[]) {
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" })
  const store = new MemoryVectorStore(embeddings)

  for (const doc of docs) {
    const chunks = splitIntoChunks(doc.text)
    await store.addDocuments(chunks.map(c => new LCDocument({ pageContent: c, metadata: { source: doc.filename } })))
  }
  return store
}

function splitIntoChunks(text: string, maxLength = 800): string[] {
  const words = text.split(' ')
  const chunks: string[] = []
  let current: string[] = []

  for (const w of words) {
    if (current.join(' ').length + w.length > maxLength) {
      chunks.push(current.join(' '))
      current = []
    }
    current.push(w)
  }
  if (current.length) chunks.push(current.join(' '))
  return chunks
}

// ===============================================================
// RAG + CHECAGEM
// ===============================================================

export async function checkFormAgainstDocs(index: MemoryVectorStore, fields: { key: string, label: string, value: string, type?: string }[]) {
  const llm = new ChatOpenAI({ modelName: "gpt-5-mini" })

  const schema = z.object({
    resumo: z.string(),
    itens: z.array(z.object({
      campo: z.string(),
      valorFormulario: z.string(),
      valorDocumento: z.string().optional(),
      consistencia: z.enum(["igual", "parcial", "diferente", "nao_encontrado"]),
      confianca: z.number().min(0).max(1),
      justificativa: z.string()
    }))
  })

const parser = StructuredOutputParser.fromZodSchema(schema as unknown as any)

  const prompt = ChatPromptTemplate.fromTemplate(`Você é um auditor de dados.
Compare os valores do formulário com as evidências dos documentos. Responda em JSON válido:

IMPORTANTE: Se o documento apresentar múltiplos valores de renda, priorize a renda líquida para comparação. Caso não encontre explicitamente a renda líquida, explique como chegou ao valor considerado.

Campos do formulário:
{campos}

Trechos recuperados dos documentos:
{contexto}

{format_instructions}`)

  const chain = RunnableSequence.from([
    {
      campos: async (input: any) => JSON.stringify(fields, null, 2),
      contexto: async (input: any) => {
        const results: any[] = []
        for (const f of fields) {
          const retrieved = await index.similaritySearch(f.value, 3)
          results.push({ campo: f.key, evidencias: retrieved.map(r => r.pageContent) })
        }
        return JSON.stringify(results, null, 2)
      },
      format_instructions: async () => parser.getFormatInstructions()
    },
    prompt,
    llm,
    parser
  ])

  const resposta = await chain.invoke({})

  // Estimar número de tokens (input + output)
  // Aproximação: 1 token ≈ 4 caracteres em inglês, pode variar em português
  const camposStr = JSON.stringify(fields)
  const contextoStr = JSON.stringify(await Promise.all(fields.map(async f => {
    const retrieved = await index.similaritySearch(f.value, 3)
    return { campo: f.key, evidencias: retrieved.map(r => r.pageContent) }
  })))
  const respostaStr = JSON.stringify(resposta)
  const totalChars = camposStr.length + contextoStr.length + respostaStr.length
  const totalTokens = Math.ceil(totalChars / 4)

  // Preço gpt-5-nano (jun/2025): input $0.00025/1K tokens, output $0.0020/1K tokens
  // Para simplificar, considerar tudo como output (máximo): $0.0020/1K tokens
  const custo = (totalTokens / 1000) * 0.0020

  // Adicionar campo ao resultado
  // Garante que 'itens' sempre exista no resultado
  let safeResposta: any = typeof resposta === 'object' && resposta !== null ? resposta : { resposta }
  if (!safeResposta.itens) safeResposta.itens = []
  return { ...safeResposta, custo_estimado_usd: Number(custo.toFixed(6)) }
}

// ===============================================================
// EXEMPLO DE USO
// ===============================================================

if (require.main === module) {
  ;(async () => {
    const holeriteText = await extractText("./holerite.pdf")
    const documentText = await extractText("./CNH.pdf")
    const rawDocs = [
      { id: 'contracheque_junho', filename: 'holerite.pdf', text: holeriteText },
      { id: 'cnh', filename: 'CNH.pdf', text: documentText },
    ]

    const fields = [
  
      { key: 'renda_liquida', label: 'Renda mensal Liquida', value: 'R$ 6.240,00', type: 'currency' },
     { key: 'nome', label: 'Nome completo', value: 'Davi Victor dos Santos Bastos', type: 'string' },
     {key: 'RG',label: "RG", value: "22.481.161-44", type:'string'},
      { key: 'cpf', label: 'CPF', value: '034.404.665-66', type: 'cpf' },
    ]

    const index = await buildIndex(rawDocs)
    const result = await checkFormAgainstDocs(index, fields)
    console.dir(result, { depth: null })

    // Função para mascarar valores sensíveis
    function maskValue(key: string, value: string): string {
      if (key === 'cpf') return value.replace(/\d/g, '*')
      if (key === 'renda_liquida' || key === 'RG' || key.toLowerCase().includes('valor')) return '***'
      return value
    }

    // Mascarar campos em itens
    const masked = {
      ...result,
      itens: result.itens.map((item: any) => ({
        ...item,
        valorFormulario: maskValue(item.campo, item.valorFormulario),
        valorDocumento: item.valorDocumento ? maskValue(item.campo, item.valorDocumento) : undefined
      }))
    }

    // Exportar para JSON
    fs.writeFileSync('resultado_auditoria.json', JSON.stringify(masked, null, 2), 'utf-8')
  })()
}

/**
 * Dicas:
 * - Coloque PDFs/Imagens em uma pasta "samples/".
 * - `pdf-parse` cobre PDFs com texto nativo.
 * - `tesseract.js` cobre OCR de PDFs/imagens escaneadas.
 * - Se performance for crítica, considere Google Vision ou AWS Textract.
 */
