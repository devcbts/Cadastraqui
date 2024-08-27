import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import { useLocation, useNavigate } from "react-router";
export default function AllCandidatesBenefitsTypeTwo() {
    const { state } = useLocation()
    const navigate = useNavigate()
    return (
        <Table.Root headers={['rank', 'candidato', 'condição', 'ação']}>
            <Table.Row>
                <Table.Cell divider>1</Table.Cell>
                <Table.Cell >candidato nome</Table.Cell>
                <Table.Cell>Titular</Table.Cell>
                <Table.Cell>
                    <ButtonBase onClick={() => navigate('', { state: { ...state, candidateId: '123' } })}>
                        <Magnifier width={15} height={15} />
                    </ButtonBase>
                </Table.Cell>

            </Table.Row>
        </Table.Root>
    )
}