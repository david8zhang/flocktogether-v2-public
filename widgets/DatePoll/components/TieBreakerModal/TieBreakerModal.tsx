import * as React from 'react'
import * as Modal from 'react-modal'
import styles from './TieBreakerModal.module.css'
import { Button, IconButton } from '@material-ui/core'
import DateRangeOption from '../DateRangeOption/DateRangeOption'
import { Calendar, CloseIcon } from '../../../../components'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

export interface Props {
  isOpen: boolean
  onConfirmDate: Function
  onClose: Function
  dateRangeOptions: {
    votes: any[]
    startDate: any
    endDate: any
  }[]
}

const TieBreakerModal: React.FC<Props> = ({
  dateRangeOptions,
  isOpen,
  onConfirmDate,
  onClose,
}) => {
  const { isMobile } = useMobileDetector()
  const [confirmedDate, setConfirmedDate] = React.useState(null)
  const maxVotes = dateRangeOptions.reduce((acc: any, curr: any) => {
    return Math.max(acc, curr.votes ? curr.votes.length : 0)
  }, 0)

  const optionsWithMostVotes = dateRangeOptions.filter((d) => {
    return d.votes && d.votes.length === maxVotes
  })

  const formatDates = ({ startDate, endDate }) => {
    return `${startDate.format('MMM D, YYYY')} - ${endDate.format(
      'MMM D, YYYY'
    )}`
  }

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        content: {
          width: isMobile ? '100%' : '800px',
          maxHeight: '100%',
          overflowY: 'scroll',
          top: 'unset',
          right: 'unset',
          left: 'unset',
          bottom: 'unset',
        },
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <CloseIcon onClick={onClose} />
      <h1 style={{ textAlign: 'center' }}>Choose the final dates!</h1>
      <div className={styles.tieBreakerModalContent}>
        <div className={styles.tieBreakerModalContent__dateRangeOptions}>
          <h2>Dates with the most votes</h2>
          <div style={{ padding: '5px' }}>
            {optionsWithMostVotes.map((option, index) => {
              return (
                <DateRangeOption
                  key={`dateRange-${index}`}
                  dateRange={option}
                  onVote={() => setConfirmedDate(option)}
                  hasVoted={
                    confirmedDate &&
                    formatDates(confirmedDate) === formatDates(option)
                  }
                />
              )
            })}
          </div>
        </div>
        <h2>Or choose your date range</h2>
        <Calendar
          hideConfirmButton
          tableStyle={{ width: '100%' }}
          cellStyle={{ padding: isMobile ? '5px' : '4%', width: '14%' }}
          highlightedDates={dateRangeOptions}
          onEndDatePicked={(startDate, endDate) => {
            setConfirmedDate({ startDate, endDate })
          }}
        />
        <Button
          style={{ marginTop: '10px' }}
          variant='contained'
          color='primary'
          onClick={() => {
            onConfirmDate(confirmedDate)
          }}
        >
          Choose final date range
        </Button>
      </div>
    </Modal>
  )
}

export default TieBreakerModal
