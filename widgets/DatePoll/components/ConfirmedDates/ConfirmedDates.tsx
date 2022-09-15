import * as React from 'react'
import styles from './ConfirmedDates.module.css'
import { LinkText } from '../../../../components'
import WidgetConfirmedHeader from '../../../widgetConfirmedHeader/WidgetConfirmedHeader'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  isPlanner: boolean
  dateRange: {
    startDate: any
    endDate: any
  }
  onReopenPolling: Function
}

const ConfirmedDates: React.FC<Props> = ({
  dateRange,
  onReopenPolling,
  isPlanner,
}) => {
  const { isMobile } = useMobileDetector()
  const { startDate, endDate } = dateRange
  const format = 'dddd, MMMM Do, YYYY'
  const startDateFormatted = startDate.format(format)
  const endDateFormatted = endDate.format(format)
  return (
    <div className={styles.confirmedDates}>
      <WidgetConfirmedHeader
        question='When are we going?'
        rightHeader={
          isPlanner && (
            <LinkText
              style={{ marginTop: isMobile ? '0px' : '' }}
              text='Choose different dates'
              onClick={() => onReopenPolling()}
            />
          )
        }
      >
        {startDateFormatted} - {endDateFormatted}
      </WidgetConfirmedHeader>
    </div>
  )
}

export default ConfirmedDates
