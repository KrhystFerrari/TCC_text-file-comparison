import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { compareOneToMany, compareTexts, getHistory } from './api'

const mockResult = {
  labelA: 'a.txt',
  labelB: 'b.txt',
  correlationIndex: 0.5,
  metrics: { jaccard: 0.4, dice: 0.6, cosine: 0.5, semantic: 0.55 },
  stats: { wordCountA: 3, wordCountB: 3, uniqueWordsA: 3, uniqueWordsB: 3 },
  diff: null,
}

describe('compareTexts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends fileA/fileB fields when inputs are files', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    })

    const fileA = new File(['conteudo a'], 'a.txt', { type: 'text/plain' })
    const fileB = new File(['conteudo b'], 'b.txt', { type: 'text/plain' })

    const result = await compareTexts(
      { type: 'file', file: fileA },
      { type: 'file', file: fileB },
    )

    expect(result).toEqual(mockResult)
    const [, requestInit] = fetchMock.mock.calls[0]
    const formData = requestInit.body as FormData
    expect(formData.get('fileA')).toBe(fileA)
    expect(formData.get('fileB')).toBe(fileB)
  })

  it('sends textA/textB fields when inputs are pasted text', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    })

    await compareTexts(
      { type: 'text', text: 'texto A' },
      { type: 'text', text: 'texto B' },
    )

    const [, requestInit] = fetchMock.mock.calls[0]
    const formData = requestInit.body as FormData
    expect(formData.get('textA')).toBe('texto A')
    expect(formData.get('textB')).toBe('texto B')
  })

  it('throws the API error message when the response is not ok', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Requisição inválida' }),
    })

    await expect(
      compareTexts(
        { type: 'text', text: 'texto A' },
        { type: 'text', text: 'texto B' },
      ),
    ).rejects.toThrow('Requisição inválida')
  })

  it('falls back to a generic error message when the response has no body', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error('invalid json')
      },
    })

    await expect(
      compareTexts(
        { type: 'text', text: 'texto A' },
        { type: 'text', text: 'texto B' },
      ),
    ).rejects.toThrow(
      'Não foi possível processar a solicitação. Verifique os textos e arquivos enviados.',
    )
  })
})

describe('getHistory', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the parsed list on success', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] })

    await expect(getHistory()).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/history?limit=20'),
    )
  })

  it('throws when the response is not ok', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({ ok: false, json: async () => null })

    await expect(getHistory()).rejects.toThrow(
      'Falha ao carregar o histórico de comparações.',
    )
  })
})

describe('compareOneToMany', () => {
  const mockManyResult = {
    sourceLabel: 'origem.txt',
    results: [
      {
        ...mockResult,
        labelB: 'candidato.txt',
        rank: 1,
      },
    ],
  }

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends sourceFile and candidateFiles fields when the source is a file', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockManyResult })

    const sourceFile = new File(['origem'], 'origem.txt', {
      type: 'text/plain',
    })
    const candidateFile = new File(['candidato'], 'candidato.txt', {
      type: 'text/plain',
    })

    const result = await compareOneToMany({ type: 'file', file: sourceFile }, [
      candidateFile,
    ])

    expect(result).toEqual(mockManyResult)
    const [, requestInit] = fetchMock.mock.calls[0]
    const formData = requestInit.body as FormData
    expect(formData.get('sourceFile')).toBe(sourceFile)
    expect(formData.get('candidateFiles')).toBe(candidateFile)
  })

  it('sends sourceText when the source is pasted text', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockManyResult })

    await compareOneToMany({ type: 'text', text: 'origem' }, [
      new File(['candidato'], 'candidato.txt'),
    ])

    const [, requestInit] = fetchMock.mock.calls[0]
    const formData = requestInit.body as FormData
    expect(formData.get('sourceText')).toBe('origem')
  })

  it('throws the API error message when the response is not ok', async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Nenhum candidato enviado' }),
    })

    await expect(
      compareOneToMany({ type: 'text', text: 'origem' }, []),
    ).rejects.toThrow('Nenhum candidato enviado')
  })
})
