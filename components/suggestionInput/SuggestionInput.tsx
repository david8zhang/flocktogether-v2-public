import * as React from 'react'
import { Input } from '../input/Input'
import styles from './SuggestionInput.module.css'

interface Props {
  placeholder: string
  onChange: Function
  value: string
  inputStyle?: any
  wrapperStyle?: any
  suggestionListStyle?: any
  showLoading?: boolean
  suggestions: any[]
  renderSuggestionComp: Function
}

const SuggestionInput: React.FC<Props> = ({
  placeholder,
  onChange,
  value,
  inputStyle,
  wrapperStyle,
  suggestionListStyle,
  suggestions,
  renderSuggestionComp,
  showLoading,
}) => {
  return (
    <div style={wrapperStyle} className={styles.suggestionInput}>
      <Input
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        style={inputStyle}
      />
      {suggestions && suggestions.length > 0 ? (
        <div
          style={suggestionListStyle}
          className={styles['suggestionInput__suggestionList']}
        >
          {suggestions.map((s) => {
            return renderSuggestionComp(s)
          })}
        </div>
      ) : (
        showLoading && (
          <div className={styles['suggestionInput__suggestionList']}>
            <p className={styles['suggestionInput__loadingText']}>Loading...</p>
          </div>
        )
      )}
    </div>
  )
}

export default SuggestionInput
