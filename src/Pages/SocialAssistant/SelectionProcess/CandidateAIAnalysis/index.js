import Accordion from "Components/Accordion";
import BackPageTitle from "Components/BackPageTitle";
import Indicator from "Components/Indicator";
import ChartAI from "../CandidateInfo/components/ChartAI";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import AIService from "services/AI/AIService";
import formatMoney from "utils/format-money";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import findLabel from "utils/enums/helpers/findLabel";
import DataTable from "Components/DataTable";
import { motion } from 'framer-motion'
import ExpandedAIAnalysis from "./ExpandedAIAnalysis";
import ButtonBase from "Components/ButtonBase";
import formatDate from "utils/format-date";
const Body = ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
const Title = ({ text, linkTo }) => {
    const navigate = useNavigate()
    const { state } = useLocation()
    return (
        <h3 style={{ display: 'flex', gap: '24px', justifyContent: 'space-between', alignItems: 'center', flexGrow: '1' }}>{text}
            {linkTo !== undefined &&
                <ButtonBase label={'Visualizar'} onClick={() => navigate('/ficha-completa', { state: { ...state, step: linkTo } })} />}
        </h3>
    )
}
const AnalysisIndicator = ({ analysis }) => {
    const inconclusiveOrNull = analysis === "INCONCLUSIVE" || !analysis
    return (
        <Indicator status={inconclusiveOrNull ? null : true}
            description={inconclusiveOrNull ? 'Inconclusiva' : 'Conclusiva'} />
    )
}
export default function CandidateAIAnalysis() {
    const { state } = useLocation()
    const applicationId = useMemo(() => state?.applicationId, [state])
    const [data, setData] = useState({
        candidate: null,
        familyMembers: [],
        familyGroupIncome: [],
        familyMembersDeclarations: [],
        date: null,
        incomePerCapita: null,
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
                <h3>Data da análise: {formatDate(data?.date)}</h3>
                <Accordion
                    defaultOpen
                    title={<Title text={'Análise inteligente'} />}>
                    <ChartAI applicationId={applicationId} />
                </Accordion>
                <Accordion
                    title={<Title text={'Dados do candidato'} linkTo={1} />}>
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
                    title={<Title text={'Grupo familiar'} linkTo={2} />}>
                    <Body>
                        <DataTable
                            data={data?.familyMembers}
                            columns={[
                                { accessorKey: 'name', header: 'Nome' },
                                { accessorKey: 'age', header: 'Idade' },
                                { accessorKey: 'relationship', header: 'Parentesco', cell: (info) => findLabel(FAMILY_RELATIONSHIP, info.getValue()) ?? info.getValue() },
                                { header: 'inconsistências', cell: ({ row }) => row.original?.analysisStatus?.numberOfInconsistences },
                                { header: 'análise', cell: ({ row }) => <AnalysisIndicator analysis={row.original?.analysis?.status} /> },
                            ]}
                            expandedContent={(row) => <ExpandedAIAnalysis  >
                                <span>
                                    Inconsistências:
                                    <InputBase
                                        type="text-area"
                                        readOnly
                                        disabled
                                        value={row.original?.analysis?.analysis}
                                        style={{ resize: 'none', minHeight: '150px', }}
                                        error={null}
                                    />
                                </span>
                            </ExpandedAIAnalysis>
                            }
                        />

                    </Body>
                </Accordion>
                <Accordion
                    title={<Title text={'Renda'} linkTo={5} />}>
                    <Body>
                        <h3>Renda per capita: {formatMoney(data?.incomePerCapita)}</h3>
                        <DataTable
                            data={data?.familyGroupIncome}
                            columns={[
                                { accessorKey: 'name', header: 'Nome' },
                                { accessorKey: 'age', header: 'Idade' },
                                { accessorKey: 'relationship', header: 'Parentesco', cell: (info) => findLabel(FAMILY_RELATIONSHIP, info.getValue()) ?? info.getValue() },
                                { accessorKey: 'profession', header: 'profissão' },
                                { accessorKey: 'income', header: 'renda média', cell: (info) => formatMoney(info.getValue()) },
                                { header: 'inconsistências', cell: ({ row }) => row.original?.analysisStatus?.numberOfInconsistences },
                                { header: 'análise', cell: ({ row }) => <AnalysisIndicator analysis={row.original?.analysis?.status} /> },
                            ]}
                            expandedContent={(row) => <ExpandedAIAnalysis  >
                                <span>
                                    Inconsistências:
                                    <InputBase
                                        type="text-area"
                                        readOnly
                                        disabled
                                        value={row.original?.analysis?.analysis}
                                        style={{ resize: 'none', minHeight: '150px', }}
                                        error={null}
                                    />
                                </span>
                            </ExpandedAIAnalysis>
                            }
                        />
                    </Body>
                </Accordion>
                <Accordion
                    title={<Title text={'Declarações'} linkTo={8} />}>
                    <Body>
                        <DataTable
                            data={data?.familyMembersDeclarations}
                            columns={[
                                { accessorKey: 'name', header: 'Nome' },
                                { accessorKey: 'age', header: 'Idade' },
                                { accessorKey: 'relationship', header: 'Parentesco', cell: (info) => findLabel(FAMILY_RELATIONSHIP, info.getValue()) ?? info.getValue() },
                                { header: 'inconsistências', cell: ({ row }) => row.original?.analysisStatus?.numberOfInconsistences ?? 0 },
                                { header: 'análise', cell: ({ row }) => <AnalysisIndicator analysis={row.original?.analysis?.status} /> },
                            ]}
                            expandedContent={(row) => <ExpandedAIAnalysis  >
                                <span>
                                    Inconsistências:
                                    <InputBase
                                        type="text-area"
                                        readOnly
                                        disabled
                                        value={row.original?.analysis?.analysis}
                                        style={{ resize: 'none', minHeight: '150px', }}
                                        error={null}
                                    />
                                </span>
                            </ExpandedAIAnalysis>
                            }
                        />
                    </Body>
                </Accordion>

            </div>

        </>
    )
}