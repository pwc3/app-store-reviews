# App Review Exporter

## Installation

Install via `npm install -g @pwc3/app-store-reviews@latest`. This requires the following in your `.npmrc`:

```text
@pwc3:registry=https://npm.pkg.github.com
```

## Usage

```
app-store-reviews [app-id ...]
```

For each of the specified app identifiers, extracts as many reviews as are exported by the App Store API and writes them to a tab-delimited text file.

An app identifier is the numeric portion of the `id` path component of an App Store URL. For example, if the app URL is `https://apps.apple.com/us/app/id1477376905`, the ID is `1477376905`.
