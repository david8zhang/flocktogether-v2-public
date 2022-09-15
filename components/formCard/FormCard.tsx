import * as React from 'react'
import styles from './FormCard.module.css'

interface Props {
  children: React.ReactNode[]
  step: number
  totalSteps: number
  title: string
}

const FormCard: React.FC<Props> = ({ children, step, totalSteps, title }) => {
  return (
    <div className={styles.formCard}>
      <p>
        Step {step} of {totalSteps}
      </p>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default FormCard
