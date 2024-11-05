import Accordion from "Components/Accordion";
import BackPageTitle from "Components/BackPageTitle";
import Indicator from "Components/Indicator";
import ChartAI from "../CandidateInfo/components/ChartAI";
import { useLocation } from "react-router";
import { useEffect, useMemo, useState } from "react";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import AIService from "services/AI/AIService";
import formatMoney from "utils/format-money";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import findLabel from "utils/enums/helpers/findLabel";

const Body = ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
const Title = ({ text, status }) => {
    return (
        <><h3>{text}</h3> {status && <Indicator />}</>
    )
}
const AnalysisIndicator = ({ analysis }) => (<Indicator status={analysis.status === "INCONCLUSIVE" ? null : true}
    description={analysis.status === "INCONCLUSIVE" ? 'Inconclusiva' : 'Conclusiva'} />)
export default function CandidateAIAnalysis() {
    const { state } = useLocation()
    const applicationId = useMemo(() => state?.applicationId, [state])
    const [data, setData] = useState({
        candidate: null,
        familyMembers: null,
        familyGroupIncome: null
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await AIService.getApplicationAnalysis(applicationId)
                setData(information)
            } catch (err) { }
        }
        fetchData()
    }, [applicationId])
    return (
        <>
            <BackPageTitle path={-1} title={'Análise Cadastraqui'} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <Accordion
                    defaultOpen
                    title={<Title text={'Análise inteligente'} />}>
                    <ChartAI applicationId={applicationId} />
                </Accordion>
                <Accordion
                    title={<Title text={'Dados do candidato'} />}>
                    <Body>
                        <span>
                            Nome: {data.candidate?.name}
                        </span>
                        <span>
                            Inconsistências:
                            <InputBase
                                type="text-area"
                                readOnly
                                disabled
                                value={data.candidate?.analysis?.analysis}
                                style={{ resize: 'none', minHeight: '150px', }}
                                error={null}
                            />
                        </span>
                    </Body>
                </Accordion>
                <Accordion
                    title={<Title text={'Grupo familiar'} />}>
                    <Body>
                        <Table.Root headers={['nome', 'parentesco', 'idade', 'inconsistências', 'análise']}>
                            {data?.familyMembers?.map(e => (
                                <Table.Row>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{findLabel(FAMILY_RELATIONSHIP, e.relationship)}</Table.Cell>
                                    <Table.Cell>{e.age}</Table.Cell>
                                    <Table.Cell>{e.analysisStatus?.numberOfInconsistences ?? '-'}</Table.Cell>
                                    <Table.Cell>
                                        <AnalysisIndicator analysis={e.analysis.status} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Root>
                    </Body>
                </Accordion>
                <Accordion
                    title={<Title text={'Renda'} />}>
                    <Body>
                        <Table.Root headers={['nome', 'idade', 'parentesco', 'profissão', 'renda média', 'inconsistências', 'análise']}>
                            {data?.familyGroupIncome?.map(e => (

                                <Table.Row style={{ cursor: 'pointer' }}>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.age}</Table.Cell>
                                    <Table.Cell>{findLabel(FAMILY_RELATIONSHIP, e.relationship) ?? e.relationship}</Table.Cell>
                                    <Table.Cell>{e.profession}</Table.Cell>
                                    <Table.Cell>{formatMoney(e.income)}</Table.Cell>
                                    <Table.Cell>{e.analysisStatus?.numberOfInconsistences ?? '-'}</Table.Cell>
                                    <Table.Cell>
                                        <AnalysisIndicator analysis={e.analysis.status} />
                                    </Table.Cell>

                                </Table.Row>
                            ))}
                        </Table.Root>
                    </Body>
                </Accordion>

            </div>

        </>
    )
}