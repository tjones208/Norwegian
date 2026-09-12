# Norsk Lesar

A reading app for learning Norwegian from a text you already know well. Click any
word to hear it and see what it means, play a whole chapter with the words
highlighted as they are spoken, keep a parallel English column beside the
Norwegian, and turn the words you look up into a spaced-repetition deck.

Everything runs in the browser. No server, no API keys, no cost.

```bash
npm install
npm run dev
```

## Adding your own text

**The app ships with original practice passages, not scripture.** Modern
translations of the Book of Mormon are under copyright, so the text is not
committed here — you supply your own copy and the importer bundles it into your
checkout.

Put the Norwegian text in a plain file using this layout:

```
# Første Nephi          <- a book:    "# " then the title
## 1                    <- a chapter: "## " then the number
1 Jeg, Nephi, ...       <- a verse:   the number, a space, then the text
2 Og jeg gjør ...
```

Then run:

```bash
npm run import -- mormons-bok.txt --id bom --title "Mormons bok"
```

That writes `public/data/bom.json` and registers it in `public/data/index.json`,
so the text appears in the app's picker and ships with any build you make. Verses
that wrap across several lines are rejoined, and `Kapittel 3` / `Chapter 3` work
as chapter markers too.

To show English alongside the Norwegian, pass a second file in the same layout:

```bash
npm run import -- mormons-bok.txt --en book-of-mormon.txt --id bom --title "Mormons bok"
```

English is matched by book, chapter and verse number, so the two files need the
same structure. An already-structured JSON file in the app's own shape is passed
straight through.

## What it does

**Hearing the text.** Click a word to hear it. Select a phrase and a "Speak
selection" button appears. Press play on a verse for that verse alone, or
`▶ Les kapittelet` to read the whole chapter continuously, with each word
highlighted as the voice reaches it. Speed runs from 0.5× to 1.5× — slow is
normal early on.

Speech uses the voices your operating system provides. If no Norwegian voice is
installed, Settings tells you how to add one; without it, speech falls back to
another language and sounds wrong.

**Understanding it.** Clicking a word opens a panel with its meaning, its
dictionary form, and how it got from one to the other — `leste` is shown as the
past tense of `lese`, `bøkene` as the definite plural of `bok`. Nouns show their
gender, and words carry pronunciation hints for the spellings that mislead
English readers (`hv-`, `kj-`, `skj-`, silent `d`).

The glossary holds about 370 entries: the function words that hold sentences
together, plus vocabulary that recurs through scripture. A word it does not know
still gets an analysis of its shape, and you can write your own definition —
stored in your browser, and recognised everywhere after that.

**Reading alongside English.** The English column sits below each verse or beside
it, or turns off entirely. Add a note to any verse for the things that only make
sense once you have worked them out yourself.

**Remembering it.** Any word you look up can go into a deck scheduled with SM-2,
the algorithm behind Anki. Cards keep the verse you met the word in, so you
review it in context rather than as an isolated pair. The `Ord` tab also lists the
most frequent words in your text that are *not* yet in your deck — the highest
-value vocabulary to learn next.

## Keyboard

| Key | |
| --- | --- |
| `space` | play / stop the chapter — and show the answer while reviewing |
| `←` `→` | previous / next chapter |
| `esc` | stop speaking, close the word panel |
| `1`–`4` | grade a flashcard (again / hard / good / easy) |

## Your data

Words, notes, review history and progress live in your browser's local storage.
Settings has an export button; take a backup before clearing site data or moving
to another machine.

Syncing across devices is optional. Create a Supabase project, run
`supabase/schema.sql`, and copy `.env.example` to `.env` with your project URL and
anon key. Push and pull buttons then appear in Settings. Without it the app is
fully local, which is the default.

## Building

```bash
npm run build     # -> dist/, a static site you can host anywhere
npm run preview
```

`vite.config.ts` sets a relative base, so the build also works from a subpath such
as GitHub Pages.

## Layout

```
src/lib/tokenize.ts     splits verses into words, keeping offsets for read-along
src/lib/morphology.ts   suffix rules mapping inflected forms to dictionary forms
src/lib/glossary.ts     lookup: exact -> irregular form -> suffix rules
src/lib/tts.ts          voice selection, speech, pronunciation hints
src/lib/srs.ts          SM-2 scheduling
src/data/glossary.ts    the bundled Norwegian -> English glossary
scripts/import-text.mjs the text importer
```
