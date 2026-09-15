# Norsk Lærer

A Norwegian tutor that runs in the browser. It teaches the language from the
alphabet upward, drills what it teaches, listens to you speak it, and lets you
read a real text with the audio and a word-by-word gloss.

Everything runs client-side. No server, no API keys, no cost.

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

**The course.** Twenty-six lessons across eight units, written for someone
starting from nothing: the alphabet and the sounds that mislead English readers
(silent `d`, `kj`, `skj`, `hv`, the `-et` whose `t` disappears), then nouns,
verbs, word order, adjectives, pronouns, numbers, time, and everyday Norwegian.
Each lesson explains one point, shows it in sentences you can play aloud,
tabulates the forms, and supplies the sentences its drills are built from.

**Practice.** Five kinds of drill, generated from the lessons you have done and
from the text you are reading:

| Drill | What you do |
| --- | --- |
| Translate | English prompt, you write the Norwegian |
| Fill the gap | A word is removed from a sentence you have seen |
| Listen and write | Audio only, no text, you type what you hear |
| Choose | Pick `en` / `ei` / `et` for a noun |
| Say it | Read the sentence aloud into the microphone |

Answers are graded word by word rather than pass/fail. The comparison aligns
your answer against the target, so one dropped word does not mark everything
after it wrong, and a one-character difference is reported as a spelling slip
instead of an error. If you have no Norwegian keyboard, `ae`, `o` and `a` are
accepted for `æ`, `ø` and `å`.

**Speaking.** With the microphone on, the browser transcribes what you say and
marks each word against the target so you can see which ones did not land. It is
off until you turn it on in Settings, and Settings explains that Chrome sends
the audio to Google to transcribe it. Every speaking drill still works without
it — hear the model sentence, say it back, compare by ear.

**Reading.** Click a word to hear it and see what it means, with the inflection
worked out: `leste` is shown as the past tense of `lese`, `bøkene` as the
definite plural of `bok`. Play a whole chapter with each word highlighted as the
voice reaches it. English sits below each verse, beside it, or off. Words you
look up become spaced-repetition cards that keep the sentence you met them in.

**The daily plan.** The home screen says what to do today — reviews due, the
next lesson, drills toward your goal, speaking, reading — with a streak that
counts any activity and a bar showing progress through the course.

Speech uses the voices your operating system provides. If no Norwegian voice is
installed, Settings tells you how to add one; without it, speech falls back to
another language and sounds wrong.

## Installing it on a phone

The app installs to a home screen and runs offline — lessons, drills, the
glossary and the text are all cached on the device, so a subway or a plane is
fine. Speech still needs a Norwegian voice installed on the device, but that is
part of the operating system, not this app.

- **Android / Chrome / Edge** — an *Install* button appears on the home screen
  and in Settings. Failing that, use the browser's ⋮ menu → *Install app*.
- **iPhone / iPad** — Safari only, and it never offers a button: tap Share, then
  *Add to Home Screen*. Chrome on iOS cannot install web apps.

Installation needs https, so use the deployed URL rather than `npm run dev` when
testing it on a phone.

Icons are committed under `public/icons/`. To change the mark, edit and rerun
`npm run icons` (it needs Playwright, which is not a project dependency).

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
src/data/lessons/       the curriculum, one file per group of units
src/data/glossary.ts    the bundled Norwegian -> English glossary
src/lib/tokenize.ts     splits verses into words, keeping offsets for read-along
src/lib/morphology.ts   suffix rules mapping inflected forms to dictionary forms
src/lib/glossary.ts     lookup: exact -> irregular form -> suffix rules
src/lib/tts.ts          voice selection, speech, pronunciation hints
src/lib/asr.ts          speech recognition for speaking practice
src/lib/scoring.ts      word-by-word grading of what you produce
src/lib/drills.ts       builds drills from lessons and from the text
src/lib/plan.ts         the daily plan, streak and curriculum progress
src/lib/srs.ts          SM-2 scheduling
scripts/import-text.mjs the text importer
```
