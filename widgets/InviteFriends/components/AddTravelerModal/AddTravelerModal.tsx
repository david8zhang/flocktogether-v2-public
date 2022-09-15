import * as React from 'react'
import styles from './AddTravelerModal.module.css'
import * as Modal from 'react-modal'
import {
  Input,
  CloseIcon,
  SuggestionInput,
  PlaceSuggestion,
} from '../../../../components'
import { Button } from '@material-ui/core'
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
} from '../../../RoadTrip/RoadTrip.utils'
import { debounce } from 'lodash'

interface Props {
  onAddTraveler: Function
  isOpen: boolean
  onClose: Function
}

const AddTravelerModal: React.FC<Props> = ({
  onAddTraveler,
  isOpen,
  onClose,
}) => {
  const [name, setName] = React.useState('')
  const [location, setLocation] = React.useState('')

  //Suggestions state hooks
  const [locationSearchText, setLocationSearchText] = React.useState('')
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestionsLoading, setShowSuggestionsLoading] = React.useState(
    false
  )
  const searchPlaces = (text) => {
    fetchPlaceAutocomplete(text).then((data) => {
      const { predictions } = data
      setSuggestions(predictions)
      setShowSuggestionsLoading(false)
    })
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

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        content: {
          width: '400px',
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
      <div className={styles.addTravelerModalContent}>
        <CloseIcon onClick={onClose} />
        <h1>Add a traveler</h1>
        <Input
          style={{ marginBottom: '10px' }}
          onChange={(name: string) => setName(name)}
          placeholder='Enter your name'
          value={name}
        />
        <SuggestionInput
          wrapperStyle={{ marginBottom: '10px' }}
          inputStyle={{ width: '100%' }}
          onChange={(text: string) => {
            if (!text) {
              setLocation(null)
            }
            setLocationSearchText(text)
            setShowSuggestionsLoading(true)
            debouncedSearchPlaces(text)
          }}
          suggestionListStyle={{
            position: 'unset',
            marginTop: '10px',
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
        <Button
          onClick={() => {
            onAddTraveler({ name, location })
            onClose()
          }}
          variant='contained'
          color='primary'
        >
          Add traveler
        </Button>
      </div>
    </Modal>
  )
}

export default AddTravelerModal
