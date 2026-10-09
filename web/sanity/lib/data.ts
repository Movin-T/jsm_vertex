import 'server-only';

import { sanityFetch } from './fetch';
import { CATEGORY_BY_SLUG_QUERY } from '../queries/category';
import {
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
  COURSES_QUERY,
} from '../queries/course';
import { INSTRUCTOR_BY_SLUG_QUERY } from '../queries/instructor';
import { LESSON_BY_SLUG_QUERY, LESSON_SLUGS_QUERY } from '../queries/lesson';
import type {
  CATEGORY_BY_SLUG_QUERY_RESULT,
  COURSE_BY_SLUG_QUERY_RESULT,
  COURSE_SLUGS_QUERY_RESULT,
  COURSES_QUERY_RESULT,
  INSTRUCTOR_BY_SLUG_QUERY_RESULT,
  LESSON_BY_SLUG_QUERY_RESULT,
  LESSON_SLUGS_QUERY_RESULT,
} from '../../sanity.types';

export function getCourses() {
  return sanityFetch<COURSES_QUERY_RESULT>({
    query: COURSES_QUERY,
    tags: ['course'],
  });
}

export function getCourseSlugs() {
  return sanityFetch<COURSE_SLUGS_QUERY_RESULT>({
    query: COURSE_SLUGS_QUERY,
    tags: ['course'],
  });
}

export function getLessonSlugs() {
  return sanityFetch<LESSON_SLUGS_QUERY_RESULT>({
    query: LESSON_SLUGS_QUERY,
    tags: ['course', 'lesson'],
  });
}

/** Course detail with modules[].lessons[] carrying derived module/lesson numbering (e.g. "5.1"). */
export async function getCourseBySlug(slug: string) {
  const course = await sanityFetch<COURSE_BY_SLUG_QUERY_RESULT>({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`course:${slug}`, 'course'],
  });

  if (!course) return null;

  const modules = (course.modules ?? []).map((module, moduleIndex) => ({
    ...module,
    moduleNumber: moduleIndex + 1,
    lessons: (module.lessons ?? []).map((lesson, lessonIndex) => ({
      ...lesson,
      lessonNumber: `${moduleIndex + 1}.${lessonIndex + 1}`,
    })),
  }));

  return { ...course, modules };
}

/**
 * Lesson detail, resolved through its course by both slugs so routes like
 * /courses/[courseSlug]/lessons/[lessonSlug] can derive module/lesson numbering.
 */
export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const lesson = await sanityFetch<LESSON_BY_SLUG_QUERY_RESULT>({
    query: LESSON_BY_SLUG_QUERY,
    params: { courseSlug, lessonSlug },
    tags: [`lesson:${lessonSlug}`, 'lesson', 'course'],
  });

  if (!lesson || !lesson.course)
    return lesson ? { ...lesson, course: null } : null;

  let moduleNumber: number | undefined;
  let lessonNumber: string | undefined;

  lesson.course.modules?.forEach((module, moduleIndex) => {
    const index =
      module.lessons?.findIndex(
        (entry) => entry?.slug?.current === lessonSlug,
      ) ?? -1;
    if (index >= 0) {
      moduleNumber = moduleIndex + 1;
      lessonNumber = `${moduleIndex + 1}.${index + 1}`;
    }
  });

  const flatLessons = (lesson.course.modules ?? []).flatMap(
    (module) => module.lessons ?? [],
  );
  const currentIndex = flatLessons.findIndex(
    (entry) => entry?.slug?.current === lessonSlug,
  );
  const previousLesson =
    currentIndex > 0 ? (flatLessons[currentIndex - 1] ?? null) : null;
  const nextLesson =
    currentIndex >= 0 ? (flatLessons[currentIndex + 1] ?? null) : null;

  return {
    ...lesson,
    moduleNumber,
    lessonNumber,
    previousLesson,
    nextLesson,
  };
}

export function getInstructorBySlug(slug: string) {
  return sanityFetch<INSTRUCTOR_BY_SLUG_QUERY_RESULT>({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
    tags: [`instructor:${slug}`, 'instructor', 'course'],
  });
}

export function getCategoryBySlug(slug: string) {
  return sanityFetch<CATEGORY_BY_SLUG_QUERY_RESULT>({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    tags: [`category:${slug}`, 'category', 'course'],
  });
}
