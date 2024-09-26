import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import entityService from "services/entity/entityService";
import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import SHIFT from "utils/enums/shift-types";

export default function EntityAnnouncementCourses() {
    const { announcementId } = useParams()
    const [announcement, setAnnouncement] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getAnnouncementById(announcementId)
                setAnnouncement(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchAnnouncement()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Matrículas por curso'} path={-1} />
            <Table.Root headers={['matriz/filial', 'curso/série/ano', 'tipo de educação', 'turno', 'ação']}>
                {announcement?.educationLevels?.map(e => (
                    <Table.Row key={e.id}>
                        <Table.Cell>{e.entityName}</Table.Cell>
                        <Table.Cell>{e.course?.name}</Table.Cell>
                        <Table.Cell>{findLabel(EDUCATION_TYPE, e.level)}</Table.Cell>
                        <Table.Cell>{e.shift}</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'visualizar'} onClick={() => navigate(e.id)} />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Root>
        </>
    )
}