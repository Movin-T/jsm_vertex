import { defineQuery } from 'next-sanity'

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)]{
      _id, title, slug, coverImage, level, studentCount
    }
  }
`)
