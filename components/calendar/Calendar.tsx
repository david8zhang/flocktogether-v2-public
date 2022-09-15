import * as React from 'react'
import styles from './Calendar.module.css'
import moment from 'moment'
import { Button, IconButton } from '@material-ui/core'
import { Check, ChevronLeft, ChevronRight, Block } from '@material-ui/icons'
import CalendarDay from './CalendarDay'
import { shade } from './utils'
import { useMobileDetector } from '../../hooks/useMobileDetector'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    border?: number
    rules?: string
  }
}

interface Props {
  hideConfirmButton?: boolean
  highlightedDates?: any[]
  cellStyle?: any
  tableStyle?: any
  onPickedDateRange?: Function
  shouldClear?: boolean
  onEndDatePicked?: Function
}

const Calendar: React.FC<Props> = ({
  highlightedDates,
  onPickedDateRange,
  tableStyle,
  cellStyle,
  shouldClear,
  hideConfirmButton,
  onEndDatePicked,
}) => {
  const { isMobile } = useMobileDetector()
  const [dateObject, setDateObject] = React.useState(moment())
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)
  const [selectingStartDate, setSelectingStartDate] = React.useState(false)
  const [selectingEndDate, setSelectingEndDate] = React.useState(false)

  const weekdayShort = moment.weekdaysShort()
  const weekdayShortName = weekdayShort.map((day) => <th key={day}>{day}</th>)

  const getFirstDayOfMonth = (): number => {
    const firstDay = moment(dateObject).startOf('month').format('d')
    return parseInt(firstDay)
  }

  const getDateForDay = (day: number): any => {
    const dateStr = `${dateObject.format('MMM')} ${day}, ${dateObject.format(
      'YYYY'
    )}`
    const date = moment(dateStr, 'MMM D, YYYY')
    return date
  }

  const onDateClicked = (date: any) => {
    if (selectingEndDate) {
      setEndDate(date)
      setSelectingEndDate(false)
      setShowConfirm(true)
      if (onEndDatePicked) {
        onEndDatePicked(startDate, date)
      }
    } else {
      setStartDate(date)
      setShowConfirm(false)
      setSelectingStartDate(false)
      setSelectingEndDate(true)
    }
  }

  let blanks = []
  for (let i = 0; i < getFirstDayOfMonth(); i++) {
    blanks.push(
      <td key={`day-${i}`} style={cellStyle} className={styles.empty}></td>
    )
  }

  let days = []
  const currentDate = moment(new Date(), 'MMM DD, YYYY')
  const numDaysInMonth = dateObject.daysInMonth()
  for (let d = 1; d <= numDaysInMonth; d++) {
    const date = getDateForDay(d)
    let isHighlighted = false
    if (startDate && endDate) {
      isHighlighted = date.isBetween(startDate, endDate, undefined, '[]')
    }
    if (date.isSame(startDate) && selectingEndDate) {
      isHighlighted = true
    }
    const aggregateStyle = { ...cellStyle }
    if (highlightedDates) {
      let overlapCount = 0
      highlightedDates.forEach(({ startDate, endDate, votes }) => {
        if (date.isBetween(startDate, endDate, undefined, '[]')) {
          const totalVotes = highlightedDates.reduce((acc, curr) => {
            return acc + curr.votes.length
          }, 0)
          const darkenCoefficient = -(
            (overlapCount + votes.length) /
            (totalVotes * 1.5)
          )
          const bg = shade('#c6cef9', darkenCoefficient)
          if (darkenCoefficient <= -0.4) {
            aggregateStyle.color = 'white'
          }
          aggregateStyle.backgroundColor = bg
          overlapCount++
        }
      })
    }
    const newDayComponent = (
      <CalendarDay
        onDayClicked={() => onDateClicked(date)}
        key={d}
        isHighlighted={isHighlighted}
        currentDate={currentDate}
        date={date}
        dayStyle={aggregateStyle}
      />
    )
    days.push(newDayComponent)
  }

  const totalSlots = [...blanks, ...days]
  let rows = []
  let currWeek = []
  totalSlots.forEach((day, i) => {
    if (i % 7 !== 0) {
      currWeek.push(day)
    } else {
      rows.push(currWeek)
      currWeek = []
      currWeek.push(day)
    }
    if (i === totalSlots.length - 1) {
      rows.push(currWeek)
    }
  })

  const onNextMonth = () => {
    const newDateObj = dateObject.clone()
    newDateObj.add(1, 'month')
    setDateObject(newDateObj)
  }

  const onPrevMonth = () => {
    const newDateObj = dateObject.clone()
    newDateObj.subtract(1, 'month')
    setDateObject(newDateObj)
  }

  const weeksInMonth = rows.map((row, i) => {
    return <tr key={`week-${i}`}>{row}</tr>
  })

  const currMonth = dateObject.format('MMMM')
  const currYear = dateObject.format('YYYY')

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__monthHeader}>
        <IconButton onClick={() => onPrevMonth()}>
          <ChevronLeft />
        </IconButton>
        <p>
          {currMonth} {currYear}
        </p>
        <IconButton onClick={() => onNextMonth()}>
          <ChevronRight />
        </IconButton>
      </div>
      <div className={styles.calendar__dateRange}>
        <div
          onClick={() => {
            setStartDate(null)
            setShowConfirm(false)
            setSelectingStartDate(true)
            setSelectingEndDate(false)
          }}
          style={{ fontSize: isMobile ? '12px' : '' }}
          className={
            styles[`calendar__date${selectingStartDate ? '--highlighted' : ''}`]
          }
        >
          {startDate ? startDate.format('MMM D, YYYY') : 'Pick a start date'}
        </div>
        <div
          onClick={() => {
            setEndDate(null)
            setShowConfirm(false)
            setSelectingStartDate(false)
            setSelectingEndDate(true)
          }}
          style={{ fontSize: isMobile ? '12px' : '' }}
          className={
            styles[`calendar__date${selectingEndDate ? '--highlighted' : ''}`]
          }
        >
          {endDate ? endDate.format('MMM D, YYYY') : 'Pick an end date'}
        </div>
      </div>
      <table style={tableStyle} cellSpacing={0} border={1} rules='rows'>
        <thead>
          <tr>{weekdayShortName}</tr>
        </thead>
        <tbody>{weeksInMonth}</tbody>
      </table>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {!hideConfirmButton && (
          <Button
            variant='contained'
            onClick={() => {
              onPickedDateRange(startDate, endDate)
              if (shouldClear) {
                setStartDate(null)
                setEndDate(null)
                setShowConfirm(false)
              }
            }}
            color={showConfirm ? 'primary' : 'default'}
            disabled={!showConfirm}
            startIcon={showConfirm ? <Check /> : <Block />}
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  )
}

export default Calendar
