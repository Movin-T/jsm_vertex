import { defineQuery } from 'next-sanity';

export const COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(title asc) {
    _id,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    instructor->{ _id, name, slug, photo },
    category->{ _id, title, slug },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`);

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)].slug.current
`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    learningOutcomes,
    instructor->{ _id, name, slug, photo, expertise, bio },
    category->{ _id, title, slug },
    modules[]{
      _key,
      title,
      summary,
      lessons[]->{ _id, title, slug, duration, freePreview }
    }
  }
`);
