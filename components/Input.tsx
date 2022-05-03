import clsx from 'clsx'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
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
    case 'lg':
      return ['w-full', 'h-10']
    default:
      return []
  }
}

const generateSpacing = ({ size }: generateClassNameTypes) => {
  switch (size) {
    case 'md':
      return ['p-2']
    case 'lg':
      return ['p-4']
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
  className?: string,
  intent?: Intent
  textAlign?: TextAlign
  size?: Size
  readOnly?: boolean
  variant?: Variant
  placeholder?: string
  onKeyDown?: (key: string) => void
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  readOnly,
  className = '',
  intent = 'primary',
  textAlign = 'right',
  size = 'md',
  variant = 'outlined',
  placeholder = 'placeholer',
  onKeyDown
}) => {
  const [innerValue, setInnerValue] = useState(value)

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value)
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleOnKeyDown = (e: any) => {
    if (onKeyDown) {
      onKeyDown(e.key)
    }
  }

  useEffect(() => {
    if(value === '') {
      setInnerValue('')
    }
  }, [value])

  const innerClassName = useMemo(() => generateClassName({ intent, textAlign, size, variant }), [intent, textAlign, size, variant])

  return (
    <input
      value={innerValue}
      onChange={handleOnchange}
      className={clsx(innerClassName, className)}
      readOnly={readOnly}
      placeholder={placeholder}
      onKeyDown={onKeyDown && handleOnKeyDown}
    />
  )
}

export default Input
