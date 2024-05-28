class VehicleMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const mappedData = data.map((vehicleInfo) => {
            return {
                ...vehicleInfo,
            }
        }

        )
        return mappedData
    }
}

export default new VehicleMapper()