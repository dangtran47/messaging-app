import Conversation from './Conversation'

const ConversationDetails = ({
  ownerId,
  conversations,
  currentConversation,
}: {
  ownerId: string
  conversations: any[]
  currentConversation: string
}) => {
  return (
    <div className="w-full">
      {conversations.map(
        (conversation) =>
          currentConversation === conversation.id && (
            <Conversation
              key={`conversation-${conversation.id}`}
              className={`conversation-${ownerId}`}
              ownerId={ownerId}
              conversationId={conversation.id}
              isDisplaying={currentConversation === conversation.id}
            />
          )
      )}
    </div>
  )
}

export default ConversationDetails
