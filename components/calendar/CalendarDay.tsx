import * as React from 'react'
import styles from './Calendar.module.css'

interface Props {
  date: any
  currentDate: any
  isHighlighted: boolean
  onDayClicked: Function
  dayStyle?: any
}

const CalendarDay: React.FC<Props> = ({
  date,
  onDayClicked,
  currentDate,
  isHighlighted,
  dayStyle,
}) => {
  const isCurrentDay =
    currentDate.format('MMM D, YYYY') === date.format('MMM D, YYYY')

  let backgroundColor = dayStyle.backgroundColor
  if (isCurrentDay) backgroundColor = '#3f51b5'
  else if (isHighlighted) backgroundColor = '#8493e4'
  return (
    <td
      onClick={() => {
        onDayClicked(date)
      }}
      style={{
        ...dayStyle,
        color: isCurrentDay || isHighlighted ? 'white' : dayStyle.color,
        backgroundColor,
      }}
      className={styles.day}
    >
      {date.format('D')}
    </td>
  )
}

export default CalendarDay
