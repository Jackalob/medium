import type { NextPage } from 'next'
import Head from 'next/head'
import Header from 'components/Header'
import Banner from 'components/Banner'

const Home: NextPage = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
    </div>
  )
}

export default Home
