import ButtonBase from "Components/ButtonBase";
import MemberCard from "./components/MemberCard";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import styles from './styles.module.scss'
export default function MembersList({ onSelect }) {
    return (
        <>
            <div>
                <h1 className={commonStyles.title}>Parentes Cadastrados</h1>
                <p>Selecione um parente ou cadastre um novo</p>
            </div>
            <div className={styles.list}>
                <MemberCard />
                <MemberCard />
                <MemberCard />
            </div>
            <ButtonBase
                label="adicionar"
            />
        </>
    )
}