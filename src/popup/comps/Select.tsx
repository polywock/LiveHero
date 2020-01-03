import React, { useState, useEffect, useRef } from 'react'
import { Triangle } from "./Triangle"
import "./Select.scss"


type SelectProps = {
  value: string,
  options: string[] | {
    name: string,
    value: string
  }[],
  onChange: (newValue: string) => any
}

export const Select = (props: SelectProps) => {
  const [ open, setOpen ] = useState(false)

  let extOptions: {
    name: string,
    value: string
  }[] = []

  if (props.options.length > 0) {
    if (typeof props.options[0] === "string") {
      for (let value of props.options) {
        extOptions.push(
          {name: value as string, value: value as string}
        )
      }
    } else {
      extOptions = props.options as {
        name: string,
        value: string
      }[]
    }
  }
  
  return (
    <div 
      className="Select" 
      onClick={e => setOpen(!open)} 
      onKeyUp={e => e.key === "Enter" && setOpen(!open)}
      tabIndex={0}>
      <div className="value">{props.value}</div>
      <Triangle/>
      

      {open && (
        <div className="bg" onClick={e => {
          setOpen(false)
          e.stopPropagation()
        }}>
          <div className="fg">
            {extOptions.map((option, i) => (
              <SelectOption key={i} autofocus={i === 0 && true} name={option.name} value={option.value} onSelect={value => {
                props.onChange(value)
                setOpen(false)
              }}/> 
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type SelectOptionProps = {
  value: string,
  name: string,
  onSelect: (newValue: string) => any,
  autofocus?: boolean
}

export const SelectOption = (props: SelectOptionProps, ) => {
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
   props.autofocus && ref.current && ref.current.focus() 
  }, [])


  const handleClick = (e: React.MouseEvent) => {
    props.onSelect(props.value)
    e.stopPropagation()
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.onSelect(props.value)
      e.stopPropagation()
    }
  }

  return (
    <div 
      tabIndex={0} 
      className="SelectOption" 
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      ref={ref}
    >{props.name}</div>
  )
}