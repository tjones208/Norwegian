import type { Lesson } from '../../types'

/** Units 5–6: adjectives and pronouns. */
export const DESCRIBING: Lesson[] = [
  {
    id: 'adjektiv',
    unitId: 'beskrive',
    title: 'Adjektiv — stor, stort, store',
    titleEn: 'Adjectives and agreement',
    summary: 'An adjective takes -t with a neuter noun and -e in the plural or after "the". Three forms, one pattern.',
    minutes: 8,
    sections: [
      {
        heading: 'The three forms',
        body: 'Norwegian adjectives agree with the noun. The base form covers masculine and feminine singular; neuter adds -t; plural adds -e.',
        table: {
          head: ['Context', 'Form', 'Example', 'Meaning'],
          rows: [
            ['masc. / fem. singular', 'base', 'en stor bil', 'a big car'],
            ['neuter singular', '+t', 'et stort hus', 'a big house'],
            ['plural', '+e', 'store biler', 'big cars'],
            ['after "the"', '+e', 'den store bilen', 'the big car'],
          ],
        },
      },
      {
        heading: 'Double definiteness',
        body: 'This has no English parallel and looks like a mistake at first. To say "the big car", Norwegian marks definiteness three times: a word for "the" in front, -e on the adjective, and the definite ending still on the noun.',
        examples: [
          { no: 'den store bilen', en: 'the big car', note: 'den + store + bilen' },
          { no: 'det store huset', en: 'the big house', note: 'det for neuter' },
          { no: 'de store bilene', en: 'the big cars', note: 'de for plural' },
          { no: 'Bilen er stor.', en: 'The car is big.', note: 'after er the adjective stands alone — no -e' },
        ],
      },
      {
        heading: 'Adjectives that skip the -t',
        body: 'Adjectives already ending in -ig or -sk take no -t in the neuter, and neither do those ending in -e. This is a small mercy worth remembering.',
        examples: [
          { no: 'et hyggelig hus', en: 'a pleasant house', note: '-ig, so no -t' },
          { no: 'et norsk ord', en: 'a Norwegian word', note: '-sk, so no -t' },
          { no: 'et moderne hus', en: 'a modern house', note: 'ends in -e, never changes' },
        ],
      },
      {
        heading: 'liten is its own thing',
        body: 'The word for "small" is irregular in every direction, and it is common enough that you simply learn the set.',
        table: {
          head: ['Context', 'Form', 'Example'],
          rows: [
            ['masculine', 'liten', 'en liten bil'],
            ['feminine', 'lita', 'ei lita bok'],
            ['neuter', 'lite', 'et lite hus'],
            ['definite', 'lille', 'den lille bilen'],
            ['plural', 'små', 'små biler'],
          ],
        },
      },
    ],
    vocab: [
      { no: 'stor', en: 'big, great', pos: 'adj' },
      { no: 'liten', en: 'small', pos: 'adj' },
      { no: 'ny', en: 'new', pos: 'adj' },
      { no: 'fin', en: 'nice, fine', pos: 'adj' },
      { no: 'vanskelig', en: 'difficult', pos: 'adj' },
      { no: 'lett', en: 'easy, light', pos: 'adj' },
    ],
    practice: [
      { no: 'Det er et stort hus.', en: 'That is a big house.' },
      { no: 'Den store bilen er min.', en: 'The big car is mine.' },
      { no: 'Norsk er ikke vanskelig.', en: 'Norwegian is not difficult.' },
      { no: 'Vi har en liten hund.', en: 'We have a small dog.' },
      { no: 'De nye bøkene er fine.', en: 'The new books are nice.' },
    ],
  },

  {
    id: 'gradboying',
    unitId: 'beskrive',
    title: 'Sammenligning — større og størst',
    titleEn: 'Comparatives and superlatives',
    summary: 'Add -ere for "more" and -est for "most" — plus a short list of irregulars you already half know.',
    minutes: 6,
    sections: [
      {
        heading: 'The regular pattern',
        body: 'Where English switches between "-er" and "more" depending on word length, Norwegian mostly just adds endings.',
        table: {
          head: ['Adjective', 'Comparative', 'Superlative', 'Meaning'],
          rows: [
            ['fin', 'finere', 'finest', 'nice'],
            ['billig', 'billigere', 'billigst', 'cheap'],
            ['vanskelig', 'vanskeligere', 'vanskeligst', 'difficult'],
            ['sterk', 'sterkere', 'sterkest', 'strong'],
          ],
        },
      },
      {
        heading: 'The irregulars',
        body: 'The most common adjectives change their vowel instead, exactly as English good/better/best does.',
        table: {
          head: ['Adjective', 'Comparative', 'Superlative', 'Meaning'],
          rows: [
            ['god', 'bedre', 'best', 'good'],
            ['dårlig', 'verre', 'verst', 'bad'],
            ['stor', 'større', 'størst', 'big'],
            ['liten', 'mindre', 'minst', 'small'],
            ['gammel', 'eldre', 'eldst', 'old'],
            ['ung', 'yngre', 'yngst', 'young'],
            ['mange', 'flere', 'flest', 'many'],
            ['mye', 'mer', 'mest', 'much'],
            ['lang', 'lenger', 'lengst', 'long'],
          ],
        },
      },
      {
        heading: 'Than is enn',
        body: 'Comparisons use enn. For "as ... as", use like ... som.',
        examples: [
          { no: 'Norsk er lettere enn tysk.', en: 'Norwegian is easier than German.' },
          { no: 'Han er eldre enn meg.', en: 'He is older than me.' },
          { no: 'Hun er like gammel som jeg.', en: 'She is as old as I am.' },
          { no: 'Dette er den beste boka.', en: 'This is the best book.', note: 'superlative after "the" takes -e' },
        ],
      },
    ],
    vocab: [
      { no: 'billig', en: 'cheap', pos: 'adj' },
      { no: 'dyr', en: 'expensive', pos: 'adj' },
      { no: 'dårlig', en: 'bad', pos: 'adj' },
      { no: 'tysk', en: 'German', pos: 'adj' },
    ],
    practice: [
      { no: 'Norsk er lettere enn tysk.', en: 'Norwegian is easier than German.' },
      { no: 'Han er eldre enn meg.', en: 'He is older than me.' },
      { no: 'Dette er den beste boka.', en: 'This is the best book.' },
      { no: 'Bilen er dyrere enn sykkelen.', en: 'The car is more expensive than the bicycle.' },
    ],
  },

  {
    id: 'pronomen',
    unitId: 'pronomen',
    title: 'Personlige pronomen',
    titleEn: 'Personal pronouns',
    summary: 'Subject and object forms — and the reason "det" turns up in sentences that seem not to need it.',
    minutes: 6,
    sections: [
      {
        heading: 'Subject and object',
        body: 'The split works just as in English (I/me, he/him). Remember that meg, deg and seg are said "mei", "dei" and "sei".',
        table: {
          head: ['Subject', 'Object', 'English'],
          rows: [
            ['jeg', 'meg', 'I / me'],
            ['du', 'deg', 'you (singular)'],
            ['han', 'ham / han', 'he / him'],
            ['hun', 'henne', 'she / her'],
            ['den', 'den', 'it (masc./fem. thing)'],
            ['det', 'det', 'it (neuter thing)'],
            ['vi', 'oss', 'we / us'],
            ['dere', 'dere', 'you (plural)'],
            ['de', 'dem', 'they / them'],
          ],
        },
      },
      {
        heading: 'den or det for "it"',
        body: 'Which word you use for "it" depends on the gender of the noun it replaces — den for masculine and feminine, det for neuter.',
        examples: [
          { no: 'Hvor er bilen? Den er her.', en: 'Where is the car? It is here.', note: 'bil is masculine → den' },
          { no: 'Hvor er huset? Det er der.', en: 'Where is the house? It is there.', note: 'hus is neuter → det' },
        ],
      },
      {
        heading: 'seg — the reflexive',
        body: 'When the object is the same person as the subject, the third person uses seg. Many Norwegian verbs are reflexive where English verbs are not.',
        examples: [
          { no: 'Han vasker seg.', en: 'He washes himself.' },
          { no: 'De gleder seg.', en: 'They are looking forward to it.' },
          { no: 'Sett deg!', en: 'Sit down!', note: 'literally "seat yourself"' },
          { no: 'Jeg føler meg bra.', en: 'I feel good.' },
        ],
      },
    ],
    vocab: [
      { no: 'å vaske', en: 'to wash', pos: 'verb' },
      { no: 'å føle', en: 'to feel', pos: 'verb' },
      { no: 'å glede seg', en: 'to look forward to', pos: 'phrase' },
    ],
    practice: [
      { no: 'Kan du hjelpe meg?', en: 'Can you help me?' },
      { no: 'Jeg så henne i går.', en: 'I saw her yesterday.' },
      { no: 'Vi snakker med dem.', en: 'We are talking with them.' },
      { no: 'Jeg føler meg bra.', en: 'I feel good.' },
    ],
  },

  {
    id: 'eiendom',
    unitId: 'pronomen',
    title: 'Eiendomsord — min, din, sin',
    titleEn: 'Possessives, and the sin trap',
    summary: 'Possessives normally follow the noun. And Norwegian makes a distinction English cannot: his own versus his.',
    minutes: 8,
    sections: [
      {
        heading: 'The forms',
        body: 'Min, din, vår and sin agree with the noun they describe. Hans, hennes and deres never change.',
        table: {
          head: ['masc.', 'fem.', 'neut.', 'plural', 'English'],
          rows: [
            ['min', 'mi', 'mitt', 'mine', 'my'],
            ['din', 'di', 'ditt', 'dine', 'your'],
            ['sin', 'si', 'sitt', 'sine', 'his/her/their own'],
            ['vår', 'vår', 'vårt', 'våre', 'our'],
            ['hans', 'hans', 'hans', 'hans', 'his'],
            ['hennes', 'hennes', 'hennes', 'hennes', 'her'],
            ['deres', 'deres', 'deres', 'deres', 'their, your (pl.)'],
          ],
        },
      },
      {
        heading: 'Put it after the noun',
        body: 'Both orders are grammatical, but Norwegians overwhelmingly put the possessive after a noun in its definite form. Min bil sounds emphatic or bookish; bilen min is what people say.',
        examples: [
          { no: 'bilen min', en: 'my car', note: 'the everyday order — note the definite ending' },
          { no: 'MIN bil', en: 'MY car', note: 'front position adds emphasis' },
          { no: 'boka mi', en: 'my book' },
          { no: 'huset mitt', en: 'my house' },
          { no: 'foreldrene mine', en: 'my parents' },
        ],
      },
      {
        heading: 'sin versus hans — the distinction English lacks',
        body: 'This is the classic Norwegian puzzle, and the rule is precise: sin refers back to the subject of the same clause. Hans, hennes and deres refer to somebody else. English "he took his car" is ambiguous; Norwegian is not.',
        examples: [
          { no: 'Han tok bilen sin.', en: 'He took his own car.', note: 'sin points back at han' },
          { no: 'Han tok bilen hans.', en: 'He took his (another man\'s) car.', note: 'hans points elsewhere' },
          { no: 'Hun elsker mannen sin.', en: 'She loves her own husband.' },
          { no: 'Hun elsker mannen hennes.', en: 'She loves her (some other woman\'s) husband.' },
        ],
      },
      {
        heading: 'sin can never be the subject',
        body: 'Because sin has to point back at the subject, it can never be part of the subject itself. "His car is red" must use hans.',
        examples: [
          { no: 'Bilen hans er rød.', en: 'His car is red.', note: 'the car is the subject, so not sin' },
          { no: 'Han vasker bilen sin.', en: 'He is washing his own car.', note: 'here the car is the object — sin is right' },
        ],
      },
    ],
    vocab: [
      { no: 'foreldre', en: 'parents', pos: 'noun' },
      { no: 'rød', en: 'red', pos: 'adj' },
      { no: 'en sykkel', en: 'a bicycle', pos: 'noun', gender: 'm' },
    ],
    practice: [
      { no: 'Bilen min er rød.', en: 'My car is red.' },
      { no: 'Han tok bilen sin.', en: 'He took his own car.' },
      { no: 'Boka mi ligger på bordet.', en: 'My book is lying on the table.' },
      { no: 'Hvor er huset ditt?', en: 'Where is your house?' },
      { no: 'Hun elsker mannen sin.', en: 'She loves her husband.' },
    ],
  },
]
