import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Input from 'components/Input'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { AppProps } from 'next/dist/shared/lib/router/router'

import { host } from 'config'
import Card from 'components/Card'


const RecycleView = ({ posts }: { posts: any[] }) => {
  const lastRef = useRef(null)

  const callbackFunction = (entries: any) => {
    const [entry] = entries
    console.log(entries)
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    if (lastRef.current) observer.observe(lastRef.current)

    return () => {
      if (lastRef.current) observer.unobserve(lastRef.current)
    }
  }, [lastRef, options]);


  return (
    <div className="flex flex-col gap-2.5 max-h-96 overflow-scroll">
      {posts.map(post =>
        <Input value={post.body} key={post.id} />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${host}/api/accounts`)
  const accounts = await res.json()

  return { props: { accounts } }
}

const Accounts = ({ accounts }: { accounts: Array<{ id: string, name: string }> }) => {
  return (
    <ul className="flex flex-col gap-2">
      {accounts.map((account) =>
        <li key={account.id} >
          <Link href={`account/${account.id}`}>
            <Card title={`Account: ${account.id}`} text={account.name} hover />
          </Link>
        </li>
      )}
    </ul>
  )
}

export default ({ accounts }: AppProps) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Head>
        <title>Messaging App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Accounts accounts={accounts} />
    </div>
  )
}
