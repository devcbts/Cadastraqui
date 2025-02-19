import Accordion from "Components/Accordion"
import { useMemo } from "react"
import Accounting from "./Accounting"
import CnpjCard from "./CnpjCard"
import DebitCertificate from "./DebitCertificate"
import ElectionRecord from "./ElectionRecord"
import FGTS from "./FGTS"
import InternalRules from "./InternalRules"
import Procuration from "./Procuration"
import PublicDeed from "./PublicDeed"
import ResponsibleCpf from "./ResponsibleCpf"
import SocialStatus from "./SocialStatus"

export default function EntityLegalFiles() {
    const config = useMemo(() => [
        { title: 'CPF dos responsáveis', Component: ResponsibleCpf },
        { title: 'Cartão do CNPJ', Component: CnpjCard },
        { title: 'Atas de eleição e posse', Component: ElectionRecord },
        { title: 'Procuração', Component: Procuration },
        { title: 'Estatuto social', Component: SocialStatus },
        { title: 'Regimento interno ou estatuto da instituição', Component: InternalRules },
        { title: 'Escritura pública', Component: PublicDeed },
        { title: 'Certidão de débito', Component: DebitCertificate },
        { title: 'FGTS', Component: FGTS },
        { title: 'Accounting', Component: Accounting },
    ], [])

    return (
        <>
            <h1>Arquivos da Instituição</h1>
            {config.map((e, i) => (
                <div style={{ marginBottom: 16 }}>
                    <Accordion key={e.title} title={e.title} >
                        <e.Component />
                    </Accordion>
                </div>
            ))}
        </>
    )
}