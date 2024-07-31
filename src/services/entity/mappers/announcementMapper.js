class AnnouncementMapper {
    toPersistence(data) {
        return {
            ...data,
            entityChanged: false,
            branchChanged: false,
            offeredVacancies: 0,
            educationalLevels: data.educationalLevels.map((e) => {
                delete e['_identifier']
                return e
            }),
        }
    }
}

export default new AnnouncementMapper()