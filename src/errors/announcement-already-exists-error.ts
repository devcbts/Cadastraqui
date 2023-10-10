export class announcementAlreadyExists extends Error{
    constructor(){
        super("Announcement already exists with this id")
    }
}