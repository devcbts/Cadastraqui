import { APIError } from "@/errors/api-error"
import { z } from "zod"
// Keep all filter TYPES centralized, when new filter should be added, just add here
enum EType {
    announcement = 'edital',
    entity = 'entidade',
    userName = 'usuário'
}
type TypeOptions = keyof typeof EType
// filterOpts can be an array of strings (enum to ZOD)
type FnOptions<T extends string = string> = {
    filterOpts?: [T, ...T[]]
}
export default function getFilterParams<T extends string = string>(query: unknown, {
    filterOpts
}: FnOptions<T> = {}): {
    filter?: T | null,
    search?: string | null,
    type?: TypeOptions | null,
    page: number,
    size: number,
} {
    const queryParams = z.object({
        filter: !!filterOpts ? z.enum(filterOpts as [T, ...T[]]).nullish() : z.string().nullish(),
        search: z.string().nullish(),
        type: z.enum(Object.values(EType) as [string, ...string[]]).nullish(),
        page: z.string().default("0").transform(Number),
        size: z.string().default("20").transform(Number)
    })

    const { data, success } = queryParams.safeParse(query)
    if (!success) {
        throw new APIError('Parâmetros inválidos')
    }
    const { filter, page, size, search, type } = data
    const mappedType = Object.entries(EType).find(([k, v]) => v === type)?.[0] as keyof typeof EType
    return {
        filter: filter as T, page, size, search, type: mappedType
    }
}