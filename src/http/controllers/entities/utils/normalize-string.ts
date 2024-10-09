// Função para normalizar o nome do curso
export function normalizeString(name: string) {
    return name
        .normalize('NFD') // Normaliza para decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toLowerCase() // Converte para minúsculas
        .replace(/\s+/g, ''); // Remove espaços
}