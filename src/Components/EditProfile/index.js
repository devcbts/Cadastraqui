import Select from "../Select/Select";
import useCep from "../../hooks/useCep";
import useForm from "../../hooks/useForm";
import STATES from "../../utils/enums/states";
import { formatCEP } from "../../utils/format-cep";
import RegisterInput from "../../Pages/Login/RegisterInput";
export default function EditProfile({ data, onEdit, onClose, customFields = [], validation }) {
    const [[info, setInfo], handleChangeInfo, infoErrors, submit] = useForm(data, validation)
    const handleEditUser = () => {
        if (!submit()) { return }
        onEdit(info)
    }
    useCep((address) => {
        setInfo(address)
    }, info.CEP)
    return (
        <div className="solicitacoes personal-info">

            <div className="upper-info">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <h2>Informações pessoais</h2>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <button onClick={onClose}>Cancelar</button>
                        <button onClick={handleEditUser}>Salvar</button>
                    </div>
                </div>

                <div className="info-item">
                    <h3>Nome:</h3>
                    <RegisterInput
                        name="name"
                        onChange={handleChangeInfo}
                        value={info.name}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>Email:</h3>
                    <RegisterInput
                        name="email"
                        onChange={handleChangeInfo}
                        value={info.email}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                {customFields?.map((field) => (
                    <div className="info-item">
                        <h3>{field.label}</h3>
                        <RegisterInput
                            name={field.name}
                            onChange={handleChangeInfo}
                            value={field.mask ? field.mask(info[field.name]) : info[field.name]}
                            error={infoErrors}
                        ></RegisterInput>
                    </div>
                ))}

                <div className="info-item">
                    <h3>CEP:</h3>
                    <RegisterInput
                        name="CEP"
                        onChange={handleChangeInfo}
                        value={formatCEP(info.CEP)}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>Endereço:</h3>
                    <RegisterInput
                        name="address"
                        onChange={handleChangeInfo}
                        value={info.address}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>Cidade:</h3>
                    <RegisterInput
                        name="city"
                        onChange={handleChangeInfo}
                        value={info.city}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>Bairro:</h3>
                    <RegisterInput
                        name="neighborhood"
                        onChange={handleChangeInfo}
                        value={info.neighborhood}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>Número:</h3>
                    <RegisterInput
                        name="addressNumber"
                        onChange={handleChangeInfo}
                        value={info.addressNumber}
                        error={infoErrors}
                    ></RegisterInput>
                </div>
                <div className="info-item">
                    <h3>UF:</h3>
                    <Select
                        name="UF"
                        onChange={handleChangeInfo}
                        value={info.UF}
                        error={infoErrors}
                        options={STATES}
                    ></Select>
                </div>


            </div>

        </div>
    )
}