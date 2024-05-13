import { Writable } from "stream";

import { FIELD_NAMES, Review } from "./types";

export const writeTabDelimitedText = async (
  entries: AsyncGenerator<Review>,
  stream: Writable = process.stdout,
) => {
  stream.write(FIELD_NAMES.join("\t"));
  stream.write("\n");

  for await (const entry of entries) {
    const fields = FIELD_NAMES.map(
      (key) => entry[key]?.replaceAll(/[\n\r]+/g, " ") ?? "",
    );
    stream.write(fields.join("\t"));
    stream.write("\n");
  }

  stream.end();
};
