import clsx from 'clsx'
import { FaUserCircle } from 'react-icons/fa'

const Card = ({
  title = '',
  text = 'Click to start a conversation.',
  isActive = false,
  hover = false,
  onClick = () => {},
}: {
  title?: string
  text?: string
  hover?: boolean
  onClick?: () => void
  isActive?: boolean
}) => {
  return (
    <div
      className={clsx(
        'text-gray flex gap-2 items-start cursor-pointer border-2 rounded w-72 h-16 px-2 py-1.5',
        hover && 'hover:bg-info-200 hover:border-info-300',
        isActive && 'bg-info-200 border-info-300'
      )}
      onClick={onClick}>
      <div>
        <FaUserCircle size={42} />
      </div>

      <div>
        <h4 className="text-lg text-black font-bold">{title}</h4>
        <p className="text-sm text-ellipsis w-52 whitespace-nowrap overflow-hidden">{text}</p>
      </div>
    </div>
  )
}

export default Card
