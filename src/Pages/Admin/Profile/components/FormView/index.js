import ButtonBase from "Components/ButtonBase";

export default function FormView({ data, onEdit }) {
    return (
        <ButtonBase label={'alterar senha'} onClick={onEdit} />
    )
}