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
    const { announcement = null } = state
    const navigate = useNavigate()
    const handleChangeBenefit = (type, id) => {
        navigate('', {
            state: {
                ...state,
                benefit: type,
                courseId: id
            }
        })
    }
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
                            <Table.Root headers={['unidade/cidade', 'curso', 'tipo de benefício']}>
                                {
                                    announcement?.educationLevels?.map((e) => {
                                        const { matchedEducationLevels } = e
                                        console.log(matchedEducationLevels)
                                        return matchedEducationLevels?.map(course =>
                                        (<Table.Row>
                                            <Table.Cell>{course.entity}</Table.Cell>
                                            <Table.Cell>{course?.availableCourses ?? course?.grade}</Table.Cell>
                                            <Table.Cell>
                                                {announcement?.announcement.types1?.length && <One height={30} width={30} cursor={'pointer'} onClick={() => handleChangeBenefit('one', course.id)} />}
                                                {announcement?.announcement.type2 && <Two height={30} width={30} cursor={'pointer'} onClick={() => handleChangeBenefit('two', course.id)} />}
                                            </Table.Cell>
                                        </Table.Row>)
                                        )
                                    })
                                }
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