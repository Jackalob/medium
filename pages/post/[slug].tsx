import React from 'react'
import { GetStaticProps } from 'next'
import { sanityClient, urlFor } from 'sanity'
import Header from 'components/Header'
import { PostType } from 'typings'

interface Props {
  post: PostType
}

const Post = ({ post }: Props) => {
  console.log(post)
  return (
    <main>
      <Header />
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
    }
  }
}