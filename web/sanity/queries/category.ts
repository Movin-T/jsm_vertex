import { defineQuery } from 'next-sanity'

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    "courses": *[_type == "course" && references(^._id)]{
      _id, title, slug, coverImage, level, studentCount
    }
  }
`)
