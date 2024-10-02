import ButtonBase from "Components/ButtonBase";
import EDUCATION_TYPE from "utils/enums/education-type";

export default function EntityStudentsRenewProcessEducationSelect({ onSubmit }) {
    const handleSubmit = (educationType) => {

        onSubmit({ educationType })
    }
    return (
        <div style={{ padding: '24px', display: "flex", flexDirection: 'row', gap: '24px' }}>
            <ButtonBase label={'Básico'} onClick={() => handleSubmit(EDUCATION_TYPE[0].value)} />
            <ButtonBase label={'Superior'} onClick={() => handleSubmit(EDUCATION_TYPE[1].value)} />
        </div>
    )
}