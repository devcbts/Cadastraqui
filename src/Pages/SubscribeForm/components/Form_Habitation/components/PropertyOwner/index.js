import Overlay from 'Components/Overlay';
import Portal from 'Components/Portal';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import styles from './styles.module.scss'
import ButtonBase from 'Components/ButtonBase';
import InputForm from 'Components/InputForm';
import useControlForm from 'hooks/useControlForm';
import FormSelect from 'Components/FormSelect';
import STATES from 'utils/enums/states';
import MARITAL_STATUS from 'utils/enums/marital-status';
import { formatCPF } from 'utils/format-cpf';
import AddressData from 'Pages/SubscribeForm/components/AddressData';
import React, { useEffect, useRef, useState } from 'react';
import propertyOwnerSchema from './schemas/property-owner-schema';
import ReactPDF, { BlobProvider, Document, Page, PDFDownloadLink, Text, usePDF, View } from '@react-pdf/renderer';
import HabitationDeclarationPDF from '../../../Form_Declarations/components/HabitationDeclarationPDF';
export default function PropertyOwner({ show, onClose, pdf, onSendToEmail = null, ownerLabel }) {
    const ownerRef = useRef(null)
    const [pdfState, setPdfState] = useState(null)
    const [pdfData, setPdfData] = useState({})
    const [document, setDocument] = usePDF(pdf(null))
    const { control, watch, reset, getValues } = useControlForm({
        schema: propertyOwnerSchema({ ownerLabel }),
        defaultValues: {
            ownerName: '',
            RG: '',
            documentIssuing: '',
            ufIssuing: '',
            CPF: '',
            nationality: '',
            UF: '',
            maritalStatus: '',
            profession: '',
            email: '',
        }
    }, ownerRef)
    const [addressData, setAddressData] = useState()
    const addressRef = useRef(null)
    const watchState = watch('ufIssuing')
    const watchNaturality = watch('UF')
    const watchMaritalStatus = watch("maritalStatus")
    const handlePDF = async () => {
        try {
            setAddressData(addressRef.current.values())
            window.open(document.url, '_blank')
        } catch (err) {
        }
    }
    const handleGeneratePdf = () => {
        if (!ownerRef.current.validate() || !addressRef.current.validate()) {
            return
        }
        setPdfState('generating')
    }
    const handleClose = () => {
        reset()
        setAddressData(null)
        setPdfState(null)
        setPdfData(null)
        onClose()
    }
    useEffect(() => {
        setDocument(pdf(pdfData))
    }, [pdfData])
    useEffect(() => {
        if (pdfState === 'generating') {
            setPdfData({ ...ownerRef.current?.values(), ...addressRef.current?.values() })
        }
    }, [pdfState])
    const handleSendToEmail = () => {
        const email = getValues("email")
        return onSendToEmail(email, document.blob)
    }
    if (!show) return null
    return (
        <Portal id="habitation">
            <Overlay>
                <div className={[commonStyles.formcontainer, styles.container].join(' ')}>
                    <h1 className={commonStyles.title}>Dados do Proprietário</h1>

                    <div className={styles.form}>
                        <fieldset disabled={pdfState === 'generating'}>
                            <InputForm control={control} name={"ownerName"} label={ownerLabel} />
                            <div className={styles.grid}>
                                <InputForm control={control} name={"RG"} label={'RG'} />
                                <InputForm control={control} name={"documentIssuing"} label={'órgão emissor'} />
                                <FormSelect control={control} name={"ufIssuing"} label={'UF órgão emissor'} value={watchState} options={STATES} />
                                <InputForm control={control} name={"CPF"} label={'CPF'} transform={(e) => formatCPF(e.target.value)} />
                                <InputForm control={control} name={"nationality"} label={'nacionalidade'} />
                                <FormSelect control={control} name={"UF"} label={'naturalidade'} value={watchNaturality} options={STATES} />
                                <FormSelect control={control} name={"maritalStatus"} label={'estado civil'} value={watchMaritalStatus} options={MARITAL_STATUS} />
                                <InputForm control={control} name={"profession"} label={'profissão'} />
                            </div>
                            <InputForm control={control} name={"email"} label={'email'} />
                            <AddressData ref={addressRef} data={addressData} />
                        </fieldset>
                    </div>
                    <div className={commonStyles.actions}>
                        <ButtonBase label={'fechar'} onClick={handleClose} />
                        {
                            pdfState === null
                                ? <ButtonBase label={'gerar pdf'} onClick={handleGeneratePdf} />
                                : (
                                    <>
                                        <ButtonBase label={'alterar'} onClick={() => setPdfState(null)} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                            <ButtonBase label={'baixar'} onClick={() => handlePDF()} />
                                            {onSendToEmail && <ButtonBase label={'enviar por email'} onClick={handleSendToEmail} />}
                                        </div>
                                        {/* <BlobProvider document={document}>
                                            {
                                                ({ url, loading }) => {
                                                    return loading ? 'carregando...' : <ButtonBase label={'baixar'} onClick={() => handlePDF(url)} />
                                                }
                                            }
                                        </BlobProvider> */}
                                    </>
                                )
                        }

                    </div>
                </div>
            </Overlay>
        </Portal>
    )
}