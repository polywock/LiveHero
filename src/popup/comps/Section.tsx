import React from "react"
import "./Section.scss"

type SectionProps = {
  label: string,
  children: React.ReactElement,
  initialState: boolean
}

export const Section = (props: SectionProps) => {
  const [ expanded, setExpanded ] = React.useState(props.initialState)
  return (
    <div className="Section">
      <div className="wrapper" style={{marginBottom: expanded ? "15px" : "0px"}}>
        <button onKeyUp={e => {
          if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
            setExpanded(!expanded)
          }
        }} className="control" onClick={e => setExpanded(!expanded)}>{expanded ? "-" : "+"}</button>
        <span className="label">{props.label}</span>
      </div>
      {expanded && props.children}
    </div>
  )
}