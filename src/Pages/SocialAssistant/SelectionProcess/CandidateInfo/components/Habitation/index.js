import Table from 'Components/Table'
import styles from '../../styles.module.scss'
import NUMBER_ROOMS from 'utils/enums/number-rooms'
import DOMICILE_TYPE from 'utils/enums/domicile-type'
import PROPERTY_STATUS from 'utils/enums/property-status'
export default function Habitation({ data }) {
    return (
        <div className={styles.table}>
            <h3>Moradia</h3>
            <Table.Root headers={['tipo de domicílio', 'status', 'cômodos', 'cômodos utilizados como dormitório']}>
                <Table.Row>
                    <Table.Cell>{DOMICILE_TYPE.find(e => e.value === data?.domicileType)?.label}</Table.Cell>
                    <Table.Cell>{PROPERTY_STATUS.find(e => e.value === data?.propertyStatus)?.label}</Table.Cell>
                    <Table.Cell>{NUMBER_ROOMS.find(e => e.value === data?.numberOfRooms)?.label}</Table.Cell>
                    <Table.Cell>{data?.numberOfBedrooms}</Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}