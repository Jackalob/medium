import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from 'sanity.js'
import { PostType } from 'typings'
import Header from 'components/Header'
import Banner from 'components/Banner'

interface Props {
  posts: [PostType]
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'> 
        {posts.map(post =>(
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border rounded-lg overflow-hidden'>
              <img
                className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-150 ease-in-out'
                src={urlFor(post.mainImage).url()!}
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>{post.description} by {post.author.name}</p>
                </div>
                <img
                  className="h-12 w-12 rounded-full ml-2"
                  src={urlFor(post.author.image).url()!}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
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