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
    const handleChangeBenefit = (type, id, entity) => {
        navigate('', {
            state: {
                ...state,
                benefit: type,
                courseId: id,
                entity
            }
        })
    }
    return (
        <>
            {
                !state?.benefit && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', width: 'max(40%,400px)' }}>
                        <RowActionInput label="Cod. instituição no censo"
                            inputProps={{ defaultValue: announcement?.announcement?.entity?.emec, disabled: true }}

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
                                                {announcement?.announcement.types1?.length > 0 && <One height={30} width={30} cursor={'pointer'} onClick={() => handleChangeBenefit('one', course.id, e)} />}
                                                {announcement?.announcement.type2 && <Two height={30} width={30} cursor={'pointer'} onClick={() => handleChangeBenefit('two', course.id, e)} />}
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