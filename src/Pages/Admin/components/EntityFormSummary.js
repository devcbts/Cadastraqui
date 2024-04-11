import FormSummary from "../../../Components/FormSummary/FormSummary"

export default function EntityFormSummary({ data, onSubmit, onCancel }) {
    const formattedData = [
        { field: "CNPJ", value: data.CNPJ },
        { field: "Email Institucional", value: data.email },
        { field: "Nome da Instituição", value: data.name },
        { field: "Razão Social", value: data.socialReason },
        { field: "CEP", value: data.CEP },
        { field: "Endereço", value: `${data.address}, ${data.neighborhood}, Nº${data.addressNumber}. ${data.city}-${data.UF}` },
        { field: "Código Institucional", value: data.educationalInstitutionCode },

    ]


    console.log(data)
    return (
        <FormSummary form={formattedData} onCancel={onCancel} onConfirm={onSubmit} />
    )
}