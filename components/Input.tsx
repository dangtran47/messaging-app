import clsx from 'clsx'
import { useMemo, useState } from 'react'
import reduce from 'lodash/fp/reduce'
import concat from 'lodash/fp/concat'


type Intent = 'primary' | 'success'

type TextAlign = 'left' | 'right'

type Size = 'sm' | 'md' | 'lg'

type Variant = 'filled' | 'outlined'

interface generateClassNameTypes {
  textAlign: TextAlign
  intent: Intent
  size: Size
  variant: Variant
}

const borderColor: { [key in Intent]: string } = {
  primary: 'border-primary',
  success: 'border-success',
}

const generateBorder = ({ intent }: generateClassNameTypes) => ['border-2', borderColor[intent], 'rounded-xl']

const textColor: { [key in Intent]: string } = {
  primary: 'text-primary',
  success: 'text-success',
}

const generateText = ({ textAlign, intent }: generateClassNameTypes) => [textAlign === 'left' ? 'text-left' : 'text-right', textColor[intent]]

const generateSizing = ({ size }: generateClassNameTypes) => {
  switch (size) {
    case 'md':
      return ['h-8', 'w-52']
    default:
      return []
  }
}

const generateSpacing = ({ size }: generateClassNameTypes) => {
  switch (size) {
    case 'md':
      return ['p-2']
    default:
      return []
  }
}

const bgColor: { [key in Intent]: string } = {
  primary: 'bg-primary',
  success: 'bg-success',
}

const generateBackground = ({ variant, intent }: generateClassNameTypes) => {
  switch (variant) {
    case 'filled':
      return [bgColor[intent]]
    case 'outlined':
      return [`bg-white`]
    default:
      return []
  }
}

const generateClassName = (parameters: generateClassNameTypes) => clsx(
  reduce((
    classNames: string[], fn: (p: generateClassNameTypes) => string[]) => concat(classNames, fn(parameters)), []
  )([
    generateBackground,
    generateBorder,
    generateText,
    generateSizing,
    generateSpacing,
  ])
)

interface InputProps {
  value: string
  onChange?: (value: string) => void
  intent?: Intent
  textAlign?: TextAlign
  size?: Size
  readOnly?: boolean
  variant?: Variant
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  readOnly,
  intent = 'primary',
  textAlign = 'right',
  size = 'md',
  variant = 'outlined',
}) => {
  const [innerValue, setInnerValue] = useState(value)

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value)
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const className = useMemo(() => generateClassName({ intent, textAlign, size, variant }), [intent, textAlign, size, variant])

  return (
    <input
      value={innerValue}
      onChange={handleOnchange}
      className={className}
      readOnly={readOnly}
    />
  )
}

export default Input
