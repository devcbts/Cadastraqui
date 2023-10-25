export class AnnouncementNotExists extends Error{
    constructor(){
        super("Announcement do not exists with this id")
    }
}