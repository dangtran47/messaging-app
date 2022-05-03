import { FaUserCircle } from 'react-icons/fa'
import clsx from 'clsx'
import { Message } from 'types/api'
import get from 'lodash/fp/get'

const MessageBlock = ({ ownerId, message }: { ownerId: string; message: Message }) => {
  const isOwner = get('sender.id')(message) === ownerId
  return (
    <div
      className={clsx(
        'flex items-center gap-1',
        isOwner ? 'self-end text-primary' : 'text-success'
      )}>
      <FaUserCircle size={36} className="order-2" />
      <div
        className={clsx(
          'border-2 rounded-xl p-1 max-w-sm text-left',
          isOwner
            ? 'order-1 color-primary border-primary ml-10'
            : 'order-3 color-success border-success mr-10'
        )}>
        {message.text}
      </div>
    </div>
  )
}

export default MessageBlock
