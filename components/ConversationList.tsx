import find from 'lodash/fp/find'
import get from 'lodash/fp/get'
import { useState } from 'react'
import clsx from 'clsx'
import Card from './Card'
import { FaUserFriends } from 'react-icons/fa'

type ParticipantType = { id: string; name: string }

type ConversationType = {
  id: string
  participants: Array<ParticipantType>
  lastMessage: {
    id: string
    text: string
    sender: {
      id: string
      name: string
    }
    createAt: string
  }
}

const getNonOwner = (ownerId: string, participants: Array<ParticipantType>) =>
  find((participant: ParticipantType) => participant.id !== ownerId)(participants)

const ConversationList = ({
  ownerId,
  conversations,
  onClick,
  currentConversation,
  className = '',
}: {
  ownerId: string
  currentConversation: string
  conversations: Array<ConversationType>
  onClick: (id: string) => void
  className?: string
}) => {
  const [isShowConversationList, setConversationListVisibility] = useState(false)
  const handleOnClick = (conversationId: string) => {
    onClick(conversationId)
    setConversationListVisibility(false)
  }

  return (
    <div>
      <div
        className={clsx(
          !isShowConversationList && 'invisible',
          'flex flex-col gap-1',
          'md:visible absolute bg-white md:relative w-full md:w-fit flex items-center h-full'
        )}>
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            isActive={conversation.id === currentConversation}
            hover
            title={getNonOwner(ownerId, conversation.participants)?.name}
            text={get('lastMessage.text')(conversation)}
            onClick={() => handleOnClick(conversation.id)}
          />
        ))}
      </div>

      {!isShowConversationList && (
        <div
          className="m-2 md:invisible absolute flex items-center align-center cursor-pointer justify-center bg-primary rounded-full text-white w-9 h-9"
          onClick={() => setConversationListVisibility(true)}>
          <FaUserFriends size={24} />
        </div>
      )}
    </div>
  )
}

export default ConversationList
