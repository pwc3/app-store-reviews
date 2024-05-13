#!/usr/bin/env node

// src/main.ts
import fs from "fs";
import { program } from "@commander-js/extra-typings";

// src/types.ts
var FIELD_NAMES = [
  "id",
  "rating",
  "version",
  "updated",
  "author",
  "title",
  "content"
];

// src/output.ts
var writeTabDelimitedText = async (entries, stream = process.stdout) => {
  stream.write(FIELD_NAMES.join("	"));
  stream.write("\n");
  for await (const entry of entries) {
    const fields = FIELD_NAMES.map(
      (key) => entry[key]?.replaceAll(/[\n\r]+/g, " ") ?? ""
    );
    stream.write(fields.join("	"));
    stream.write("\n");
  }
  stream.end();
};

// src/reviews.ts
var fetchAllReviews = async function* (id) {
  for (let page = 1; page <= 10; page++) {
    yield* fetchReviews(id, page);
  }
};
var fetchReviews = async function* (id, page) {
  const response = await fetch(
    `https://itunes.apple.com/us/rss/customerreviews/page=${page}/id=${id}/json`
  );
  if (!response.ok) {
    throw new Error(`Received HTTP status ${response.status}`);
  }
  const json = await response.json();
  yield* extractReviews(json);
};
var extractReviews = function* (json) {
  const entries = json.feed.entry;
  if (entries === void 0) {
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
      updated: entry.updated?.label
    };
  }
};

// src/main.ts
program.name("app-store-reviews").description("Download Apple App Store reviews as tab-delimited text").arguments("app-id...").action(async (ids) => {
  for (const id of ids) {
    const filename = `${id}.txt`;
    await writeTabDelimitedText(
      fetchAllReviews(id),
      fs.createWriteStream(filename)
    );
    console.log("Wrote", filename);
  }
});
program.parse();
//# sourceMappingURL=main.js.map