import * as React from 'react'
import styles from './WidgetPreForm.module.css'
import { Button } from '@material-ui/core'

interface Props {
  questionText: string
  children?: React.ReactNode
  onOpenPoll: Function
}

const WidgetPreForm: React.FC<Props> = ({ questionText, children, onOpenPoll }) => {
  return (
    <div className={styles.widgetPreForm}>
      <p className={styles.widgetPreForm__questionText}>{questionText}</p>
      <div>{children}</div>
      <p>or</p>
      <Button onClick={() => onOpenPoll()} variant='contained' color='primary'>
        Open a poll
      </Button>
    </div>
  )
}

export default WidgetPreForm
