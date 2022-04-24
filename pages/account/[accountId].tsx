import ConversationDetails from "components/ConversationDetails";
import ConversationList from "components/ConversationList";
import { host } from "config";
import get from 'lodash/fp/get'
import { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { useReducer } from "react";

export const getServerSideProps: GetServerSideProps = async ( context ) => {
  const res = await fetch(`${host}/api/account/${context.query.accountId}/conversations`)
  const conversations = await res.json()
  return { props: { conversations } }
}

const AccountDetails: NextPage<AppProps> = ({ conversations }: AppProps) => {
  const router = useRouter()
  const { accountId } = router.query
  const [currentConversation, changeConversation] = useReducer((_: string, id: string) => id, get('rows.0.id')(conversations))

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex gap-1 w-full max-w-4xl h-full max-h-128">
        <ConversationList
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
    </div>
  )
}

export default AccountDetails
