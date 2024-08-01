import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FilePreview from "Components/FilePreview";
import FormCheckbox from "Components/FormCheckbox";
import FormFilePicker from "Components/FormFilePicker";
import FormRadio from "Components/FormRadio";
import Table from "Components/Table";
import useControlForm from "hooks/useControlForm";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import DOMICILE_TYPE from "utils/enums/domicile-type";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import findLabel from "utils/enums/helpers/findLabel";
import MARITAL_STATUS from "utils/enums/marital-status";
import NUMBER_ROOMS from "utils/enums/number-rooms";
import PROPERTY_STATUS from "utils/enums/property-status";
import TIME_LIVING_PROPERTY from "utils/enums/time-living-property";
import formatMoney from "utils/format-money";
import { selectionProcessContext } from "../CandidateInfo/context/SelectionProcessContext";
import formatDate from "utils/format-date";
import { BlobProvider } from "@react-pdf/renderer";
import LegalOpinionPdf from "./LegalOpinionPdf";
import legalOpinionSchema from "./schemas/legal-opinion-schema";
import styles from './styles.module.scss';
import Vehicles from "./Vehicle";
import { ReactComponent as Pdf } from 'Assets/icons/PDF.svg'
import Loader from "Components/Loader";
import InputForm from "Components/InputForm";
import removeObjectFileExtension from "utils/remove-file-ext";
export default function LegalOpinion() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const candidate = useMemo(() => data?.candidateInfo, [data])
    const family = useMemo(() => data?.familyMembersInfo, [data])
    const house = useMemo(() => data?.housingInfo, [data])

    const handleBack = () => {
        navigate(-1, { state })
    }
    useEffect(() => {
        if (!state.applicationId) {
            handleBack()
        } else {
            const fetchLegalOpinion = async () => {
                try {
                    setIsLoading(true)
                    const information = await socialAssistantService.getLegalOpinion(state.applicationId)
                    setData(information)
                } catch (err) { }
                setIsLoading(false)
            }
            fetchLegalOpinion()
        }
    }, [state])

    const { control, watch, getValues, trigger, formState: { isValid, errors } } = useControlForm({
        schema: legalOpinionSchema,
        defaultValues: {
            hasAdditional: !!data?.additional,
            additional: null,
            status: null
        },
        initialData: data
    })
    const disease = data?.familyMembersDiseases
    const members = data?.familyMembersInfo
    const { summary: submitData } = useContext(selectionProcessContext)
    const handleSubmit = async () => {
        if (!isValid) {

            trigger()
            return
        }
        try {
            const values = getValues()

            const applicationData = {
                status: values.status,
                parecerAditionalInfo: values.hasAdditional ? values.additional : null
            }
            await socialAssistantService.updateApplication(state?.applicationId, applicationData)
            setData((prev) => ({ ...prev, additional: values.hasAdditional ? values.additional : null }))
            NotificationService.success({ text: 'Parecer salvo' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Processo de seleção'} onClick={handleBack} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 64 }}>
                <h1>Parecer final sobre a inscrição e perfil socioeconômico aferido</h1>
                <div className={styles.content}>

                    <p>
                        Em <strong>{formatDate(data?.application?.createdAt)}</strong>, o(a) candidato(a)
                        <strong>{candidate?.name}</strong>
                        , portador(a) da cédula de identidade RG número
                        <strong>{candidate?.RG}</strong>
                        , órgão emissor
                        <strong>{candidate?.rgIssuingAuthority}</strong>
                        , inscrito(a) no CPF nº
                        <strong>{candidate?.cpf}</strong>
                        , nacionalidade
                        <strong>{candidate?.nationality}</strong>,
                        <strong>{MARITAL_STATUS.find(e => e.value === candidate?.maritalStatus)?.label}</strong>,
                        <strong>{candidate?.profession}</strong>
                        , residente na
                        <strong>{candidate?.address}</strong>
                        , número
                        <strong>{candidate?.addressNumber}</strong>
                        , CEP
                        <strong>{candidate?.CEP}</strong>
                        ,                         <strong>{candidate?.neighborhood}</strong>                        ,
                        <strong>{candidate?.city}/{candidate?.UF}</strong>
                        , com e-mail
                        <strong>{candidate?.email}</strong>
                        , inscreveu-se para participar do processo seletivo de que trata o <strong>{data?.application?.name}</strong> e recebeu o número de inscrição <strong>{data?.application?.number}</strong>.
                    </p>

                    <p>
                        O(A) candidato(a) possui a idade de
                        <strong>{candidate?.age}</strong> anos e reside{' '}
                        {family?.length === 0
                            ? 'sozinho(a)'
                            : <>
                                com:{' '}
                                <strong>
                                    {family?.map(member => `${member.name} (${FAMILY_RELATIONSHIP.find(e => e.value === member.relationship)?.label})`).join(', ')}
                                </strong>
                            </>
                        }
                        .
                    </p>

                    <p>
                        O grupo familiar objeto da análise reside em imóvel
                        <strong>{findLabel(PROPERTY_STATUS, house?.propertyStatus)}</strong>
                        , pelo prazo de
                        <strong>{findLabel(TIME_LIVING_PROPERTY, house?.timeLivingInProperty)}</strong> e a moradia é do
                        tipo
                        <strong>{findLabel(DOMICILE_TYPE, house?.domicileType)}</strong>
                        . Esta moradia possui
                        <strong>{findLabel(NUMBER_ROOMS, house?.numberOfRooms)}</strong> cômodo(s), sendo que
                        <strong>{house?.numberOfBedrooms}</strong> estão servindo permanentemente de dormitório para os moradores deste domicílio.
                    </p>



                    <Vehicles data={data?.vehicleInfoResults} />
                    <div className={styles.table}>

                        <h3>O(s) integrante(s) identificados abaixo fazem uso dos seguintes medicamentos:</h3>
                        <Table.Root headers={['integrante', 'nome do(s) medicamento(s)', 'Obtém medicamento(s) através da rede pública',
                            // 'Relação de medicamentos obtidos através da rede pública'
                        ]}>
                            {
                                data?.familyMemberMedications?.map((item) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell>{item.name}</Table.Cell>
                                            <Table.Cell>{item?.medicationName}</Table.Cell>
                                            <Table.Cell>{item.obtainedPublicly ? 'Sim' : 'Não'}</Table.Cell>
                                            {/* <Table.Cell>{item.medications?.[0]?.specificMedicationPublicly}</Table.Cell> */}
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Root>
                    </div>
                    <div className={styles.table}>

                        <h3>Para subsistência do grupo familiar, a renda provêm de:</h3>
                        <Table.Root headers={['nome', 'CPF', 'idade', 'parentesco', 'ocupação', 'renda média aferida']}>
                            {
                                members?.concat([candidate])?.map((member) => {
                                    return (<Table.Row>
                                        <Table.Cell>{member.name}</Table.Cell>
                                        <Table.Cell>{member.cpf}</Table.Cell>
                                        <Table.Cell>{member.age}</Table.Cell>
                                        <Table.Cell>{findLabel(FAMILY_RELATIONSHIP, member.relationship)}</Table.Cell>
                                        <Table.Cell>{member.profession}</Table.Cell>
                                        <Table.Cell>{formatMoney(member.income)}</Table.Cell>
                                    </Table.Row>)
                                })}
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>Total</Table.Cell>
                            <Table.Cell>{formatMoney(data?.totalIncome)}</Table.Cell>
                        </Table.Root>
                    </div>
                    <p>

                        O total de recursos obtidos por cada membro que aufere renda foi somado e dividido pelo total de de pessoas que moram na mesma moradia
                        e o resultado obtido foi {formatMoney(data?.incomePerCapita)}. Desta forma,a renda é compatível com o contido no
                        {!submitData?.partial
                            ? "inciso I do § 1º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, a qual permite a concessão ou renovação da bolsa de estudo integral."
                            : "inciso II do § 1º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, a qual permite a concessão ou renovação da bolsa de estudo parcial, com 50% (cinquenta por cento) de gratuidade."
                        }
                    </p>
                    <p>

                        A soma das despesas apresentadas é {data?.hasGreaterIncome ? "inferior" : "superior"} à renda familiar bruta mensal com base em toda documentação juntada e análise realizada.
                    </p>
                    <p>
                        A faculdade contida no § 2º do art. 19, relacionada a majoração em até 20% (vinte por cento) do teto estabelecido (bolsa de estudo integral),
                        ao se considerar aspectos de natureza social do beneficiário, de sua família ou de ambos, quando consubstanciados em relatório comprobatório
                        devidamente assinado por assistente social com registro no respectivo órgão de classe foi {submitData?.majoracao ? "aplicada" : "não foi aplicada"}.
                    </p>
                    <p>

                        Sobre a majoração de que trata o § 2º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, importante ressaltar:
                    </p>
                    <FilePreview url={data?.majoracao} text={'ver documento de majoração'} />
                    <p>
                        Deseja inserir informações adicionais?
                    </p>

                    <FormCheckbox control={control} name={"hasAdditional"} />
                    {
                        watch("hasAdditional") && (
                            <InputForm label={'informações adicionais'} type="text-area" control={control} name={"additional"} />

                        )
                    }
                    <p>
                        Diante do acima exposto, conclui-se a análise pelo:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <FormRadio control={control} name="status" value={"Approved"} label={"deferimento"} color />
                        <FormRadio control={control} name="status" value={"Rejected"} label={"indeferimento"} color />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>

                    <ButtonBase label={'concluir'} onClick={handleSubmit} />
                    {data?.parecer
                        ? <FilePreview file={data?.file_parecer} url={removeObjectFileExtension(data?.parecer)['url_parecer']} text={'visualizar parecer'} />
                        : <BlobProvider document={
                            <LegalOpinionPdf
                                candidate={candidate}
                                data={data}
                                members={members}
                                disease={disease}
                                house={house}
                                family={family}
                                medications={data?.familyMemberMedications}
                                partial={submitData?.partial}
                                majoracao={submitData?.majoracao}
                            />}
                        >
                            {({ loading, url, blob }) => {

                                return (loading ? 'carregando pdf...' : <ButtonBase onClick={async () => {
                                    const formData = new FormData()
                                    formData.append('file', blob)
                                    try {

                                        await socialAssistantService.sendLegalOpinionDocument(state?.applicationId, formData)
                                        setData((prev) => ({ ...prev, file_parecer: blob }))
                                        NotificationService.success({ text: 'Arquivo enviado para ser assinado. Verifique seu email.' })
                                    } catch (err) {
                                        NotificationService.error({ text: 'Erro ao enviar arquivo para assinar. Tente novamente.' })
                                    }
                                    // window.open(url, '_blank')

                                }} >
                                    <Pdf width={20} height={20} />
                                </ButtonBase>)
                            }}
                        </BlobProvider>}
                </div>
            </div>
        </div >
    )
}