import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import { ReactComponent as One } from 'Assets/icons/one-round.svg'
import { ReactComponent as Two } from 'Assets/icons/two-round.svg'
import { useLocation, useNavigate } from "react-router";
import BenefitsTypeOne from "./TypeOne";
import BenefitsTypeTwo from "./TypeTwo";
import RowActionInput from "../RowActionInput";
export default function AssistantManagerBenefits() {
    const { state } = useLocation()
    const navigate = useNavigate()
    return (
        <>
            {
                !state?.benefit && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', width: 'max(40%,400px)' }}>
                        <RowActionInput label="Cod. instituição no censo"
                            inputProps={{ placeholder: 'Digite um código' }}
                            buttonProps={{ label: 'salvar' }}
                        />
                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ textAlign: 'center' }}>Relação nominal de bolsistas</h3>
                            <Table.Root headers={['unidade/cidade', 'tipo de benefício']}>
                                <Table.Row>
                                    <Table.Cell>Matriz</Table.Cell>
                                    <Table.Cell>
                                        <One height={30} width={30} cursor={'pointer'} onClick={() => navigate('', { state: { ...state, benefit: 'one' } })} />
                                        <Two height={30} width={30} cursor={'pointer'} onClick={() => navigate('', { state: { ...state, benefit: 'two' } })} />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Root>
                        </div>
                    </div>
                )
            }
            {
                state?.benefit === 'one' && <BenefitsTypeOne />
            }
            {
                state?.benefit === 'two' && <BenefitsTypeTwo />
            }
        </>
    )
}