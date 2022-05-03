import ConversationDetails from 'components/ConversationDetails'
import ConversationList from 'components/ConversationList'
import { host } from 'config'
import get from 'lodash/fp/get'
import { NextPage } from 'next'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import useSWR from 'swr'

const AccountDetails: NextPage<AppProps> = () => {
  const router = useRouter()
  const { accountId } = router.query
  const fetcher = (args: any) => fetch(args).then((res) => res.json())
  const { data: conversations } = useSWR(accountId? `${host}/api/account/${accountId}/conversations`: null, fetcher)
  const [currentConversation, changeConversation] = useState('')

  useEffect(() => {
    if (!currentConversation) {
      changeConversation(get('rows.0.id')(conversations))
    }
  }, [conversations])

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {conversations ? (
        <div className="flex gap-1 w-full max-w-4xl h-full max-h-128">
          <ConversationList
            currentConversation={currentConversation}
            ownerId={accountId as string}
            conversations={conversations.rows}
            onClick={changeConversation}
          />

          <ConversationDetails
            ownerId={accountId as string}
            conversations={conversations.rows}
            currentConversation={currentConversation}
          />
        </div>
      ) : (
        <FiLoader size={52} />
      )}
    </div>
  )
}

export default AccountDetails
