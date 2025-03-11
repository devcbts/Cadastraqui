import DeclaracaoArt5 from 'Assets/templates/declaracao_art_5.docx'
import Accordion from "Components/Accordion"
import ButtonBase from "Components/ButtonBase"
import InputForm from "Components/InputForm"
import React, { useMemo } from "react"
import { z } from "zod"
import AccreditationAct from './AccreditationAct'
import Announcement from './Announcement'
import Cebas from './Cebas'
import DocumentUpload from "./DocumenUpload"
import InformationRequest from './InformationRequest'
import MonthlyReport from './MonthlyReport'
const link = (url, text) => {
    return (
        <a style={{ color: 'black', textDecoration: 'underline' }} target="_blank" href={url}>
            {text}
        </a>
    )
}
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
        {
            title: 'Atas de eleição e posse', Component: <DocumentUpload
                type="ELECTION_RECORD"
                add="form"
                form={{
                    schema: z.object({
                        start: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        end: z.string().min(1, 'Obrigatório').date('Data inválida'),
                    }),
                    items: [
                        { Component: InputForm, label: 'Início do mandato', name: 'start', type: 'date' },
                        { Component: InputForm, label: 'Término do mandato', name: 'end', type: 'date' },
                    ]
                }}
                gridOptions={{
                    title: 'last'
                }}
            />
        },
        {
            title: 'Procuração', Component: <DocumentUpload
                type="PROCURATION"
                hint="Caso o procurador seja o responsável perante a Receita Federal"
                add="form"
                form={{
                    schema: z.object({
                        start: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        end: z.string().min(1, 'Obrigatório').date('Data inválida'),
                    }),
                    items: [
                        { Component: InputForm, label: 'Data da nomeação e constituição por bastente procurador(a)', name: 'start', type: 'date' },
                        { Component: InputForm, label: 'Validade da procuração', name: 'end', type: 'date' },
                    ]
                }}
                gridOptions={{
                    title: 'last'
                }}
            />
        },
        {
            title: 'Estatuto social', Component: <DocumentUpload
                type="SOCIAL_STATUS"
                hint={
                    <ol style={{ listStyleType: 'lower-alpha' }}>
                        <li>Prever que não percebam seus dirigentes estatutários, conselheiros, associados, instituidores ou benfeitores remuneração, vantagens ou benefícios, direta ou indiretamente, por qualquer forma ou título, em razão das competências, das funções ou das atividades que lhes sejam atribuídas pelos respectivos atos constitutivos;</li>
                        <li>Aplicar suas rendas, seus recursos e eventual superávit integralmente no território nacional, na manutenção e no desenvolvimento de seus objetivos institucionais;</li>
                        <li>Não distribuam a seus conselheiros, associados, instituidores ou benfeitores seus resultados, dividendos, bonificações,
                            participações ou parcelas do seu patrimônio, sob qualquer forma ou pretexto, e, na hipótese de prestação de serviços a terceiros, públicos ou privados,
                            com ou sem cessão de mão de obra, não transfiram a esses terceiros os benefícios relativos à imunidade prevista no {link("https://www.planalto.gov.br/ccivil_03/Constituicao/Constituicao.htm#art195%C2%A77", "§ 7º do art. 195 da Constituição Federal")}; e</li>
                        <li>Prever, em seus atos constitutivos, em caso de dissolução ou extinção, a destinação do eventual patrimônio remanescente a entidades beneficentes certificadas ou a entidades públicas.</li>
                    </ol>

                }
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
        {
            title: 'Certidão de débito', Component: <DocumentUpload
                details={<strong>
                    Certidão negativa ou certidão positiva com efeito de negativa de débitos relativos aos tributos administrados pela
                    Secretaria Especial da Receita Federal do Brasil e pela Procuradoria-Geral da Fazenda Nacional.
                </strong>}
                type="DEBIT_CERTIFICATE"
                add="form"
                form={{
                    schema: z.object({
                        expireAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        issuedAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                    }),
                    items: [
                        { Component: InputForm, label: 'Certidão emitida em', name: 'issuedAt', type: 'date' },
                        { Component: InputForm, label: 'Certidão válida até', name: 'expireAt', type: 'date' },
                    ]
                }}
                gridOptions={{
                    title: 'last'
                }}
            />
        },
        {
            title: 'FGTS', Component: <DocumentUpload type="FGTS"
                details={<strong>
                    Comprovação de regularidade do Fundo de Garantia do Tempo de Serviço (FGTS).
                </strong>}
                add="form"
                gridOptions={{ title: 'Arquivo' }}
                form={{
                    schema: z.object({
                        expireAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        issuedAt: z.string().min(1, 'Obrigatório').date('Data inválida')
                    }),
                    items: [
                        { Component: InputForm, type: 'date', label: 'Certificado emitido em', name: 'issuedAt' },
                        { Component: InputForm, type: 'date', label: 'Certificado válido até', name: 'expireAt' }
                    ]
                }}
            />
        },
        {
            title: 'Documentação contábil', Component: <DocumentUpload type="ACCOUNTING"
                gridOptions={{ year: true }}
                hint={
                    <>
                        <p>
                            Manter escrituração contábil regular que registre as receitas e as despesas, bem como o registro em gratuidade.
                            Se atuar em mais de uma área, deverá manter escrituração contábil regular que registre as receitas e as despesas,
                            bem como o registro em gratuidade, de forma segregada, em consonância com as normas do Conselho Federal de Contabilidade
                            e com a legislação fiscal em vigor.
                        </p>

                        <p>A entidade deverá apresentar:</p>

                        <ol style={{ listStyleType: 'upper-roman' }}>
                            <li>Balanço Patrimonial;</li>
                            <li>Demonstrativo do Resultado do Exercício (DRE), contendo receitas e despesas separadas por área de atuação da entidade, se for o caso. O DRE deve ser elaborado por profissional legalmente habilitado, atendidas as normas do Conselho Federal de Contabilidade;</li>
                            <li>Demonstração das Mutações do Patrimônio Líquido;</li>
                            <li>Demonstração dos Fluxos de Caixa;</li>
                            <li>Notas Explicativas contendo esclarecimento da origem de todas as receitas apresentadas no DRE, elaboradas por profissional legalmente habilitado, atendidas as normas do Conselho Federal de Contabilidade.</li>
                        </ol>
                    </>

                }
            />
        },
        {
            title: 'Parecer de auditoria', Component: <DocumentUpload gridOptions={{ year: true }} type="AUDIT_OPINION"
                hint={
                    <p>
                        Apresentar as demonstrações contábeis e financeiras devidamente auditadas por auditor independente legalmente habilitado nos
                        Conselhos Regionais de Contabilidade, quando a receita bruta anual auferida for superior
                        ao limite fixado pelo {link("https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp123.htm#art3ii.", "inciso II do caput do art. 3º da Lei Complementar nº 123, de 14 de dezembro de 2006.")}
                    </p>
                }
            />
        },
        {
            title: 'Ato de credenciamento / Autorização de funcionamento da Instituição de Ensino ',
            Component: <AccreditationAct />
        },
        {
            title: 'Termos', Component: <DocumentUpload gridOptions={{ year: true }} type="PARTNERSHIP_TERM"
                details={<strong>
                    Termo(s) de convênio/parceria vigente firmado(s) com órgãos ou entidades dos poderes públicos e avaliações periódicas, quando for o caso.
                </strong>}
            />
        },
        {
            title: 'Relatório de atividade', Component: <DocumentUpload gridOptions={{ year: true }} type="ACTIVITY_REPORT"
                hint="Relatório de todas as atividades desempenhadas, incluindo atividades não certificáveis,
         se houver. A entidade deve destacar em seu relatório as atividades desenvolvidas, os seus objetivos, 
         com a identificação clara de cada serviço, programa, projeto ou benefício socioassistencial, a metodologia utilizada, o público alvo atendido, o número de atendidos, 
        sua capacidade de atendimento, os resultados obtidos e recursos humanos envolvidos."
            />
        },
        { title: 'Relatório nominal de bolsistas', Component: <DocumentUpload gridOptions={{ year: true }} type="NOMINAL_RELATION" /> },
        {
            title: 'Relação nominal tipo I', Component: <DocumentUpload gridOptions={{ year: true }} type="NOMINAL_RELATION_TYPE_ONE"
                details={<strong>
                    Relação nominal com identificação precisa dos beneficiários – Tipo 1: Ações de apoio ao aluno bolsista (quando conceder).
                </strong>}
            />
        },
        {
            title: 'Relação nominal tipo II', Component: <DocumentUpload gridOptions={{ year: true }} type="NOMINAL_RELATION_TYPE_TWO"
                details={<strong>
                    Relação nominal com identificação precisa dos beneficiários – Tipo 2: Ações e serviços destinados a alunos e seu grupo familiar (quando conceder).
                </strong>}
            />
        },
        { title: 'Declaração de análise do perfil socioeconômico', Component: <DocumentUpload gridOptions={{ year: true }} type="PROFILE_ANALYSIS" /> },
        {
            title: 'Plano de atendimento na área da educação', Component: <DocumentUpload
                add="form"
                type="CARE_PLAN"
                form={{
                    schema: z.object({
                        expireAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                        issuedAt: z.string().min(1, 'Obrigatório').date('Data inválida'),
                    }),
                    items: [
                        <label>Período de vigência da certificação a ser concedida</label>,
                        { Component: InputForm, label: 'início', name: 'expireAt', type: 'date' },
                        { Component: InputForm, label: 'término', name: 'issuedAt', type: 'date' },

                    ]
                }}
                hint="Apresentar o plano de atendimento na área de educação, para o período pretendido de vigência da certificação a ser concedida. 
                Esse plano deve indicar as bolsas de estudo a serem concedidas, bem como eventuais benefícios, ações e serviços."
            />
        },
        {
            title: 'Identificação do corpo dirigente da instituição de ensino', Component: <DocumentUpload gridOptions={{ year: true }} type="GOVERNING_BODY"
                hint="Encaminhar a relação com identificação dos integrantes do corpo dirigente de cada instituição de ensino vinculada à mantenedora, 
            destacando a experiência acadêmica e administrativa de cada membro.
            A entidade deverá descrever a experiência acadêmica e administrativa dos integrantes do corpo dirigente de cada instituição de ensino 
            (ex: reitor, vice-reitor, diretor da escola, vice-diretor, coordenador administrativo/pedagógico, supervisor, etc)."
            />
        },
        {
            title: 'Requerimento - Certificado de entidade beneficente de assistência social', Component: <DocumentUpload type="CHARITABLE_CERTIFICATE"
                gridOptions={{
                    title: 'Requerimento',
                    columns: 1
                }}
            />
        },
        {
            title: 'Declaração de cumprimento de requisitos', Component: <DocumentUpload type="REQUIREMENTS_DECLARATION" gridOptions={{
                title: 'Declaração',
                columns: 1
            }}
                details={<strong>
                    Declaração de cumprimento dos requisitos listados no inciso II do § 3º do Art. 74 do Decreto 11.791/2023, quando for o caso.
                </strong>}
                hint={
                    <>
                        <strong>Decreto 11.791/2023</strong>
                        <p>Art. 74.  O requerimento de concessão ou de renovação da certificação de entidade que atue na área de assistência social, nos termos do disposto nesta Subseção,
                            deverá ser protocolado junto ao Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome, em sistema de informações próprio, acompanhado:</p>
                        <p>(...)</p>
                        <p>§ 3º  Para ser certificada, a entidade deverá comprovar que, no ano anterior ao do requerimento, cumulativamente:</p>
                        <p>(...)</p>
                        <p>
                            II – remunerou seus dirigentes de modo compatível com o seu resultado financeiro do exercício, observado o disposto no
                            {link("https://www.planalto.gov.br/ccivil_03/LEIS/LCP/Lcp187.htm#art3v", "art. 3º, caput, inciso V")}, e {link("https://www.planalto.gov.br/ccivil_03/LEIS/LCP/Lcp187.htm#art3%C2%A71", "§ 1º")}
                            e {link("https://www.planalto.gov.br/ccivil_03/LEIS/LCP/Lcp187.htm#art3%C2%A72", "§ 2º, da Lei Complementar nº 187, de 2021")}, por meio da apresentação de declaração firmada pelo representante legal da entidade, cuja representação seja devidamente comprovada.
                        </p>
                    </>
                }
            />
        },
        { title: 'Relatório de monitoramento', Component: <DocumentUpload gridOptions={{ year: true }} type="MONITORING_REPORT" /> },
        {
            title: 'Declaração de que trata o inciso I do caput do art. 5º', Component: <DocumentUpload type="ART_5_DECLARATION"
                details={<ButtonBase
                    label={'Baixar modelo e assinar'}
                    onClick={() => {
                        const fileUrl = DeclaracaoArt5;
                        const fileName = 'declaracao_art_5.docx';

                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = fileName;

                        link.click();
                    }}
                />}
            />
        },
        {
            title: 'Documentação de editais',
            Component: <Announcement />
        },
        {
            title: 'Termo de concessão de benefícios - Tipo 1',
            Component: <DocumentUpload
                details={<strong>Termo de concessão de benefícios – Tipo 1: Ações de apoio ao aluno bolsista (quando conceder).</strong>}
                type="BENEFITS_TYPE_ONE"
                multiple
            />
        },
        {
            title: 'Termo de concessão de benefícios - Tipo 2',
            Component: <DocumentUpload
                details={<strong>Termo de concessão de benefícios – Tipo 2: Ações e serviços destinados a alunos e seu grupo familiar (quando conceder).</strong>}
                type="BENEFITS_TYPE_TWO"
                multiple
            />
        },
        {
            title: 'Termo de parceria para atividades e projetos',
            Component: <DocumentUpload
                details={<strong>Termo de parceria para execução de projetos e atividades de educação em tempo
                    integral para alunos de escola pública (quando aplicável)</strong>}
                type="PUBLIC_SCHOLARSHIP_PROJECTS"
                multiple
            />
        },
        {
            title: 'Certificado de Entidade Beneficente de Assistência Social (CEBAS)',
            Component: <Cebas />
        },
        {
            title: 'Relatório mensal de acompanhamento',
            Component: <MonthlyReport />
        },
        {
            title: 'Solicitações de esclarecimentos e informações à entidade interessada',
            Component: <InformationRequest />
        },
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