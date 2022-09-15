import * as React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Create.module.css'
import {
  AppBarWrapper,
  FormCard,
  Input,
  SuggestionInput,
  PlaceSuggestion,
} from '../components'
import { debounce } from 'lodash'
import { Button } from '@material-ui/core'
import { v4 as uuidv4 } from 'uuid'

// Redux
import { connect } from 'react-redux'
import * as tripActions from '../redux/rwidgets/tripWidget'
import * as travelerGroupActions from '../redux/rwidgets/travelGroupWidget'
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
} from '../widgets/RoadTrip/RoadTrip.utils'
import { TripHandler } from '../lib/TripHandler'
import { useMobileDetector } from '../hooks/useMobileDetector'

const Create: React.FC<{}> = () => {
  const router = useRouter()
  const { isMobile } = useMobileDetector()
  const [name, setName] = React.useState('')
  const [location, setLocation] = React.useState(null)
  const [tripName, setTripName] = React.useState('')
  const [step, setStep] = React.useState(0)

  //Suggestions state hooks
  const [locationSearchText, setLocationSearchText] = React.useState('')
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestionsLoading, setShowSuggestionsLoading] = React.useState(
    false
  )

  let tripHandler: TripHandler

  const gotoNextStep = () => {
    setStep(step + 1)
  }

  const gotoTrip = async () => {
    const newTripId = uuidv4()
    const newUserId = uuidv4()
    tripHandler = new TripHandler(newTripId)
    const newTraveler = {
      name,
      location,
      isPlanner: true,
      userId: newUserId,
    }
    const newTrip = {
      tripName,
      tripId: newTripId,
      travelGroup: {
        [newUserId]: newTraveler,
      },
    }
    await tripHandler.createTrip(newTrip)
    router.push(`/trip?tripId=${newTripId}&userId=${newUserId}`)
  }

  const searchPlaces = (text) => {
    fetchPlaceAutocomplete(text).then((data) => {
      const { predictions } = data
      setSuggestions(predictions)
      setShowSuggestionsLoading(false)
    })
  }

  const inputStyle = {
    marginBottom: '20px',
    width: isMobile ? '100%' : '50%',
  }

  const debouncedSearchPlaces = React.useCallback(
    debounce((text) => searchPlaces(text), 100),
    []
  )

  const updateLocation = (location) => {
    const { place_id } = location
    setSuggestions([])
    setLocationSearchText(location.description)
    fetchPlaceDetails(place_id).then((data) => {
      if (data.result) {
        setLocation({ ...location, ...data.result })
      }
    })
  }

  const formSteps: React.ReactNode[] = [
    <FormCard step={1} totalSteps={3} title="What's your name?">
      <Input
        style={inputStyle}
        placeholder='Enter your name'
        value={name}
        onChange={(name: string) => setName(name)}
      />
      <Button onClick={gotoNextStep} variant='contained' color='primary'>
        Next
      </Button>
    </FormCard>,
    <FormCard step={2} totalSteps={3} title='Where are you coming from?'>
      <SuggestionInput
        wrapperStyle={inputStyle}
        inputStyle={{ width: '100%' }}
        onChange={(text: string) => {
          if (!text) {
            setLocation(null)
          }
          setLocationSearchText(text)
          setShowSuggestionsLoading(true)
          debouncedSearchPlaces(text)
        }}
        value={locationSearchText}
        placeholder='Enter your location...'
        suggestions={suggestions}
        showLoading={showSuggestionsLoading}
        renderSuggestionComp={(s) => {
          return (
            <PlaceSuggestion
              key={s.place_id}
              name={s.description}
              onClick={() => {
                updateLocation(s)
              }}
            />
          )
        }}
      />
      {location && (
        <Button onClick={gotoNextStep} variant='contained' color='primary'>
          Next
        </Button>
      )}
    </FormCard>,
    <FormCard step={3} totalSteps={3} title='Give a name for your trip'>
      <Input
        style={inputStyle}
        placeholder='Weekend getaway'
        value={tripName}
        onChange={(tripName: string) => setTripName(tripName)}
      />
      <Button onClick={gotoTrip} variant='contained' color='primary'>
        Next
      </Button>
    </FormCard>,
  ]

  return (
    <AppBarWrapper>
      <div className={styles.create}>{formSteps[step]}</div>
    </AppBarWrapper>
  )
}

export default connect(null, { ...tripActions, ...travelerGroupActions })(
  Create
)
