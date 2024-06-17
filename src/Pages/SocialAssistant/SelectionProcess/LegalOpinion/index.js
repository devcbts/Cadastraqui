import BackPageTitle from "Components/BackPageTitle";
import Table from "Components/Table";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import styles from './styles.module.scss'
import Vehicles from "./Vehicle";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import MARITAL_STATUS from "utils/enums/marital-status";
import findLabel from "utils/enums/helpers/findLabel";
import TIME_LIVING_PROPERTY from "utils/enums/time-living-property";
import DOMICILE_TYPE from "utils/enums/domicile-type";
import PROPERTY_STATUS from "utils/enums/property-status";
import NUMBER_ROOMS from "utils/enums/number-rooms";

export default function LegalOpinion() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const candidate = useMemo(() => data?.candidateInfo, [data])
    const family = useMemo(() => data?.familyMembersInfo, [data])
    const house = useMemo(() => data?.housingInfo, [data])
    useEffect(() => {
        if (!state.applicationId) {
            navigate(-1)
        } else {
            const fetchLegalOpinion = async () => {
                try {
                    const information = await socialAssistantService.getLegalOpinion(state.applicationId)
                    setData(information)
                } catch (err) { }
            }
            fetchLegalOpinion()
        }
    }, [state])
    return (
        <div>
            <BackPageTitle title={'processo de seleção'} path={-1} />
            <div>
                <h1>Parecer final sobre a inscrição e perfil socioeconômico aferido</h1>
                <div className={styles.content}>
                    <p>
                        Em 28 de maio de 2024, o(a) candidato(a)
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
                        , Pinheiros,
                        <strong>{candidate?.city}/{candidate?.UF}</strong>
                        , com e-mail
                        <strong>{candidate?.email}</strong>
                        , inscreveu-se para participar do processo seletivo de que trata o Edital XYZ e recebeu o número de inscrição 20241000.
                    </p>

                    <p>
                        O(A) candidato(a) possui a idade de
                        <strong>{candidate?.age}</strong> anos e reside com:
                        <strong>
                            {family?.map(member => `${member.name} (${FAMILY_RELATIONSHIP.find(e => e.value === member.relationship)?.label})`)}
                        </strong>
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
                    <h3>O(s) integrante(s) identificados abaixo fazem uso dos seguintes medicamentos:</h3>
                    <Table.Root headers={['integrante', 'nome do(s) medicamento(s)', 'Obtém medicamento(s) através da rede pública', 'Relação de medicamentos obtidos através da rede pública']}>
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                    </Table.Root>
                    <h3>Para subsistência do grupo familiar, a renda provêm de:</h3>
                    <Table.Root headers={['nome', 'CPF', 'idade', 'parentesco', 'ocupação', 'renda média aferida']}>
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>Total</Table.Cell>
                            <Table.Cell>R$0000</Table.Cell>
                        </Table.Row>
                    </Table.Root>
                    <p>

                        O total de recursos obtidos por cada membro que aufere renda foi somado e dividido pelo total de de pessoas que moram na mesma moradia e o resultado obtido foi R$. x.xxx,xx (xxxxxxxxxxxxxxxxxxx). Desta forma,a renda é compatível com o contido no inciso I do § 1º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, a qual permite a concessão ou renovação da bolsa de estudo integral.
                    </p>
                    <p>

                        A soma das despesas apresentadas é inferior à renda familiar bruta mensal com base em toda documentação juntada e análise realizada.
                    </p>
                    <p>

                        A faculdade contida no § 2º do art. 19, relacionada a majoração em até 20% (vinte por cento) do teto estabelecido (bolsa de estudo integral), ao se considerar aspectos de natureza social do beneficiário, de sua família ou de ambos, quando consubstanciados em relatório comprobatório devidamente assinado por assistente social com registro no respectivo órgão de classe foi aplicada / não foi aplicada.
                    </p>

                    Sobre a majoração de que trata o § 2º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021, importante ressaltar:
                </div>
            </div>
        </div>
    )
}