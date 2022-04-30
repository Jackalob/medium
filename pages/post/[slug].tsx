import React from 'react'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { sanityClient, urlFor } from 'sanity'
import { PostType } from 'typings'
import Header from 'components/Header'

interface Props {
  post: PostType
}

const Post = ({ post }: Props) => {
  return (
    <main>
      <Header />
      <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()!} />
      <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
        <div className='flex items-center space-x-2'>
          <img className='w-10 h-10 rounded-full' src={urlFor(post.author.image).url()!} />
          <p className='font-extralight text-sm'>Blog post by <span className='text-green-600'>{post.author.name}</span> - Public at {new Date(post._createdAt).toLocaleString()}</p>
        </div>
        <div className='mt-10'>
          <PortableText
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            serializers={{
              h1: (props: any) => (
                <h1 className='text-2xl font-bold my-5' {...props} />
              ),
              h2: (props: any) => (
                <h1 className='text-xl font-bold my-5' {...props} />
              ),
              normal: (props: any) => (
                <p className='my-3' {...props} />
              ),
              ul: ({ children }: any) => (
                <ul className='my-4' children={children} />
              ),
              li: ({ children }: any) => (
                <li className='ml-4 list-disc my-2' children={children} />
              ),
              link: ({ href, children }: any) => (
                <a className='text-blue-500 hover:underline' href={href} children={children} />
              ),
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    }
  }`;
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: PostType) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image
    },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true
    ],
    slug,
    description,
    mainImage,
    body
  }`;
  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if (!post) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60 // after 60 seconds, it will update the old cached version
  }
}