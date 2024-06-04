import BackPageTitle from "Components/BackPageTitle";
import AnnouncementTable from "../AnnouncementTable";
import styles from './styles.module.scss'
import Logo from '../../../../../../../Assets/images/logo_primary.png'

export default function AnnouncementList({ onSelect }) {
    return (
        <>
            <BackPageTitle title={'Edital selecionado'} path={'/home/editais'} />
            <div className={styles.content}>
                <div className={styles.contentheader}>
                    <img src={Logo} ></img>
                    <span>Total de vagas oferecidas: 35</span>
                </div>
                <AnnouncementTable title={'Unidade: filial ...'} onClick={onSelect} />
            </div>
        </>
    )
}