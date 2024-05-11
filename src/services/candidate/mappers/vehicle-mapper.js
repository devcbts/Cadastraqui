class VehicleMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        console.log(data)
        const mappedData = data.map((vehicleInfo) => {
            const owners = vehicleInfo.FamilyMemberToVehicle.map(member => (
                { ...member.familyMembers }
            ))
            return {
                ...vehicleInfo,
                owners,
                owners_id: owners.map(e => e.id)
            }
        }

        )
        console.log(mappedData)
        return mappedData
    }
}

export default new VehicleMapper()