import BackPageTitle from "Components/BackPageTitle";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { NotificationService } from "services/notification";
import CardsRow from "./components/CardRow";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
export default function AssistantManagerSelectedCourse() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (!courseId) {
            NotificationService.error({ text: 'Curso não encontrado' }).then(() => navigate(-1))
        }
    }, [courseId])
    return (
        <>
            <BackPageTitle title={'Gerencial Administrativo'} path={-1} />
            <div style={{ padding: '32px 24px 0px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ flexBasis: '30%' }}>Instituição: {'nome aqui'}</label>
                    <label style={{ flexBasis: '30%' }}>Vagas: {'4'}</label>
                    <label style={{ flexBasis: '30%' }}>Inscritos: {'200'}</label>
                    <label style={{ flexBasis: '100%' }}>Endereço: {'Rua bairro avenida teste, itajubá-MG. número 123'}</label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <CardsRow
                        title={'Visão quantitativa - Fase inicial do processo seletivo'}
                        cards={[
                            { desc: 'Vagas', value: '1' },
                            { desc: 'Candidatos', value: '145' },
                            { desc: 'Para análise Ass. Social', value: '1' },
                            { desc: 'Fila de Espera', value: '1' },
                        ]}
                    />
                    <CardsRow
                        title={'Visão quantitativa - Análise do perfil sócio econômico'}
                        cards={[
                            { desc: 'Aguardando Entrevista', value: '1' },
                            { desc: 'Aguardando visita domiciliar', value: '145' },
                            { desc: 'Solicitado novos docs.', value: '1' },
                            { desc: 'Em análise pela Ass.Social ', value: '1' },
                        ]}
                    />
                    <CardsRow
                        title={'Visão quantitativa - Conclusão do processo seletivo'}
                        cards={[
                            { desc: 'Deferidos', value: '1' },
                            { desc: 'Indeferidos', value: '145' },
                            { desc: 'Fila de Espera', value: '1' },
                        ]}
                    />

                </div>
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20%' }}>
                    <ButtonBase >
                        <Excel height={30} width={30} />
                    </ButtonBase>
                    <ButtonBase >
                        <PDF height={30} width={30} />
                    </ButtonBase>
                </div>
            </div>
        </>
    )
}