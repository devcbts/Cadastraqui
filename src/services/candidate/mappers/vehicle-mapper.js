import { formatCurrency } from "utils/format-currency"

class VehicleMapper {
    toPersistence(data) {
        throw Error('not implemented')
    }

    fromPersistence(data) {
        const mappedData = data.map((vehicleInfo) => {
            return {
                ...vehicleInfo,
                insuranceValue: formatCurrency(vehicleInfo?.insuranceValue)
            }
        }

        )
        return mappedData
    }
}

export default new VehicleMapper()