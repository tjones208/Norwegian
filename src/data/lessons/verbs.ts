import type { Lesson } from '../../types'

/** Unit 3: verbs — the part of Norwegian that is genuinely easier than English. */
export const VERBS: Lesson[] = [
  {
    id: 'vaere-ha',
    unitId: 'verb',
    title: 'Å være og å ha',
    titleEn: 'To be and to have',
    summary: 'The two verbs you need most. Both are irregular, and both are far simpler than their English equivalents.',
    minutes: 6,
    sections: [
      {
        heading: 'One form for everyone',
        body: 'Here is the best news in Norwegian grammar: verbs do not change for person. English has am / are / is; Norwegian has er, and that is the whole list. Learn one form and you have conjugated the verb.',
        table: {
          caption: 'å være — to be',
          head: ['Norwegian', 'English'],
          rows: [
            ['jeg er', 'I am'],
            ['du er', 'you are'],
            ['han / hun er', 'he / she is'],
            ['vi er', 'we are'],
            ['dere er', 'you (plural) are'],
            ['de er', 'they are'],
          ],
        },
      },
      {
        heading: 'å ha — to have',
        body: 'Same story: har for every person. Note that Norwegian uses å ha for age, where English uses "to be".',
        examples: [
          { no: 'Jeg har en bil.', en: 'I have a car.' },
          { no: 'Vi har tre barn.', en: 'We have three children.' },
          { no: 'Han er tjue år.', en: 'He is twenty years old.', note: 'Norwegian says "he is twenty year" — no "old", and år stays singular' },
        ],
      },
      {
        heading: 'Past and perfect',
        body: 'Both verbs are irregular in the past, and both are worth memorising today because you will use them in every second sentence.',
        table: {
          head: ['Infinitive', 'Present', 'Past', 'Perfect'],
          rows: [
            ['å være', 'er', 'var', 'har vært'],
            ['å ha', 'har', 'hadde', 'har hatt'],
          ],
        },
        examples: [
          { no: 'Jeg var i Norge i fjor.', en: 'I was in Norway last year.' },
          { no: 'Vi har vært her i to timer.', en: 'We have been here for two hours.' },
          { no: 'Hun hadde en hund.', en: 'She had a dog.' },
        ],
      },
      {
        heading: 'There is, there are',
        body: 'Norwegian uses det er for both, with no change for plural. For things physically located somewhere, det ligger ("lies") and det står ("stands") are more idiomatic than er.',
        examples: [
          { no: 'Det er en bok på bordet.', en: 'There is a book on the table.' },
          { no: 'Det er mange folk her.', en: 'There are many people here.' },
          { no: 'Det ligger en bok på bordet.', en: 'There is a book (lying) on the table.' },
        ],
      },
    ],
    vocab: [
      { no: 'å være', en: 'to be', pos: 'verb' },
      { no: 'å ha', en: 'to have', pos: 'verb' },
      { no: 'en hund', en: 'a dog', pos: 'noun', gender: 'm' },
      { no: 'i fjor', en: 'last year' },
      { no: 'folk', en: 'people', pos: 'noun', gender: 'n' },
    ],
    practice: [
      { no: 'Jeg er fra USA.', en: 'I am from the USA.' },
      { no: 'Vi har tre barn.', en: 'We have three children.' },
      { no: 'Han var her i går.', en: 'He was here yesterday.' },
      { no: 'Det er en bok på bordet.', en: 'There is a book on the table.' },
      { no: 'Jeg har vært i Norge.', en: 'I have been to Norway.' },
    ],
  },

  {
    id: 'presens',
    unitId: 'verb',
    title: 'Presens — nåtid',
    titleEn: 'The present tense',
    summary: 'Add -r to the infinitive. That is the entire rule, and it covers both "I read" and "I am reading".',
    minutes: 6,
    sections: [
      {
        heading: 'Infinitive plus -r',
        body: 'The infinitive is å plus the verb, nearly always ending in -e. Drop nothing, add -r, and you have the present tense for every person.',
        table: {
          head: ['Infinitive', 'Present', 'Meaning'],
          rows: [
            ['å snakke', 'snakker', 'speak / am speaking'],
            ['å lese', 'leser', 'read / am reading'],
            ['å arbeide', 'arbeider', 'work / am working'],
            ['å spise', 'spiser', 'eat / am eating'],
          ],
        },
      },
      {
        heading: 'Short verbs ending in a stressed vowel',
        body: 'A handful of verbs have no -e in the infinitive. They still just add -r.',
        examples: [
          { no: 'å gå → går', en: 'to go → goes' },
          { no: 'å se → ser', en: 'to see → sees' },
          { no: 'å bo → bor', en: 'to live (reside) → lives' },
          { no: 'å tro → tror', en: 'to believe → believes' },
        ],
      },
      {
        heading: 'No continuous tense to worry about',
        body: 'Norwegian does not distinguish "I read" from "I am reading" — jeg leser is both. If you really need to stress that something is happening right now, use holder på å ("is in the middle of").',
        examples: [
          { no: 'Jeg leser.', en: 'I read. / I am reading.' },
          { no: 'Jeg holder på å lese.', en: 'I am (in the middle of) reading.' },
          { no: 'Hva gjør du?', en: 'What are you doing?' },
        ],
      },
      {
        heading: 'Present for the future',
        body: 'As in English, the present tense often carries future meaning when a time word makes it clear.',
        examples: [
          { no: 'Jeg reiser i morgen.', en: 'I am travelling tomorrow.' },
          { no: 'Vi kommer klokka sju.', en: 'We are coming at seven.' },
        ],
      },
    ],
    vocab: [
      { no: 'å snakke', en: 'to speak, to talk', pos: 'verb' },
      { no: 'å bo', en: 'to live, to reside', pos: 'verb' },
      { no: 'å spise', en: 'to eat', pos: 'verb' },
      { no: 'å arbeide', en: 'to work', pos: 'verb' },
      { no: 'i morgen', en: 'tomorrow' },
    ],
    practice: [
      { no: 'Jeg snakker norsk.', en: 'I speak Norwegian.' },
      { no: 'Hun bor i Oslo.', en: 'She lives in Oslo.' },
      { no: 'Vi spiser middag klokka fem.', en: 'We eat dinner at five.' },
      { no: 'Jeg reiser i morgen.', en: 'I am travelling tomorrow.' },
    ],
  },

  {
    id: 'preteritum',
    unitId: 'verb',
    title: 'Preteritum — fortid',
    titleEn: 'The past tense',
    summary: 'Regular verbs fall into four groups by ending. Which group a verb joins is predictable from its stem.',
    minutes: 10,
    sections: [
      {
        heading: 'Four groups, decided by the stem',
        body: 'Drop the å and the final -e and you have the stem. What the stem ends in tells you which past-tense ending the verb takes. This is more regular than it first looks — group 1 and group 2 cover the large majority of verbs.',
        table: {
          head: ['Group', 'Stem ends in', 'Past ending', 'Example'],
          rows: [
            ['1', 'two or more consonants', '-et', 'snakke → snakket'],
            ['2', 'one consonant', '-te', 'lese → leste'],
            ['3', 'v, g, or a diphthong', '-de', 'leve → levde'],
            ['4', 'a stressed vowel', '-dde', 'bo → bodde'],
          ],
        },
      },
      {
        heading: 'The groups in full',
        body: 'The perfect participle follows from the same group, so learning the group gives you both past tenses at once.',
        table: {
          head: ['Infinitive', 'Present', 'Past', 'Perfect', 'Meaning'],
          rows: [
            ['å snakke', 'snakker', 'snakket', 'har snakket', 'to speak'],
            ['å arbeide', 'arbeider', 'arbeidet', 'har arbeidet', 'to work'],
            ['å lese', 'leser', 'leste', 'har lest', 'to read'],
            ['å spise', 'spiser', 'spiste', 'har spist', 'to eat'],
            ['å leve', 'lever', 'levde', 'har levd', 'to live'],
            ['å prøve', 'prøver', 'prøvde', 'har prøvd', 'to try'],
            ['å bo', 'bor', 'bodde', 'har bodd', 'to reside'],
            ['å tro', 'tror', 'trodde', 'har trodd', 'to believe'],
          ],
        },
      },
      {
        heading: 'Strong verbs change their vowel',
        body: 'Like English sing/sang/sung, a group of common verbs signals the past by changing the vowel rather than adding an ending. There is no rule — these are learned one at a time, and they happen to be the verbs you use most.',
        table: {
          head: ['Infinitive', 'Past', 'Perfect', 'Meaning'],
          rows: [
            ['å gå', 'gikk', 'har gått', 'to go, to walk'],
            ['å se', 'så', 'har sett', 'to see'],
            ['å komme', 'kom', 'har kommet', 'to come'],
            ['å ta', 'tok', 'har tatt', 'to take'],
            ['å gi', 'ga', 'har gitt', 'to give'],
            ['å få', 'fikk', 'har fått', 'to get, to receive'],
            ['å si', 'sa', 'har sagt', 'to say'],
            ['å gjøre', 'gjorde', 'har gjort', 'to do'],
            ['å vite', 'visste', 'har visst', 'to know'],
            ['å finne', 'fant', 'har funnet', 'to find'],
            ['å skrive', 'skrev', 'har skrevet', 'to write'],
            ['å sove', 'sov', 'har sovet', 'to sleep'],
            ['å drikke', 'drakk', 'har drukket', 'to drink'],
          ],
        },
      },
    ],
    vocab: [
      { no: 'å prøve', en: 'to try', pos: 'verb' },
      { no: 'å skrive', en: 'to write', pos: 'verb' },
      { no: 'å sove', en: 'to sleep', pos: 'verb' },
      { no: 'å drikke', en: 'to drink', pos: 'verb' },
      { no: 'i går', en: 'yesterday' },
    ],
    practice: [
      { no: 'Jeg snakket med henne i går.', en: 'I spoke with her yesterday.' },
      { no: 'Hun leste boka.', en: 'She read the book.' },
      { no: 'Vi bodde i Bergen.', en: 'We lived in Bergen.' },
      { no: 'Han gikk hjem.', en: 'He went home.' },
      { no: 'Jeg så henne i går.', en: 'I saw her yesterday.' },
    ],
  },

  {
    id: 'perfektum',
    unitId: 'verb',
    title: 'Perfektum — har gjort',
    titleEn: 'The perfect tense',
    summary: 'har plus the participle, used much as in English — with one clear rule about when to use the plain past instead.',
    minutes: 7,
    sections: [
      {
        heading: 'har + participle',
        body: 'The perfect is built exactly like English: har ("have") plus the perfect participle. The participle never changes form.',
        examples: [
          { no: 'Jeg har spist.', en: 'I have eaten.' },
          { no: 'Vi har bodd her i tre år.', en: 'We have lived here for three years.' },
          { no: 'Har du sett filmen?', en: 'Have you seen the film?' },
        ],
      },
      {
        heading: 'Perfect or past?',
        body: 'The dividing line is the same as in English and easy to apply: if the sentence names a finished point in time, use the plain past. If it does not, the perfect is usually right.',
        examples: [
          { no: 'Jeg har vært i Norge.', en: 'I have been to Norway.', note: 'no time given — perfect' },
          { no: 'Jeg var i Norge i fjor.', en: 'I was in Norway last year.', note: 'i fjor pins the time — past' },
          { no: 'Har du spist?', en: 'Have you eaten?' },
          { no: 'Jeg spiste klokka to.', en: 'I ate at two o\'clock.' },
        ],
      },
      {
        heading: 'Pluperfect: hadde',
        body: 'Swap har for hadde to step one layer further back — something that had already happened before another past event.',
        examples: [
          { no: 'Da jeg kom, hadde han allerede gått.', en: 'When I arrived, he had already left.' },
          { no: 'Hun hadde aldri sett snø.', en: 'She had never seen snow.' },
        ],
      },
      {
        heading: 'The future: skal and vil',
        body: 'Norwegian has no separate future tense. Use skal for intention and plans, vil for wanting or for predictions, or just the present tense with a time word.',
        examples: [
          { no: 'Jeg skal reise til Norge.', en: 'I am going to travel to Norway.', note: 'a plan' },
          { no: 'Det vil regne i morgen.', en: 'It will rain tomorrow.', note: 'a prediction' },
          { no: 'Jeg reiser på mandag.', en: 'I am travelling on Monday.', note: 'present tense, future meaning' },
        ],
      },
    ],
    vocab: [
      { no: 'allerede', en: 'already', pos: 'adv' },
      { no: 'aldri', en: 'never', pos: 'adv' },
      { no: 'en film', en: 'a film', pos: 'noun', gender: 'm' },
      { no: 'snø', en: 'snow', pos: 'noun', gender: 'm' },
    ],
    practice: [
      { no: 'Jeg har vært i Norge.', en: 'I have been to Norway.' },
      { no: 'Har du spist middag?', en: 'Have you eaten dinner?' },
      { no: 'Vi har bodd her i tre år.', en: 'We have lived here for three years.' },
      { no: 'Jeg skal reise til Oslo.', en: 'I am going to travel to Oslo.' },
    ],
  },

  {
    id: 'modalverb',
    unitId: 'verb',
    title: 'Modalverb — kan, må, skal, vil',
    titleEn: 'Modal verbs',
    summary: 'Five short verbs that carry ability, obligation and intention — and they drop the å before the next verb.',
    minutes: 7,
    sections: [
      {
        heading: 'The five modals',
        body: 'These behave like English can, must, shall, will and ought. Each is followed directly by an infinitive with no å in between — the one thing learners consistently get wrong.',
        table: {
          head: ['Present', 'Past', 'Meaning'],
          rows: [
            ['kan', 'kunne', 'can, is able to'],
            ['må', 'måtte', 'must, has to'],
            ['skal', 'skulle', 'shall, is going to'],
            ['vil', 'ville', 'will, wants to'],
            ['bør', 'burde', 'ought to, should'],
          ],
        },
      },
      {
        heading: 'No å after a modal',
        body: 'Compare: Jeg liker å lese ("I like to read") keeps the å, because like is not a modal. Jeg kan lese drops it.',
        examples: [
          { no: 'Jeg kan snakke norsk.', en: 'I can speak Norwegian.', note: 'not "kan å snakke"' },
          { no: 'Du må komme i morgen.', en: 'You must come tomorrow.' },
          { no: 'Vi skal spise klokka seks.', en: 'We are going to eat at six.' },
          { no: 'Jeg liker å lese.', en: 'I like to read.', note: 'å stays — like is not a modal' },
        ],
      },
      {
        heading: 'vil means "want", not "will"',
        body: 'This is a trap for English speakers. Jeg vil normally means "I want to", not "I will". For a plan or a promise, use skal.',
        examples: [
          { no: 'Jeg vil lære norsk.', en: 'I want to learn Norwegian.' },
          { no: 'Jeg skal lære norsk.', en: 'I am going to learn Norwegian.' },
          { no: 'Vil du ha kaffe?', en: 'Would you like coffee?', note: 'the standard way to offer something' },
        ],
      },
      {
        heading: 'Leaving the verb out',
        body: 'With a modal and a clear direction, Norwegian often drops the movement verb entirely. Jeg skal hjem needs no "go" — the destination carries it.',
        examples: [
          { no: 'Jeg skal hjem.', en: 'I am going home.' },
          { no: 'Vi må til Oslo.', en: 'We have to go to Oslo.' },
          { no: 'Kan du norsk?', en: 'Do you know Norwegian?', note: 'kan + a language means to know it' },
        ],
      },
    ],
    vocab: [
      { no: 'å like', en: 'to like', pos: 'verb' },
      { no: 'kaffe', en: 'coffee', pos: 'noun', gender: 'm' },
      { no: 'å lære', en: 'to learn, to teach', pos: 'verb' },
      { no: 'hjem', en: 'home (direction)', pos: 'adv' },
    ],
    practice: [
      { no: 'Jeg kan snakke litt norsk.', en: 'I can speak a little Norwegian.' },
      { no: 'Du må komme i morgen.', en: 'You must come tomorrow.' },
      { no: 'Vil du ha kaffe?', en: 'Would you like coffee?' },
      { no: 'Jeg vil lære norsk.', en: 'I want to learn Norwegian.' },
      { no: 'Vi skal spise klokka seks.', en: 'We are going to eat at six.' },
    ],
  },

  {
    id: 'imperativ',
    unitId: 'verb',
    title: 'Imperativ — gi en beskjed',
    titleEn: 'The imperative',
    summary: 'To give an instruction, strip the verb back to its bare stem.',
    minutes: 4,
    sections: [
      {
        heading: 'Drop the -e',
        body: 'Take the infinitive, remove å and the final -e, and what remains is the command form. Verbs with no -e in the infinitive are already there.',
        table: {
          head: ['Infinitive', 'Imperative', 'Meaning'],
          rows: [
            ['å komme', 'Kom!', 'Come!'],
            ['å lese', 'Les!', 'Read!'],
            ['å snakke', 'Snakk!', 'Speak!'],
            ['å spise', 'Spis!', 'Eat!'],
            ['å gå', 'Gå!', 'Go!'],
            ['å se', 'Se!', 'Look!'],
          ],
        },
      },
      {
        heading: 'Softening it',
        body: 'A bare imperative can sound blunt. Norwegians soften requests by adding vær så snill, by using a question with kan du, or by tacking on a friendly da.',
        examples: [
          { no: 'Kom hit!', en: 'Come here!' },
          { no: 'Kan du komme hit?', en: 'Could you come here?', note: 'softer, and more common' },
          { no: 'Vær så snill å hjelpe meg.', en: 'Please help me.' },
          { no: 'Ikke gå!', en: 'Do not go!', note: 'negative imperative: ikke comes first' },
        ],
      },
    ],
    vocab: [
      { no: 'hit', en: 'here (to here)', pos: 'adv' },
      { no: 'å hjelpe', en: 'to help', pos: 'verb' },
      { no: 'vær så snill', en: 'please' },
    ],
    practice: [
      { no: 'Kom hit!', en: 'Come here!' },
      { no: 'Ikke gå!', en: 'Do not go!' },
      { no: 'Kan du hjelpe meg?', en: 'Can you help me?' },
      { no: 'Snakk saktere, vær så snill.', en: 'Speak more slowly, please.' },
    ],
  },
]
