export class EntityNotExistsErrorWithCNPJ extends Error {
    constructor(public cnpj: string) {
        super(`Entidade com o CNPJ ${cnpj} não existe ou não está vinculada à matriz.`);
        this.name = "EntityNotExistsErrorWithCNPJ";
    }
}