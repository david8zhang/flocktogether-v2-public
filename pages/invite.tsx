import * as React from 'react'
import { useRouter } from 'next/router'
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
} from '../widgets/RoadTrip/RoadTrip.utils'
import {
  FormCard,
  SuggestionInput,
  PlaceSuggestion,
  Input,
  AppBarWrapper,
} from '../components'
import { Button } from '@material-ui/core'
import { debounce } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import styles from '../styles/Invite.module.css'

// Redux
import { connect } from 'react-redux'
import * as travelerGroupActions from '../redux/rwidgets/travelGroupWidget'
import { TripHandler } from '../lib/TripHandler'
import { useMobileDetector } from '../hooks/useMobileDetector'

interface Props {
  addTraveler: Function
}

const Invite: React.FC<Props> = ({ addTraveler }) => {
  const router = useRouter()
  const { isMobile } = useMobileDetector()
  const { tripId } = router.query
  const [name, setName] = React.useState('')
  const [location, setLocation] = React.useState(null)
  const [step, setStep] = React.useState(0)

  //Suggestions state hooks
  const [locationSearchText, setLocationSearchText] = React.useState('')
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestionsLoading, setShowSuggestionsLoading] = React.useState(
    false
  )

  const tripHandler: TripHandler = new TripHandler(tripId as string)

  const gotoNextStep = () => {
    setStep(step + 1)
  }

  const gotoTrip = async () => {
    const newUserId = uuidv4()
    const newTraveler = {
      name,
      location,
      isPlanner: false,
      userId: newUserId,
    }
    await tripHandler.addTraveler(newTraveler)
    router.push(`/trip?tripId=${tripId}&userId=${newUserId}`)
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
    <FormCard step={1} totalSteps={2} title="What's your name?">
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
    <FormCard step={2} totalSteps={2} title='Where are you coming from?'>
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
        <Button onClick={gotoTrip} variant='contained' color='primary'>
          Next
        </Button>
      )}
    </FormCard>,
  ]

  return (
    <AppBarWrapper>
      <div className={styles.invite}>{formSteps[step]}</div>
    </AppBarWrapper>
  )
}

export default connect(null, { ...travelerGroupActions })(Invite)
