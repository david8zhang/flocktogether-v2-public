import moment from 'moment'

/**
 * Format the date poll option start date / end date to string to be sent to backend
 * @param datePollOptions List of date ranges for the date poll
 */
export const formatDatePollOptions = (datePollOptions: any[]): any[] => {
  return datePollOptions.map((datePollOption: any) => {
    return {
      ...datePollOption,
      startDate: datePollOption.startDate.format(),
      endDate: datePollOption.endDate.format(),
    }
  })
}

export const momentifyDatePollOptions = (datePollOptions: any[]): any[] => {
  return datePollOptions.map((datePollOption: any) => {
    return {
      ...datePollOption,
      startDate: moment(datePollOption.startDate),
      endDate: moment(datePollOption.endDate),
    }
  })
}
