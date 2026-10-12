/** Shape returned by `/api/search` and rendered by the results page. */
export type SearchResult = {
  kind: 'video' | 'lesson';
  lessonId: string;
  title: string;
  description: string;
  courseTitle: string;
  courseSlug: string;
  courseImage: string | null;
  lessonSlug: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: string;
  thumbnail: string | null;
  duration: string | null;
  keyPoints: string[];
  matchedSeconds: number | null;
  href: string;
};

export type SearchResponse = {
  query: string;
  total: number;
  courseCount: number;
  results: SearchResult[];
};
