import MenuCard from "Components/MenuCard";
import { ReactComponent as StudentList } from 'Assets/icons/student-list.svg'
import { ReactComponent as NewStudent } from 'Assets/icons/student-register.svg'
import { useNavigate } from "react-router";
import BackPageTitle from "Components/BackPageTitle";

export default function EntityStudentManager() {
    const navigate = useNavigate()
    return (
        <>
            <BackPageTitle path={'/alunos'} title={'Gestão de alunos'} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', padding: '64px 24px' }}>

                <MenuCard Icon={StudentList} title={'Listagem'} onClick={() => navigate('lista')} />
                <MenuCard Icon={NewStudent} title={'Cadastrar'} onClick={() => navigate('registro')} />

            </div>
        </>
    )
}