/**
 * 
 * @param {*} form [{field:string, value: any}]
 */
export default function FormSummary({ title, form, onConfirm, onCancel }) {

    return (
        <div className="novo-cadastro" style={{ display: "flex", flexDirection: "column", padding: "16px", width: "70vw", marginLeft: "26vw" }}>
            <h2>{title ?? "Confirme os dados"}</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {
                    form.map((currentField) => (
                        <fieldset style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            <label>{currentField.field}</label>
                            <p>{currentField.value}</p>
                        </fieldset>
                    ))
                }
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", alignItems: "center", justifyContent: "center" }}>
                <button onClick={onCancel}>Cancelar</button>
                <button onClick={onConfirm} >Confirmar</button>
            </div>
        </div>
    )
}