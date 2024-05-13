export const FIELD_NAMES = [
  "id",
  "rating",
  "version",
  "updated",
  "author",
  "title",
  "content",
] as const;

export type FieldName = (typeof FIELD_NAMES)[number];

export type Review = Partial<Record<FieldName, string>>;
