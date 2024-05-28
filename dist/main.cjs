#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_fs = __toESM(require("fs"), 1);
var import_extra_typings = require("@commander-js/extra-typings");

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
import_extra_typings.program.name("app-store-reviews").description("Download Apple App Store reviews as tab-delimited text").arguments("app-id...").action(async (ids) => {
  for (const id of ids) {
    const filename = `${id}.txt`;
    await writeTabDelimitedText(
      fetchAllReviews(id),
      import_fs.default.createWriteStream(filename)
    );
    console.log("Wrote", filename);
  }
});
import_extra_typings.program.parse();
//# sourceMappingURL=main.cjs.map