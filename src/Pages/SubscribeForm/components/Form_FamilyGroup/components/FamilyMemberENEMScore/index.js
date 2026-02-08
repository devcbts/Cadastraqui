import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import InputForm from 'Components/InputForm'
import ButtonBase from 'Components/ButtonBase'
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import useControlForm from 'hooks/useControlForm'
import { enemScoreSchema } from 'Pages/SubscribeForm/components/Form_BasicInformation/ENEMScore/schemas/enem-score-schema'
import styles from 'Pages/SubscribeForm/components/Form_BasicInformation/ENEMScore/styles.module.scss'
import CustomFilePicker from 'Components/CustomFilePicker'
import Tooltip from 'Components/Tooltip'
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
import enemService from 'services/enem/enemService'
import { NotificationService } from 'services/notification'
import FormCheckbox from 'Components/FormCheckbox'

const FamilyMemberENEMScore = forwardRef(({ data, viewMode }, ref) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const initial = useMemo(() => data?.enemScore ?? {}, [data?.enemScore])
  const hasInitialEnemScoreRef = useRef(!!(initial && Object.keys(initial).length))
  const { control, setValue, watch } = useControlForm(
    {
      schema: enemScoreSchema,
      defaultValues: {
        hasEnemLastYear: hasInitialEnemScoreRef.current,
        enemScore: {
          linguagens: initial.linguagens ?? '',
          matematica: initial.matematica ?? '',
          humanas: initial.humanas ?? '',
          natureza: initial.natureza ?? '',
          redacao: initial.redacao ?? '',
          examYear: initial.examYear ?? String(new Date().getFullYear() - 1),
        },
      },
      initialData: { enemScore: initial, hasEnemLastYear: hasInitialEnemScoreRef.current },
    },
    ref
  )

  const hasEnemLastYear = watch('hasEnemLastYear')
  const prevHasEnemLastYearRef = useRef(hasEnemLastYear)

  useEffect(() => {
    const prev = prevHasEnemLastYearRef.current
    const current = hasEnemLastYear

    if (prev === current || viewMode) {
      prevHasEnemLastYearRef.current = current
      return
    }

    // falso -> verdadeiro: apenas exibe o formulário
    if (!prev && current) {
      prevHasEnemLastYearRef.current = current
      return
    }

    // verdadeiro -> falso
    if (prev && !current) {
      // se não havia ENEM salvo no backend, apenas limpa localmente
      if (!hasInitialEnemScoreRef.current) {
        setValue('enemScore.linguagens', '')
        setValue('enemScore.matematica', '')
        setValue('enemScore.humanas', '')
        setValue('enemScore.natureza', '')
        setValue('enemScore.redacao', '')
        setValue('enemScore.examYear', '')
        prevHasEnemLastYearRef.current = current
        return
      }

      NotificationService.confirm({
        title: 'Remover nota do ENEM deste membro?',
        text: 'Ao continuar, as notas do ENEM deste membro serão apagadas e não poderão ser recuperadas.',
        confirm: 'Remover',
        cancel: 'Cancelar',
        onConfirm: async () => {
          try {
            await enemService.deleteEnemScore(data?.id)
            setValue('enemScore.linguagens', '')
            setValue('enemScore.matematica', '')
            setValue('enemScore.humanas', '')
            setValue('enemScore.natureza', '')
            setValue('enemScore.redacao', '')
            setValue('enemScore.examYear', '')
            hasInitialEnemScoreRef.current = false
            NotificationService.success({ text: 'Dados do ENEM do membro atualizados.', type: 'toast' })
            prevHasEnemLastYearRef.current = false
          } catch (error) {
            setValue('hasEnemLastYear', true)
            prevHasEnemLastYearRef.current = true
            NotificationService.error({ text: 'Não foi possível remover as notas do ENEM deste membro.', type: 'toast' })
          }
        },
        onCancel: () => {
          setValue('hasEnemLastYear', true)
          prevHasEnemLastYearRef.current = true
        },
      })
      return
    }

    prevHasEnemLastYearRef.current = current
  }, [hasEnemLastYear, viewMode, setValue, data?.id])

  const handleUpload = async (files) => {
    if (!files || !files.length || viewMode) return

    const file = files[0]

    if (!file) return

    if (file.type !== 'application/pdf') {
      NotificationService.error({ text: 'Envie um arquivo PDF do boletim do ENEM.', type: 'toast' })
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      NotificationService.error({ text: 'Tamanho máximo do arquivo é 10MB.', type: 'toast' })
      return
    }

    try {
      setIsAnalyzing(true)
      const result = await enemService.extractFromPdf(file)
      const notas = result?.data?.notas
      if (result && notas) {
        if (notas.linguagens !== undefined) setValue('enemScore.linguagens', notas.linguagens)
        if (notas.matematica !== undefined) setValue('enemScore.matematica', notas.matematica)
        if (notas.humanas !== undefined) setValue('enemScore.humanas', notas.humanas)
        if (notas.natureza !== undefined) setValue('enemScore.natureza', notas.natureza)
        if (notas.redacao !== undefined) setValue('enemScore.redacao', notas.redacao)
        if (notas.examYear !== undefined) setValue('enemScore.examYear', notas.examYear)

        NotificationService.success({ text: 'Notas do ENEM preenchidas a partir do PDF.', type: 'toast' })
      }
    } catch (error) {
      NotificationService.error({ text: 'Não foi possível ler o PDF do ENEM. Verifique o arquivo e tente novamente.', type: 'toast' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className={commonStyles.formcontainer}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <h1 className={commonStyles.title}>Nota do ENEM do membro</h1>
      </div>
      <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>

      <div style={{ marginBottom: '1rem' }}>
        <FormCheckbox
          control={control}
          name={'hasEnemLastYear'}
          label={'Este membro fez o ENEM no último ano?'}
          disabled={viewMode}
        />
      </div>

      {hasEnemLastYear && (
        <>
          <div className={styles.container}>
            <InputForm name={'enemScore.linguagens'} control={control} label={'Linguagens'} type={'number'} />
            <InputForm name={'enemScore.matematica'} control={control} label={'Matemática'} type={'number'} />
            <InputForm name={'enemScore.humanas'} control={control} label={'Ciências Humanas'} type={'number'} />
            <InputForm name={'enemScore.natureza'} control={control} label={'Ciências da Natureza'} type={'number'} />
            <InputForm name={'enemScore.redacao'} control={control} label={'Redação'} type={'number'} />
            <InputForm name={'enemScore.examYear'} control={control} label={'Ano do exame'} type={'number'} />
          </div>
          <Tooltip
            tooltip="Envie o boletim do ENEM em PDF para que o sistema leia automaticamente as notas deste membro e preencha os campos abaixo."
            Icon={Help}
          >
            {!viewMode && (
              <CustomFilePicker onUpload={handleUpload}>
                <ButtonBase type="button" disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analisando PDF...' : 'Enviar boletim ENEM (PDF)'}
                </ButtonBase>
              </CustomFilePicker>
            )}
          </Tooltip>
        </>
      )}
    </div>
  )
})

export default FamilyMemberENEMScore
