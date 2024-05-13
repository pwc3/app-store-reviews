import { Review } from "./types";

export const fetchAllReviews = async function* (
  id: string,
): AsyncGenerator<Review> {
  for (let page = 1; page <= 10; page++) {
    yield* fetchReviews(id, page);
  }
};

const fetchReviews = async function* (
  id: string,
  page: number,
): AsyncGenerator<Review> {
  const response = await fetch(
    `https://itunes.apple.com/us/rss/customerreviews/page=${page}/id=${id}/json`,
  );

  if (!response.ok) {
    throw new Error(`Received HTTP status ${response.status}`);
  }

  const json = await response.json();
  yield* extractReviews(json);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractReviews = function* (json: any): Generator<Review> {
  const entries = json.feed.entry;
  if (entries === undefined) {
    return;
  }

  for (const entry of entries) {
    yield {
      id: entry.id?.label,
      author: entry.author?.name?.label,
      title: entry.title?.label,
      content: entry.content?.label,
      rating: entry["im:rating"]?.label,
      version: entry["im:version"]?.label,
      updated: entry.updated?.label,
    } as Review;
  }
};
