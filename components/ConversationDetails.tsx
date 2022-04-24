import clsx from "clsx"
import get from 'lodash/fp/get'
import { useEffect, useMemo, useState } from "react"
import { FaUserCircle } from 'react-icons/fa'

import { host } from 'config'
import Input from "./Input"

type MessageType = {
  id: string,
  text: string,
  sender: {
    id: string,
    name: string,
  },
  createdAt: string,
}

const MessageBlock = ({ ownerId, message }: { ownerId: string, message: MessageType }) => {
  const isOwner = get('sender.id')(message) === ownerId
  return (
    <div className={clsx('flex items-center gap-1', isOwner? 'self-end text-primary': 'text-success')}>
      <FaUserCircle size={36} className='order-2' />
      <Input
        value={message.text}
        readOnly
        intent={isOwner? 'primary': 'success'}
        className={clsx(isOwner? 'order-1': 'order-3')}
      />
    </div>
  )
}

const Conversation = (
  {
    ownerId,
    conversationId,
    className = '',
    isDisplaying = false
  }: {
    ownerId: string,
    conversationId: string,
    className?: string,
    isDisplaying?: boolean
  }
) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const getConversation = async () => {
      const res = await fetch(`${host}/api/account/${ownerId}/conversation/${conversationId}/messages`)
      const messages = await res.json()
      setMessages(messages.rows)
    }

    getConversation()
  }, [])

  return (
    <div className={clsx(
      isDisplaying? 'block': 'hidden',
      'border-2 border-gray rounded p-2 min-h-full',
      className
    )}>
      <div className={'flex flex-col gap-1'}>
        {messages.map((message: MessageType) =>
          <MessageBlock ownerId={ownerId} message={message} />
        )}
      </div>
    </div>
  )
}

const ConversationDetails = (
  {
    ownerId,
    conversations,
    currentConversation,
  } : {
    ownerId: string,
    conversations: any[]
    currentConversation: string,
  }
) => {
  return (
    <div className="w-full">
      {conversations.map(conversation => (
        <Conversation
          key={`conversation-${conversation.id}`}
          className={`conversation-${ownerId}`}
          ownerId={ownerId}
          conversationId={conversation.id}
          isDisplaying={currentConversation === conversation.id}
        />
      ))}
    </div>
  )
}

export default ConversationDetails
