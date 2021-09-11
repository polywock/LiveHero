
import React from "react"
import "./Field.scss"


type FieldProps = {
  label: string,
  children: React.ReactElement,
  tooltip?: string
}

export const Field = (props: FieldProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  return (
    <div className="Field">
      <div className="label">
        {props.label}
        {props.tooltip && (
          <span onKeyUp={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              e.stopPropagation()
              setShowTooltip(!showTooltip)
            }
          }} onBlur={e => setShowTooltip(false)} tabIndex={0} className="tooltip" onClick={e => setShowTooltip(true)}>?</span>
        )}
      </div>
      {React.cloneElement(props.children, {className: "control"})}
      {showTooltip && (
        <>
          <div className="tooltip-bg"></div>
          <div className="tooltip-fg">{props.tooltip}</div>
        </>
      )}
    </div>
  )
}

