import Table from 'Components/Table'
import styles from '../styles.module.scss'
import VEHICLE_SITUATION from 'utils/enums/vehicle-situation-type'
import VEHICLE_TYPE from 'utils/enums/vehicle-type'
export default function Vehicles({ data }) {
    return (
        <div className={styles.table}>
            {data?.length ? (
                <>
                    <h3>Os integrantes possuem  {data?.length} veículo(s) conforme identificado abaixo:</h3>
                    <Table.Root headers={['proprietário(s)', 'tipo', 'modelo', 'ano', 'situação']}>
                        {
                            data?.map(vehicle => (
                                <Table.Row>
                                    <Table.Cell>{vehicle?.ownerNames?.join(', ')}</Table.Cell>
                                    <Table.Cell>{VEHICLE_TYPE.find(e => e.value === vehicle.vehicleType)?.label}</Table.Cell>
                                    <Table.Cell>{vehicle?.modelAndBrand}</Table.Cell>
                                    <Table.Cell>{vehicle?.manufacturingYear}</Table.Cell>
                                    <Table.Cell>{VEHICLE_SITUATION.find(e => e.value === vehicle.situation)?.label}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                </>
            ) :
                <h3>Os integrantes não possuem nenhum veículo.</h3>

            }
        </div>
    )
}