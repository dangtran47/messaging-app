import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'

import { host } from 'config'
import Input from './Input'
import useSWR from 'swr'
import useInfinityScroll from 'hooks/useInfinityScroll'
import { isEmpty } from 'lodash'
import MessageBlock from './MessageBlock'
import { Message } from 'types/api'

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
  const [hasLoadMore, setHasLoadMore] = useState(true)

  const fetcher = (args: any) => fetch(args).then((res) => res.json())
  const { data, mutate, error } = useSWR(
    `${host}/api/account/${ownerId}/conversation/${conversationId}/messages?pageSize=10`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const onLoadMore = async () => {
    if (!hasLoadMore || !data || !data.cursor_prev) {
      return
    }
    const newData = await requestMessages(data.cursor_prev)

    if (isEmpty(newData.rows)) {
      setHasLoadMore(false)
    }

    mutate(
      {
        rows: [...data.rows, ...newData.rows.reverse()],
        sort: 'NEWEST_FIRST',
        cursor_next: data.cursor_next,
        cursor_prev: newData.cursor_next,
      },
      { revalidate: false }
    )
  }

  const { containerRef, loadMoreRef } = useInfinityScroll(onLoadMore)

  const requestMessages = async (cursor: string) => {
    const url = `${host}/api/account/${ownerId}/conversation/${conversationId}/messages?pageSize=10&cursor=${cursor}`
    const res = await fetch(url)
    return await res.json()
  }

  const postMessage = async (text: string) => {
    if (!text) return

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

    mutate(
      {
        rows: [...newData.rows, ...data.rows],
        sort: 'NEWEST_FIRST',
        cursor_next: newData.cursor_next,
        cursor_prev: data.cursor_prev,
      },
      { revalidate: false }
    )
  }

  const handlePostMessage = async () => {
    await postMessage(inputMessage)
    await updateConversation()

    changeInputMessage('')
  }

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      handlePostMessage()
    }
  }

  useEffect(() => {
    if (data && data.cursor_next) {
      const updateConversationInterval = setInterval(updateConversation, 1000)
      return () => clearInterval(updateConversationInterval)
    }
  }, [data])

  if (error) {
    return <div>Opss, something is wrong</div>
  }

  return (
    <div
      className={clsx(
        isDisplaying ? 'block' : 'hidden',
        'border-2 border-gray rounded p-2 min-h-full flex flex-col h-full justify-between',
        className
      )}>
      <div ref={containerRef} className="flex flex-col-reverse gap-1 h-full overflow-y-scroll mb-2">
        {data ? (
          data.rows.map((message: Message) => (
            <MessageBlock key={`message-${message.id}`} ownerId={ownerId} message={message} />
          ))
        ) : (
          <FiLoader />
        )}

        {hasLoadMore && (
          <div className="w-full flex justify-center" ref={loadMoreRef}>
            <FiLoader />
          </div>
        )}
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

export default Conversation
