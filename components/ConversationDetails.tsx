import clsx from 'clsx'
import get from 'lodash/fp/get'
import { ChangeEvent, useEffect, useMemo, useReducer, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import { host } from 'config'
import Input from './Input'
import useSWR from 'swr'

type MessageType = {
  id: string
  text: string
  sender: {
    id: string
    name: string
  }
  createdAt: string
}

const MessageBlock = ({ ownerId, message }: { ownerId: string; message: MessageType }) => {
  const isOwner = get('sender.id')(message) === ownerId
  return (
    <div
      className={clsx(
        'flex items-center gap-1',
        isOwner ? 'self-end text-primary' : 'text-success'
      )}>
      <FaUserCircle size={36} className="order-2" />
      <Input
        value={message.text}
        readOnly
        intent={isOwner ? 'primary' : 'success'}
        textAlign={isOwner ? 'right' : 'left'}
        className={clsx(isOwner ? 'order-1' : 'order-3')}
      />
    </div>
  )
}

const Conversation = ({
  ownerId,
  conversationId,
  className = '',
  isDisplaying = false,
}: {
  ownerId: string
  conversationId: string
  className?: string
  isDisplaying?: boolean
}) => {
  const [inputMessage, changeInputMessage] = useState('')

  const fetcher = (args: any) => fetch(args).then((res) => res.json())

  const [data, setData] = useState<{
    rows: any[]
    cursor_next?: string
    cursor_prev?: string
    sort: string
  }>({
    rows: [],
    sort: 'NEWEST_FIRST',
  })

  const {
    data: newData,
    mutate,
    error,
  } = useSWR(
    data.cursor_next
      ? `${host}/api/account/${ownerId}/conversation/${conversationId}/messages?pageSize=10&cursor=${data.cursor_next}`
      : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  )

  const requestMessages = async (cursor?: string) => {
    let url = `${host}/api/account/${ownerId}/conversation/${conversationId}/messages?pageSize=10`

    if (cursor) {
      url += `&cursor=${cursor}`
    }

    const res = await fetch(url)
    return await res.json()
  }

  const postMessage = async (text: string) => {
    await fetch(`${host}/api/account/${ownerId}/conversation/${conversationId}/messages`, {
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  const updateConversation = async () => {
    const newData = await requestMessages(data.cursor_next)

    mutate({
      rows: [...newData.rows, ...data.rows],
      sort: 'NEWEST_FIRST',
      cursor_next: newData.cursor_next,
      cursor_prev: data.cursor_prev,
    })
  }

  const handlePostMessage = async () => {
    await postMessage(inputMessage)

    changeInputMessage('')
  }

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      handlePostMessage()
    }
  }

  useEffect(() => {
    console.log({ newData })
    if (newData) {
      setData({
        rows: [...newData.rows, ...data.rows],
        cursor_next: newData.cursor_next,
        cursor_prev: data.cursor_prev,
        sort: 'NEWEST_FIRST',
      })
    }
  }, [newData])

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await requestMessages()
      setData(messages)
    }

    fetchMessages()
  }, [])

  /* useEffect(() => {
*   if (data && data.cursor_next) {
*     const updateConversationInterval = setInterval(updateConversation, 50000)
*     return () => clearInterval(updateConversationInterval)
*   }
* }, [data])

* if (!data) {
*   return <div>loading...</div>
* }
 */
  return (
    <div
      className={clsx(
        isDisplaying ? 'block' : 'hidden',
        'border-2 border-gray rounded p-2 min-h-full flex flex-col h-full justify-between',
        className
      )}>
      <div className={'flex flex-col-reverse gap-1'}>
        {data.rows.map((message: MessageType) => (
          <MessageBlock key={`message-${message.id}`} ownerId={ownerId} message={message} />
        ))}
      </div>

      <div>
        <Input
          value={inputMessage}
          onChange={changeInputMessage}
          size="lg"
          placeholder="type your message"
          textAlign="left"
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  )
}

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
