import NodeCache from "node-cache";

export class CacheManager {
  private cache: NodeCache;

  constructor(stdTTL: number = 10, checkPeriod: number = 20) {
    this.cache = new NodeCache({ stdTTL, checkperiod: checkPeriod });
  }

  // Função para armazenar dados no cache
  setCache<T>(key: string, value: T): boolean {
    return this.cache.set(key, value);
  }

  // Função para obter dados do cache
  getCache<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  // Função para verificar se um item existe no cache
  hasCache(key: string): boolean {
    return this.cache.has(key);
  }

  // Função para remover um item do cache
  delCache(key: string): void {
    this.cache.del(key);
  }
}

// Criando uma instância da classe CacheManager
const cacheManager = new CacheManager(1000, 20);

// Criando um objeto JSON para armazenar no cache
const doc = {
  legibilidade: true,
  retifiedReceiver: true,
  grossAmount: "5988,81",
  netIncome: "3165,49"
};

// Armazenando o objeto JSON no cache
cacheManager.setCache("doc", doc);

// Função para obter e exibir o valor armazenado no cache
function obterCache(doc: string)  {
  const usuarioDoCache = cacheManager.getCache(doc);

  if (usuarioDoCache) {
    console.log("Dados do usuário recuperados do cache:", usuarioDoCache);
  } else {
    console.log("Não há dados no cache ou os dados expiraram.");
  }
}


