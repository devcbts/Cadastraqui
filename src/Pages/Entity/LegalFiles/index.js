import Accordion from "Components/Accordion"
import InputForm from "Components/InputForm"
import React, { useMemo } from "react"
import { z } from "zod"
import CarePlan from "./CarePlan"
import DebitCertificate from "./DebitCertificate"
import DocumentUpload from "./DocumenUpload"
import ElectionRecord from "./ElectionRecord"
import Procuration from "./Procuration"
import YearUpload from "./YearUpload"

export default function EntityLegalFiles() {
    const config = useMemo(() => [
        {
            title: 'CPF dos responsáveis', Component: <DocumentUpload type="RESPONSIBLE_CPF"
                gridOptions={{
                    title: 'last',
                    transform: (x) => {
                        return x.sort((a, b) => a.createdAt > b.createdAt)
                    }
                }}
            />
        },
        {
            title: 'Cartão do CNPJ', Component: <DocumentUpload type="ID_CARD"
                gridOptions={{
                    title: 'CNPJ',
                    columns: 1
                }}
            />
        },
        { title: 'Atas de eleição e posse', Component: ElectionRecord },
        { title: 'Procuração', Component: Procuration },
        {
            title: 'Estatuto social', Component: <DocumentUpload
                type="SOCIAL_STATUS"
                multiple
                gridOptions={{
                    title: 'Arquivo',
                    columns: 4
                }}
            />
        },
        {
            title: 'Regimento interno ou estatuto da instituição', Component: <DocumentUpload
                type="INTERNAL_RULES"
                gridOptions={{
                    title: 'Arquivo',
                    columns: 4
                }}
                multiple
            />
        },
        {
            title: 'Escritura pública', Component: <DocumentUpload
                type="PUBLIC_DEED"
                gridOptions={{
                    title: 'Escritura',
                    columns: 1
                }}

            />
        },
        { title: 'Certidão de débito', Component: DebitCertificate },
        {
            title: 'FGTS', Component: <DocumentUpload type="FGTS"
                add="form"
                gridOptions={{ title: 'Arquivo' }}
                form={{
                    schema: z.object({
                        expireAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        issuedAt: z.string().min(1, 'Obrigatório').date('Data inválida')
                    }),
                    items: [
                        { Component: InputForm, type: 'date', label: 'Certificado emitido em', name: 'expireAt' },
                        { Component: InputForm, type: 'date', label: 'Certificado válido até', name: 'issuedAt' }
                    ]
                }}
            />
        },
        {
            title: 'Documentação contábil', Component: <DocumentUpload type="ACCOUNTING"
                gridOptions={{ year: true }}
            />
        },
        { title: 'Parecer de auditoria', Component: <YearUpload type="AUDIT_OPINION" /> },
        { title: 'Termo(s) de convênio/parceria', Component: <YearUpload type="PARTNERSHIP_TERM" /> },
        { title: 'Relatório de atividade', Component: <YearUpload type="ACTIVITY_REPORT" /> },
        { title: 'Relatório nominal de bolsistas', Component: <YearUpload type="NOMINAL_RELATION" /> },
        { title: 'Relação nominal tipo I', Component: <YearUpload type="NOMINAL_RELATION_TYPE_ONE" /> },
        { title: 'Relação nominal tipo II', Component: <YearUpload type="NOMINAL_RELATION_TYPE_TWO" /> },
        { title: 'Declaração de análise do perfil socioeconômico', Component: <YearUpload type="PROFILE_ANALYSIS" /> },
        { title: 'Plano de atendimento na área da educação', Component: <CarePlan /> },
        { title: 'Identificação do corpo dirigente da instituição de ensino', Component: <YearUpload type="GOVERNING_BODY" /> },
        {
            title: 'Requerimento - Certificado de entidade beneficente de assistência social', Component: <DocumentUpload type="CHARITABLE_CERTIFICATE"
                gridOptions={{
                    title: 'Requerimento',
                    columns: 1
                }}
            />
        },
        {
            title: 'Declaração de cumprimentos de requisitos', Component: <DocumentUpload type="REQUIREMENTS_DECLARATION" gridOptions={{
                title: 'Declaração',
                columns: 1
            }} />
        },
        { title: 'Relatório de monitoramento', Component: <YearUpload type="MONITORING_REPORT" /> },
    ], [])

    return (
        <>
            <h1>Arquivos da Instituição</h1>
            {config.map((e, i) => (
                <div style={{ marginBottom: 16 }}>
                    <Accordion key={e.title} title={e.title} >
                        {React.isValidElement(e.Component) ? e.Component : <e.Component />}
                    </Accordion>
                </div>
            ))}
        </>
    )
}