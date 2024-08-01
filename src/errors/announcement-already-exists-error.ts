export class announcementAlreadyExists extends Error{
    constructor(){
        super("Edital já existente com esse identificador")
    }
}