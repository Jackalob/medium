import type { NextPage } from 'next'
import Head from 'next/head'
import Header from 'components/Header'
import Banner from 'components/Banner'
import { sanityClient, urlFor } from 'sanity.js'
import { Post } from 'typings'

interface Props {
  posts: [Post]
}

const Home: NextPage<Props> = ({ posts }) => {
  console.log(posts)
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

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    description,
    mainImage,
    author -> {
      name,
      image
    }
  }`;
  const posts = await sanityClient.fetch(query)
  
  return {
    props: {
      posts
    }  
  }
}