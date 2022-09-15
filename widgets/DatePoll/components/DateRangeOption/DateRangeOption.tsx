import * as React from 'react'
import moment from 'moment'
import styles from './DateRangeOption.module.css'
import { IconButton } from '@material-ui/core'
import {
  CheckBoxOutlineBlank,
  MoreVert,
  CheckBoxOutlined,
} from '@material-ui/icons'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  dateRange: {
    startDate: any
    endDate: any
    votes?: string[]
  }
  onVote: Function
  hasVoted?: boolean
}

const DateRangeOption: React.FC<Props> = ({ dateRange, onVote, hasVoted }) => {
  const { isMobile } = useMobileDetector()
  const { startDate, endDate, votes } = dateRange
  const format = 'MMM Do, YYYY'
  const formattedDate = `${startDate.format(format)} - ${endDate.format(
    format
  )}`
  const duration = Math.round(
    moment.duration(endDate.diff(startDate)).asDays() + 1
  )
  const dayRange = `${startDate.format('ddd')} - ${endDate.format('ddd')}`
  let isWeekend = false
  if (dayRange === 'Fri - Sun' || dayRange === 'Sat - Sun') {
    isWeekend = true
  }

  return (
    <div className={styles[`dateRangeOption${isMobile ? '_mobile' : ''}`]}>
      <div
        style={{ marginRight: isMobile ? '2px' : '' }}
        className={styles.dateRangeOption__voteButton}
      >
        <IconButton
          style={{ padding: isMobile ? '8px' : '' }}
          onClick={() => onVote(dateRange)}
        >
          {hasVoted ? (
            <CheckBoxOutlined style={{ fontSize: isMobile ? '14px' : '' }} />
          ) : (
            <CheckBoxOutlineBlank
              style={{ fontSize: isMobile ? '14px' : '' }}
            />
          )}
        </IconButton>
      </div>
      <div className={styles.dateRangeOption__left}>
        <p
          style={{
            fontSize: isMobile ? '14px' : '',
            marginBottom: isMobile ? '5px' : '',
          }}
          className={styles.dateRangeOption__dateText}
        >
          {formattedDate}
        </p>
        <div className={styles.dateRangeOption__dateInfo}>
          <p
            style={{ fontSize: isMobile ? '12px' : '' }}
            className={styles.dateRangeOption__dateInfoTag}
          >
            {duration} Days
          </p>
          <p
            style={{ fontSize: isMobile ? '12px' : '' }}
            className={styles.dateRangeOption__dateInfoTag}
          >
            {dayRange}
          </p>
          {!isMobile && isWeekend && (
            <p className={styles.dateRangeOption__dateInfoTag}>Weekend</p>
          )}
        </div>
      </div>
      <div
        style={{ marginRight: isMobile ? '5px' : '' }}
        className={styles.dateRangeOption__numVoteWrapper}
      >
        <p
          style={{ fontSize: isMobile ? '18px' : '' }}
          className={styles.dateRangeOption__numVoteText}
        >
          {votes ? votes.length : 0}
        </p>
        <p
          style={{ fontSize: isMobile ? '12px' : '' }}
          className={styles.dateRangeOption__numVoteLabel}
        >
          Votes
        </p>
      </div>
      {!isMobile && (
        <IconButton onClick={() => {}}>
          <MoreVert />
        </IconButton>
      )}
    </div>
  )
}

export default DateRangeOption
