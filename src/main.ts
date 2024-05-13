#!/usr/bin/env node

import fs from "fs";

import { program } from "@commander-js/extra-typings";

import { writeTabDelimitedText } from "./output";
import { fetchAllReviews } from "./reviews";

program
  .name("app-store-reviews")
  .description("Download Apple App Store reviews as tab-delimited text")
  .arguments("app-id...")
  .action(async (ids) => {
    for (const id of ids) {
      const filename = `${id}.txt`;
      await writeTabDelimitedText(
        fetchAllReviews(id),
        fs.createWriteStream(filename),
      );
      console.log("Wrote", filename);
    }
  });

program.parse();
