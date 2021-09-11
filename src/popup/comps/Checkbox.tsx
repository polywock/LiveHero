
import "./Checkbox.scss"

type CheckboxProps = {
  checked: boolean,
  onChange: (newValue: boolean) => any
}

export const Checkbox = (props: CheckboxProps) => {
  return (
    <div 
      tabIndex={0}
      className="Checkbox" 
      data-checked={props.checked} 
      onClick={e => props.onChange(!props.checked)}
      onKeyUp={e => {
        if (e.key === "Enter") {
          e.preventDefault()
          e.stopPropagation()
          props.onChange(!props.checked)
        }
      }}
    >
    </div>
  )
}