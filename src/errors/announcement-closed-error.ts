export class AnnouncementClosed extends Error{
    constructor(){
        super("Announcement application period is closed")
    }
}