import 'server-only';

import { client } from '../lib/client';
import { urlFor } from '../lib/image';
import type { ModelResult } from './schema';
import type { SearchResponse, SearchResult } from './types';

const LESSONS_QUERY = `
  *[_type == "lesson" && _id in $ids]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    duration,
    keyPoints,
    "image": coalesce(poster, thumbnail),
    "firstBlock": pt::text(notes[_type == "block" && style == "normal"][0]),
    "course": *[_type == "course" && references(^._id) && defined(slug.current)][0]{
      title,
      "slug": slug.current,
      coverImage,
      "modules": modules[]{ title, "lessonIds": lessons[]._ref }
    }
  }
`;

const VIDEO_MOMENT_QUERY = `
  count(*[_type == "video" && url == $url && (
    count(chapters[startSeconds == $seconds]) > 0 ||
    count(chunks[startSeconds == $seconds]) > 0
  )]) > 0
`;

type LessonRow = {
  _id: string;
  title: string | null;
  slug: string | null;
  videoUrl: string | null;
  duration: string | number | null;
  keyPoints: string[] | null;
  image: { asset?: { _ref?: string } } | null;
  firstBlock: string | null;
  course: {
    title: string | null;
    slug: string;
    coverImage: { asset?: { _ref?: string } } | null;
    modules: { title: string | null; lessonIds: string[] | null }[] | null;
  } | null;
};

const publishedId = (id: string) => id.replace(/^drafts\./, '');

function excerpt(row: LessonRow) {
  const text = (row.firstBlock || row.keyPoints?.[0] || '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 170 ? `${text.slice(0, 167).trimEnd()}...` : text;
}

function formatClock(value: string | number | null) {
  if (typeof value === 'string') return value || null;
  if (typeof value !== 'number' || value <= 0) return null;
  const minutes = Math.floor(value / 60);
  return `${String(minutes).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

/** Replaces model-supplied ids with Sanity data, dropping anything that does not resolve. */
export async function hydrateResults(
  modelResults: ModelResult[],
  query: string,
): Promise<SearchResponse> {
  const ids = [...new Set(modelResults.map((r) => publishedId(r.lessonId)))];
  const rows = ids.length
    ? await client.fetch<LessonRow[]>(
        LESSONS_QUERY,
        { ids },
        { cache: 'no-store' },
      )
    : [];
  const byId = new Map(rows.map((row) => [row._id, row]));

  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const modelResult of modelResults) {
    const id = publishedId(modelResult.lessonId);
    const row = byId.get(id);
    if (!row || seen.has(id) || !row.course || !row.slug || !row.title)
      continue;
    seen.add(id);

    const moduleIndex =
      row.course.modules?.findIndex((m) => m.lessonIds?.includes(id)) ?? -1;
    if (moduleIndex < 0) continue;
    const courseModule = row.course.modules![moduleIndex];
    const lessonIndex = courseModule.lessonIds!.indexOf(id);

    let kind = modelResult.kind;
    let matchedSeconds = modelResult.matchedSeconds;
    if (kind === 'video') {
      const verified =
        matchedSeconds !== null &&
        !!row.videoUrl &&
        (await client.fetch<boolean>(
          VIDEO_MOMENT_QUERY,
          { url: row.videoUrl, seconds: matchedSeconds },
          { cache: 'no-store' },
        ));
      if (!verified) {
        kind = 'lesson';
        matchedSeconds = null;
      }
    }

    const lessonHref = `/courses/${row.course.slug}/lessons/${row.slug}`;
    results.push({
      kind,
      lessonId: id,
      title: row.title,
      description: excerpt(row),
      courseTitle: row.course.title ?? '',
      courseSlug: row.course.slug,
      courseImage: row.course.coverImage?.asset?._ref
        ? urlFor(row.course.coverImage).width(64).height(64).fit('crop').url()
        : null,
      lessonSlug: row.slug,
      moduleNumber: moduleIndex + 1,
      moduleTitle: courseModule.title ?? '',
      lessonNumber: `${moduleIndex + 1}.${lessonIndex + 1}`,
      thumbnail: row.image?.asset?._ref
        ? urlFor(row.image).width(560).height(320).fit('crop').url()
        : null,
      duration: formatClock(row.duration),
      keyPoints: (row.keyPoints ?? []).slice(0, 3),
      matchedSeconds,
      href: matchedSeconds ? `${lessonHref}?t=${matchedSeconds}` : lessonHref,
    });
  }

  return {
    query,
    total: results.length,
    courseCount: new Set(results.map((r) => r.courseSlug)).size,
    results,
  };
}
