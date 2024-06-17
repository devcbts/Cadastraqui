import SelectBase from "Components/SelectBase";
import { useState } from "react";
import Subsidiary from "./components/Subsidiary";
import Responsible from "./components/Responsible";
import Assistant from "./components/Assistant";

export default function EntitySelectRegister() {
    const [selection, setSelection] = useState({ label: 'Filial', value: 'subsidiary' })
    const options = [
        { label: 'Filial', value: 'subsidiary' },
        { label: 'Responsável', value: 'responsible' },
        { label: 'Assistente', value: 'assistant' },
        { label: 'Edital', value: 'announcement' },
    ]
    return (
        <>
            <h1>Cadastro</h1>
            <div style={{ maxWidth: 'max(200px,30%)' }}>
                <SelectBase label="Selecione o que deseja cadastrar" options={options} value={selection} onChange={(v) => setSelection(v)} error={null} />
            </div>
            {selection?.value === "subsidiary" && <Subsidiary />}
            {selection?.value === "responsible" && <Responsible />}
            {selection?.value === "assistant" && <Assistant />}
        </>
    )
}