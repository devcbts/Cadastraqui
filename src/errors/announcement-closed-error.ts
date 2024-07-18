export class AnnouncementClosed extends Error{
    constructor(){
        super("Edital fora do período de inscrição")
    }
}