import Select from "../Select/Select";
import useCep from "../../hooks/useCep";
import useForm from "../../hooks/useForm";
import STATES from "../../utils/enums/states";
import { formatCEP } from "../../utils/format-cep";
import Input from "../Input";
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

                <Input
                    name="name"
                    label="Nome"
                    onChange={handleChangeInfo}
                    value={info.name}
                    error={infoErrors}
                ></Input>


                <Input
                    name="email"
                    label="Email"
                    onChange={handleChangeInfo}
                    value={info.email}
                    error={infoErrors}
                ></Input>
                {customFields?.map((field) => (

                    <Input
                        name={field.name}
                        label={field.label}
                        onChange={handleChangeInfo}
                        value={field.mask ? field.mask(info[field.name]) : info[field.name]}
                        error={infoErrors}
                    ></Input>
                ))}


                <Input
                    name="CEP"
                    label="CEP"
                    onChange={handleChangeInfo}
                    value={formatCEP(info.CEP)}
                    error={infoErrors}
                ></Input>

                <Input
                    name="address"
                    label="Endereço"
                    onChange={handleChangeInfo}
                    value={info.address}
                    error={infoErrors}
                ></Input>

                <Input
                    name="city"
                    label="Cidade"
                    onChange={handleChangeInfo}
                    value={info.city}
                    error={infoErrors}
                ></Input>

                <Input
                    name="neighborhood"
                    label="Bairro"
                    onChange={handleChangeInfo}
                    value={info.neighborhood}
                    error={infoErrors}
                ></Input>

                <Input
                    name="addressNumber"
                    label="Número"
                    onChange={handleChangeInfo}
                    value={info.addressNumber}
                    error={infoErrors}
                ></Input>

                <Select
                    name="UF"
                    label="UF"
                    onChange={handleChangeInfo}
                    value={info.UF}
                    error={infoErrors}
                    options={STATES}
                ></Select>


            </div>

        </div>
    )
}