import { CacheManager } from "@/http/controllers/students/CacheManager";

export const cacheManager = new CacheManager(1500, 20); // 25 minutos (1500 segundos)