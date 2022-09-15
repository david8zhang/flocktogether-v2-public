import * as React from 'react'
import styles from './DatePoll.module.css'
import WidgetBox from '../widgetBox/WidgetBox'
import WidgetHeader from '../widgetHeader/WidgetHeader'
import WidgetPreForm from '../widgetPreForm/WidgetPreForm'
import { LinkText, Calendar } from '../../components'
import { ConfirmedDates, DateRangeOption, TieBreakerModal } from './components'
import { Button } from '@material-ui/core'
import { TripHandler } from '../../lib/TripHandler'
import moment from 'moment'
import {
  formatDatePollOptions,
  momentifyDatePollOptions,
} from './DatePoll.utils'
import { useMobileDetector } from '../../hooks/useMobileDetector'

interface Props {
  tripId: string | string[]
  userId: string | string[]
  questionText?: string
  isPlanner: boolean
}

const DatePoll: React.FC<Props> = ({
  questionText,
  tripId,
  userId,
  isPlanner,
}) => {
  const { isMobile } = useMobileDetector()
  const [datePollOptions, setDatePollOptions] = React.useState([])
  const [isTieBreakerModalOpen, setIsTieBreakerModalOpen] = React.useState(
    false
  )
  const [isPolling, setIsPolling] = React.useState(false)
  const [confirmedDates, setConfirmedDates] = React.useState(null)

  const tripHandler: TripHandler = new TripHandler(tripId as string)

  React.useEffect(() => {
    tripHandler.getTrip().then((trip) => {
      setIsPolling(trip.isDatePolling)
      if (trip.datePollOptions) {
        setDatePollOptions(momentifyDatePollOptions(trip.datePollOptions))
      }
      if (trip.dateRange) {
        setConfirmedDates({
          startDate: moment(trip.dateRange.startDate),
          endDate: moment(trip.dateRange.endDate),
        })
      }
    })
  }, [])

  const onVote = (dateRangeOption: any) => {
    const formatDates = (d: { startDate: any; endDate: any }) => {
      const format = 'MMM D, YYYY'
      return `${d.startDate.format(format)} - ${d.endDate.format(format)}`
    }
    const newDatePollOptions = datePollOptions.map((d) => {
      if (formatDates(d) === formatDates(dateRangeOption)) {
        const { votes } = d
        return {
          ...d,
          votes:
            votes && votes.includes(userId)
              ? votes.filter((v) => v !== userId)
              : votes
              ? votes.concat(userId)
              : [userId],
        }
      }
      return d
    })
    tripHandler
      .setDatePollOptions(formatDatePollOptions(newDatePollOptions))
      .then(() => {
        setDatePollOptions(newDatePollOptions)
      })
  }

  const confirmDate = (confirmedDates) => {
    const formattedConfirmedDates = {
      startDate: confirmedDates.startDate.format(),
      endDate: confirmedDates.endDate.format(),
    }
    tripHandler.closeDatePoll().then(() => {
      tripHandler.setDateRange(formattedConfirmedDates).then(() => {
        setConfirmedDates(confirmedDates)
        setDatePollOptions([])
        setIsTieBreakerModalOpen(false)
      })
    })
  }

  const openPolling = () => {
    tripHandler.openDatePoll().then(() => {
      setIsPolling(true)
      setConfirmedDates(null)
    })
  }

  const closePolling = () => {
    tripHandler.closeDatePoll().then(() => {
      setIsPolling(false)
      setDatePollOptions([])
    })
  }

  const chooseDifferentDates = () => {
    tripHandler.setDateRange(null).then(() => {
      setIsPolling(false)
      setConfirmedDates(null)
    })
  }

  const addDatePollOption = (datePollOption) => {
    const newDatePollOptions = datePollOptions.concat(datePollOption)
    tripHandler
      .setDatePollOptions(formatDatePollOptions(newDatePollOptions))
      .then(() => {
        setDatePollOptions(newDatePollOptions)
      })
  }

  if (confirmedDates) {
    return (
      <WidgetBox>
        <ConfirmedDates
          isPlanner={isPlanner}
          dateRange={confirmedDates}
          onReopenPolling={() => {
            chooseDifferentDates()
          }}
        />
      </WidgetBox>
    )
  }

  if (!isPlanner && !isPolling) {
    return <div />
  }

  return (
    <WidgetBox>
      <TieBreakerModal
        isOpen={isTieBreakerModalOpen}
        onConfirmDate={(confirmedDates) => {
          confirmDate(confirmedDates)
        }}
        onClose={() => setIsTieBreakerModalOpen(false)}
        dateRangeOptions={datePollOptions}
      />
      {isPolling ? (
        <div>
          <div
            className={styles[`datePoll__header${isMobile ? '_mobile' : ''}`]}
          >
            <WidgetHeader
              style={{ flex: 1 }}
              questionText={questionText || 'Poll: When should we go?'}
              description='Select your availability on the calendar, or vote for an option below'
            />
            {isPlanner && (
              <LinkText
                style={{
                  marginRight: '10px',
                }}
                text='Enter your dates'
                onClick={() => {
                  closePolling()
                }}
              />
            )}
          </div>
          <div className={styles[`datePoll__body${isMobile ? '_mobile' : ''}`]}>
            <div
              className={
                styles[
                  `datePoll__optionListWrapper${isMobile ? '_mobile' : ''}`
                ]
              }
            >
              <div className={styles.datePoll__optionList}>
                {datePollOptions.map((d: any, index) => {
                  return (
                    <DateRangeOption
                      hasVoted={d.votes && d.votes.includes(userId)}
                      key={`option-${index}`}
                      dateRange={d}
                      onVote={() => {
                        onVote(d)
                      }}
                    />
                  )
                })}
              </div>
              {isPlanner && (
                <Button
                  style={{ width: '100%' }}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setIsTieBreakerModalOpen(true)
                  }}
                >
                  Close Poll
                </Button>
              )}
            </div>
            <div className={styles.datePoll__calendar}>
              <Calendar
                shouldClear={true}
                highlightedDates={datePollOptions.filter(
                  (dr) => dr.votes && dr.votes.length > 0
                )}
                onPickedDateRange={(startDate, endDate) => {
                  addDatePollOption({
                    startDate,
                    endDate,
                    votes: [userId],
                  })
                }}
                tableStyle={{ width: '100%' }}
                cellStyle={{
                  width: '14%',
                  height: '0px',
                  padding: isMobile ? '5px' : '4%',
                  fontSize: isMobile ? '14px' : '',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <WidgetPreForm
          questionText='When are you going?'
          onOpenPoll={() => {
            openPolling()
          }}
        >
          <Calendar
            onPickedDateRange={(startDate, endDate) => {
              confirmDate({ startDate, endDate })
            }}
          />
        </WidgetPreForm>
      )}
    </WidgetBox>
  )
}

export default DatePoll
