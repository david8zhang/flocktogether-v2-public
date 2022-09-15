import * as React from 'react'
import styles from '../styles/Trip.module.css'
import { connect } from 'react-redux'
import { InviteFriends, DatePoll, RoadTrip } from '../widgets'
import { AppBarWrapper } from '../components'
import { useRouter } from 'next/router'
import { TripHandler } from '../lib/TripHandler'
import { Button } from '@material-ui/core'
import { useMobileDetector } from '../hooks/useMobileDetector'

const Trip: React.FC<{}> = () => {
  const router = useRouter()
  const { isMobile } = useMobileDetector()
  const { tripId, userId } = router.query
  const [isLoading, setIsLoading] = React.useState(true)
  const [trip, setTrip] = React.useState(null)

  React.useEffect(() => {
    if (tripId) {
      const tripHandler: TripHandler = new TripHandler(tripId as string)
      tripHandler.getTrip().then((trip) => {
        if (trip) {
          setTrip(trip)
        } else {
          setTrip(null)
        }
        setIsLoading(false)
      })
    }
  }, [tripId])

  if (isLoading) {
    return (
      <div className={styles.placeholder}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className={styles.placeholder}>
        <p>Sorry, the trip does not exist or has been deleted</p>
        <Button
          color='primary'
          variant='contained'
          onClick={() => {
            router.push('/')
          }}
        >
          Back to home
        </Button>
      </div>
    )
  }

  const travelGroup = Object.values(trip.travelGroup)
  const planner: any = travelGroup.find((traveler: any) => traveler.isPlanner)
  const isPlanner = userId === planner.userId

  return (
    <AppBarWrapper>
      <div className={styles[`trip${isMobile ? '_mobile' : ''}`]}>
        <div className={styles.trip__tripInfoWrapper}>
          <h1 className={styles.trip__name}>{trip.tripName}</h1>
          <p className={styles.trip__plannerName}>
            Planned by {planner ? planner.name : 'John Doe'}
          </p>
        </div>
        <InviteFriends
          isPlanner={isPlanner}
          tripId={tripId}
          travelGroup={travelGroup}
        />
        <DatePoll isPlanner={isPlanner} tripId={tripId} userId={userId} />
        <RoadTrip
          tripId={tripId as string}
          isPlanner={isPlanner}
          userId={userId}
          travelGroup={travelGroup}
        />
      </div>
    </AppBarWrapper>
  )
}

const mapStateToProps = (state) => {
  return {
    trip: state.trip,
    travelGroup: state.travelGroup,
  }
}

export default connect(mapStateToProps, {})(Trip)
