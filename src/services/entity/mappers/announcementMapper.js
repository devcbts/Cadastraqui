class AnnouncementMapper {
    toPersistence(data) {
        return {
            entityChanged: false,
            branchChanged: false,
            offeredVacancies: 0,
            ...data
        }
    }
}

export default new AnnouncementMapper()