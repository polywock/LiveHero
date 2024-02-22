import React from "react"
import "./Fields.css"

type FieldsProps = {
  children: React.ReactElement[] | React.ReactElement 
}

export const Fields = (props: FieldsProps) => {
  return (
    <div className="Fields">
      {props.children}
    </div>
  )
}