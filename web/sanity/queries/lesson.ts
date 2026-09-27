import { defineQuery } from 'next-sanity';

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{
    "courseSlug": slug.current,
    "lessonSlugs": modules[].lessons[]->slug.current
  }
`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $lessonSlug][0]{
    _id,
    title,
    slug,
    videoUrl,
    poster,
    duration,
    freePreview,
    studentCount,
    keyPoints,
    notes,
    proTip,
    resources,
    "course": *[_type == "course" && references(^._id) && slug.current == $courseSlug][0]{
      _id,
      title,
      slug,
      modules[]{
        _key,
        title,
        lessons[]->{ _id, slug }
      }
    }
  }
`);
