import BackPageTitle from "Components/BackPageTitle";
import AnnouncementTable from "../AnnouncementTable";
import styles from './styles.module.scss'
import Logo from '../../../../../../../Assets/images/logo_primary.png'

export default function AnnouncementList({ announcement, onSelect }) {
    return (
        <>
            <BackPageTitle title={'Edital selecionado'} path={'/home/editais'} />
            <div className={styles.content}>
                <div className={styles.contentheader}>
                    <img src={Logo} ></img>
                    <span>Total de vagas oferecidas: {announcement?.verifiedScholarships}</span>
                </div>
                {
                    announcement?.apply?.map((courseToApply) => {
                        const { criteria } = announcement
                        const { courses } = courseToApply
                        const row = courses?.map((e) => ({ criteria: criteria.join('; '), ...e }))
                        console.log('cursos', courseToApply)
                        if (!courses?.length) return null
                        return <
                            AnnouncementTable
                            key={courseToApply?.id}
                            title={`Unidade: ${courseToApply?.socialReason}`}
                            rowData={row}
                            onClick={(id) => onSelect({ ...courseToApply, course: courses.find((e) => e.id === id) })}
                        />
                    })
                }
            </div>
        </>
    )
}