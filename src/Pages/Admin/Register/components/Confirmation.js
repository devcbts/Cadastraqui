import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FilePreview from "Components/FilePreview";
import InputBase from "Components/InputBase";
import styles from './styles.module.scss';

export default function Confirmation({ data, onPageChange, onSubmit }) {
    const handlePageChange = () => {
        onPageChange(-1)
    }
    const handleSubmit = () => {
        onSubmit(data)
    }
    return (
        <div className={styles.container}>
            <BackPageTitle title={'Confirmação'} onClick={handlePageChange} />
            <fieldset style={{ all: "unset" }} className={styles.informacoes} disabled  >

                <InputBase value={data?.CNPJ} name="CNPJ" label={"CNPJ"} error={null} />
                <InputBase value={data?.name} name="name" label={"nome da instituição"} error={null} />
                <InputBase value={data?.email} name="email" label={"email institucional"} error={null} />
                <InputBase value={data?.phone} name="phone" label={"telefone"} error={null} />
                <InputBase value={data?.socialReason} name="socialReason" label={"razão social"} error={null} />
                <InputBase value={data?.educationalInstitutionCode} name="educationalInstitutionCode" label={"código institucional"} error={null} />

                <FilePreview file={data?.file} />
                <div className={styles.endereco}>
                    <InputBase value={data?.CEP} name="CEP" label={"CEP"} error={null} />
                    <InputBase value={data?.city} name="city" label={"cidade"} error={null} />
                    <InputBase value={data?.UF} name="UF" label={"UF"} error={null} />
                    <InputBase value={data?.neighborhood} name="neighborhood" label={"bairro"} error={null} />
                </div>
                <InputBase value={data?.address} name="address" label={"rua"} error={null} />
                <InputBase value={data?.addressNumber} name="addressNumber" label={"número"} error={null} />
            </fieldset>
            <ButtonBase style={{ marginBottom: '30px' }} label={'concluir'} onClick={handleSubmit} />
        </div>
    )
}