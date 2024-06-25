import Table from 'Components/Table'
import styles from '../../styles.module.scss'
import VEHICLE_TYPE from 'utils/enums/vehicle-type'
import VEHICLE_SITUATION from 'utils/enums/vehicle-situation-type'
export default function Vehicle({ data }) {
    return (
        <div className={styles.table}>
            <h3>Veículos</h3>
            <Table.Root headers={['tipo', 'modelo', 'ano', 'seguro', 'situação']}>
                {
                    data.map((vehicle) => (
                        <Table.Row>
                            <Table.Cell>{VEHICLE_TYPE.find(e => e.value === vehicle.vehicleType)?.label}</Table.Cell>
                            <Table.Cell>{vehicle.modelAndBrand}</Table.Cell>
                            <Table.Cell>{vehicle.manufacturingYear}</Table.Cell>
                            <Table.Cell>{vehicle.hasInsurance ? 'Sim' : 'Não'}</Table.Cell>
                            <Table.Cell>{VEHICLE_SITUATION.find(e => e.value === vehicle.situation)?.label}</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}