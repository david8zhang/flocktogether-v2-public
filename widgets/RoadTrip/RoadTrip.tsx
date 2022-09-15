import * as React from 'react'
import styles from './RoadTrip.module.css'
import WidgetBox from '../widgetBox/WidgetBox'
import WidgetPreForm from '../widgetPreForm/WidgetPreForm'
import GoogleMapReact from 'google-map-react'
import WidgetHeader from '../widgetHeader/WidgetHeader'
import { LinkText, SuggestionInput, PlaceSuggestion } from '../../components'
import { IconButton, Tooltip, Avatar } from '@material-ui/core'
import { debounce } from 'lodash'
import {
  GOOGLE_API_KEY,
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
  getCurrentTraveler,
} from './RoadTrip.utils'
import { ConfirmedDestination, Marker, DestinationPoll } from './components'
import { Close, Check } from '@material-ui/icons'
import { TripHandler } from '../../lib/TripHandler'
import { useMobileDetector } from '../../hooks/useMobileDetector'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'

interface Props {
  tripId: string
  userId: string | string[]
  travelGroup: any
  isPlanner: boolean
}

const defaultMapCenter = {
  lat: 34.1501,
  lng: -118.3632,
}

const RoadTrip: React.FC<Props> = ({
  isPlanner,
  travelGroup,
  userId,
  tripId,
}) => {
  const tripHandler: TripHandler = new TripHandler(tripId)
  const currTraveler = getCurrentTraveler(travelGroup, userId)

  // Mobile Responsiveness hooks
  const { isMobile } = useMobileDetector()
  const { screenDims } = useScreenDimensions()

  // Polling
  const [isPolling, setIsPolling] = React.useState(false)
  const [pollOptions, setPollOptions] = React.useState([])

  // Search places
  const [searchPlaceText, setSearchPlaceText] = React.useState('')
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestionsLoading, setShowSuggestionsLoading] = React.useState(
    false
  )

  // Confirming a destination
  const [confirmedDestination, setConfirmedDestination] = React.useState(null)
  const [destinationPin, setDestinationPin] = React.useState(null)

  // Map centering
  let currLocation = currTraveler
    ? currTraveler.location.geometry.location
    : null || defaultMapCenter
  const [center, setCenter] = React.useState(currLocation)

  React.useEffect(() => {
    tripHandler.getTrip().then((trip) => {
      if (trip.destination) {
        setConfirmedDestination(trip.destination)
      }
      if (trip.destOptions) {
        setPollOptions(trip.destOptions)
      }
      setIsPolling(trip.isDestPolling)
    })
  }, [])

  const searchPlaces = (text) => {
    fetchPlaceAutocomplete(text, currLocation).then((data) => {
      const { predictions } = data
      setSuggestions(predictions)
      setShowSuggestionsLoading(false)
    })
  }

  const confirmDestination = (dest: any) => {
    tripHandler.closeDestPoll().then(() => {
      tripHandler.setDestination(dest).then(() => {
        setIsPolling(false)
        setDestinationPin(null)
        setPollOptions([])
        setConfirmedDestination(dest)
      })
    })
  }

  const markDestToConfirm = (place) => {
    fetchPlaceDetails(place.place_id).then((data) => {
      if (data.result) {
        const { name, formatted_address, geometry } = data.result
        setIsPolling(false)
        setSearchPlaceText('')
        setSuggestions([])
        setDestinationPin({ ...geometry.location, name, formatted_address })
        setCenter({ ...geometry.location })
      }
    })
  }

  const openPoll = () => {
    tripHandler.openDestPoll().then(() => {
      setConfirmedDestination(null)
      setIsPolling(true)
    })
  }

  const closePoll = () => {
    tripHandler.closeDestPoll().then(() => {
      setConfirmedDestination(null)
      setIsPolling(false)
    })
  }

  const debouncedSearchPlaces = React.useCallback(
    debounce((text) => searchPlaces(text), 100),
    []
  )

  if (confirmedDestination) {
    return (
      <WidgetBox>
        <ConfirmedDestination
          isPlanner={isPlanner}
          onChooseDest={() => {
            closePoll()
          }}
          confirmedDestination={confirmedDestination}
        />
      </WidgetBox>
    )
  }

  if (!isPlanner && !isPolling) {
    return <div />
  }

  const renderInputOrSelectedDestination = () => {
    if (destinationPin) {
      return (
        <div className={styles.selectedDestWrapper}>
          <div className={styles.selectedDestWrapper__text}>
            <p className={styles.selectedDestWrapper__name}>
              {destinationPin.name}
            </p>
            <p className={styles.selectedDestWrapper__address}>
              {destinationPin.formatted_address}
            </p>
          </div>
          <IconButton
            onClick={() => {
              confirmDestination(destinationPin)
            }}
          >
            <Check />
          </IconButton>
          <IconButton onClick={() => setDestinationPin(null)}>
            <Close />
          </IconButton>
        </div>
      )
    }
    return (
      <SuggestionInput
        wrapperStyle={{ marginBottom: '20px', width: '100%' }}
        inputStyle={{ width: '100%' }}
        onChange={(text: string) => {
          setSearchPlaceText(text)
          setShowSuggestionsLoading(true)
          debouncedSearchPlaces(text)
        }}
        value={searchPlaceText}
        placeholder='Type a destination here'
        suggestions={suggestions}
        showLoading={showSuggestionsLoading}
        renderSuggestionComp={(s) => {
          return (
            <PlaceSuggestion
              key={s.place_id}
              name={s.description}
              onClick={() => {
                markDestToConfirm(s)
              }}
            />
          )
        }}
      />
    )
  }

  const mapStyle = {
    width: isMobile ? screenDims.width * 0.75 : '500px',
    height: isMobile ? screenDims.width * 0.75 : '500px',
  }

  return (
    <WidgetBox>
      {isPolling ? (
        <div>
          <div
            className={styles[`roadTrip__header${isMobile ? '_mobile' : ''}`]}
          >
            <WidgetHeader
              style={{ flex: 1 }}
              questionText={'Poll: Where should we go?'}
              description='Search a destination and add it to the poll below, or vote for an existing option!'
            />
            {isPlanner && (
              <LinkText
                style={{ marginRight: '10px' }}
                text='Enter your destination'
                onClick={() => {
                  closePoll()
                }}
              />
            )}
          </div>
          <DestinationPoll
            isPlanner={isPlanner}
            pollOptions={pollOptions}
            setPollOptions={setPollOptions}
            travelGroup={travelGroup}
            userId={userId}
            userLocation={currLocation}
            tripHandler={tripHandler}
            onConfirmDestination={(dest) => {
              confirmDestination(dest)
            }}
          />
        </div>
      ) : (
        <WidgetPreForm
          questionText={
            destinationPin
              ? 'Confirm your destination?'
              : 'Where are you going?'
          }
          onOpenPoll={() => {
            openPoll()
          }}
        >
          {renderInputOrSelectedDestination()}
          <div style={mapStyle}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
              defaultCenter={defaultMapCenter}
              center={center}
              zoom={10}
            >
              {destinationPin && (
                <Marker
                  lat={destinationPin.lat}
                  lng={destinationPin.lng}
                  onClick={() => {
                    console.log('Hello!')
                  }}
                />
              )}
              {travelGroup.map((t) => {
                const { location } = t
                return (
                  <Marker
                    key={`${t.userId}-marker`}
                    lat={location.geometry.location.lat}
                    lng={location.geometry.location.lng}
                    onClick={() => {}}
                  >
                    <Tooltip style={{ marginTop: '0px' }} title={t.name} arrow>
                      <Avatar
                        style={{
                          backgroundColor: 'darkslateblue',
                          transform: 'translate(-50%, -50%)',
                          width: '35px',
                          height: '35px',
                          fontSize: '15px',
                        }}
                      >
                        {t.name.split('')[0]}
                      </Avatar>
                    </Tooltip>
                  </Marker>
                )
              })}
            </GoogleMapReact>
          </div>
        </WidgetPreForm>
      )}
    </WidgetBox>
  )
}

export default RoadTrip
