class HealthInfoMapper {
    toPersistence(data) {
        const mappedData = { ...data, diseases: [data.disease] }
        return mappedData
    }

    fromPersistence(data) {
        const mappedData = data?.map(e => {
            if (Object.keys(e.healthInfo ?? {}).length === 0) {
                return { ...e, healthInfo: [] }
            }
            return {
                ...e,
                healthInfo: e.healthInfo.map((i) => ({
                    ...i,
                    hasDisease: !!i.disease,
                    controlledMedication: !!i.medication.length
                }))
            }
        })
        return mappedData
    }
}

export default new HealthInfoMapper()