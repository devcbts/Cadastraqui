import CRITERIAS from "utils/enums/criterias"

class AnnouncementMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const { announcement, educationLevels } = data
        // apply are all available courses related to the current announcement
        // each one has its own entity linked to it
        return (
            {
                ...{ ...announcement, criteria: announcement?.criteria?.map(e => CRITERIAS.find(c => c.value === e).label) },
                apply: educationLevels.map(e => ({
                    ...e,
                    courses: e.matchedEducationLevels
                }))
            }
        )
    }
}

export default new AnnouncementMapper()