import React, { forwardRef } from 'react'
import InputForm from 'Components/InputForm'
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import useControlForm from 'hooks/useControlForm'
import { enemScoreSchema } from './schemas/enem-score-schema'
import styles from './styles.module.scss'

const ENEMScore = forwardRef(({ data, defaultValues = {}, viewMode }, ref) => {
  const initial = data?.enemScore ?? defaultValues?.enemScore ?? {}
  console.log(data)
  const { control } = useControlForm(
    {
      schema: enemScoreSchema,
      defaultValues: {
        enemScore: {
          linguagens: initial.linguagens ?? '',
          matematica: initial.matematica ?? '',
          humanas: initial.humanas ?? '',
          natureza: initial.natureza ?? '',
          redacao: initial.redacao ?? '',
          examYear: initial.examYear ?? '',
        },
      },
      initialData: data,
    },
    ref
  )

  return (
    <div className={commonStyles.formcontainer}>
      <h1 className={commonStyles.title}>Nota do ENEM</h1>
      <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>
      <div className={styles.container}>
        <InputForm name={'enemScore.linguagens'} control={control} label={'Linguagens'} type={'number'} />
        <InputForm name={'enemScore.matematica'} control={control} label={'Matemática'} type={'number'} />
        <InputForm name={'enemScore.humanas'} control={control} label={'Ciências Humanas'} type={'number'} />
        <InputForm name={'enemScore.natureza'} control={control} label={'Ciências da Natureza'} type={'number'} />
        <InputForm name={'enemScore.redacao'} control={control} label={'Redação'} type={'number'} />
        <InputForm name={'enemScore.examYear'} control={control} label={'Ano do exame'} type={'number'} />
      </div>
    </div>
  )
})

export default ENEMScore
