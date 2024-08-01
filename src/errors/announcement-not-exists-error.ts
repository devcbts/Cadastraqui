export class AnnouncementNotExists extends Error{
    constructor(){
        super("Edital não existe")
    }
}