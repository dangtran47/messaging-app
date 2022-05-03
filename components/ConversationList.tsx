import find from 'lodash/fp/find'
import get from 'lodash/fp/get'
import Card from './Card'

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
}: {
  ownerId: string
  currentConversation: string
  conversations: Array<ConversationType>
  onClick: (id: string) => void
}) => {
  const handleOnClick = (conversationId: string) => {
    onClick(conversationId)
  }

  return (
    <div className="flex flex-col gap-1">
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
  )
}

export default ConversationList
