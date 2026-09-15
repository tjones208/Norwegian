import type { Lesson } from '../../types'

/** Unit 4: how a Norwegian sentence is assembled. */
export const SENTENCES: Lesson[] = [
  {
    id: 'v2',
    unitId: 'setninger',
    title: 'V2 — verbet på plass nummer to',
    titleEn: 'The verb goes second',
    summary: 'The one rule that governs Norwegian word order: in a statement, the verb is the second element. Always.',
    minutes: 9,
    sections: [
      {
        heading: 'Count elements, not words',
        body: 'In any Norwegian statement, the conjugated verb sits in second position. "Second" means the second unit of meaning, not the second word — i dag ("today") and min gamle far ("my old father") are each one element.',
        examples: [
          { no: 'Jeg | leser | boka.', en: 'I read the book.', note: 'subject first, verb second' },
          { no: 'I dag | leser | jeg boka.', en: 'Today I read the book.', note: 'time first, verb second, subject moves behind' },
          { no: 'Boka | leser | jeg i dag.', en: 'The book, I am reading today.', note: 'object first for emphasis — still verb second' },
        ],
      },
      {
        heading: 'Fronting pushes the subject behind the verb',
        body: 'This is where English speakers slip. English says "Today I read"; Norwegian cannot. If anything other than the subject comes first, the subject must move to just after the verb. This swap is called inversion, and it is not optional.',
        examples: [
          { no: 'I morgen skal jeg til Oslo.', en: 'Tomorrow I am going to Oslo.', note: 'not "I morgen jeg skal"' },
          { no: 'Nå forstår jeg.', en: 'Now I understand.' },
          { no: 'Derfor lærer jeg norsk.', en: 'That is why I am learning Norwegian.' },
          { no: 'Etter middag leser vi.', en: 'After dinner we read.' },
        ],
      },
      {
        heading: 'Where the second verb goes',
        body: 'Only the conjugated verb claims second place. An infinitive or a participle that belongs with it waits until after the subject and any short adverb.',
        examples: [
          { no: 'Jeg vil lese boka.', en: 'I want to read the book.' },
          { no: 'I dag vil jeg lese boka.', en: 'Today I want to read the book.', note: 'vil is second, lese follows the subject' },
          { no: 'Han har ikke lest boka.', en: 'He has not read the book.' },
        ],
      },
      {
        heading: 'Test yourself on this one',
        body: 'If you internalise nothing else about Norwegian syntax, internalise this: start the sentence with a time expression, and the next word is the verb, not the subject. Most learner mistakes in Norwegian are a missing inversion.',
        examples: [
          { no: 'I går var jeg hjemme.', en: 'Yesterday I was at home.' },
          { no: 'Om sommeren reiser vi til Norge.', en: 'In the summer we travel to Norway.' },
          { no: 'Hver dag leser jeg litt.', en: 'Every day I read a little.' },
        ],
      },
    ],
    vocab: [
      { no: 'derfor', en: 'therefore, that is why', pos: 'adv' },
      { no: 'hjemme', en: 'at home', pos: 'adv' },
      { no: 'en sommer', en: 'a summer', pos: 'noun', gender: 'm' },
      { no: 'middag', en: 'dinner', pos: 'noun', gender: 'm' },
    ],
    practice: [
      { no: 'I dag leser jeg norsk.', en: 'Today I am reading Norwegian.' },
      { no: 'I morgen skal jeg til Oslo.', en: 'Tomorrow I am going to Oslo.' },
      { no: 'Nå forstår jeg.', en: 'Now I understand.' },
      { no: 'Hver dag leser jeg litt.', en: 'Every day I read a little.' },
      { no: 'I går var jeg hjemme.', en: 'Yesterday I was at home.' },
    ],
  },

  {
    id: 'sporsmal',
    unitId: 'setninger',
    title: 'Spørsmål',
    titleEn: 'Questions',
    summary: 'No "do" and no auxiliary. Move the verb to the front, or lead with a question word.',
    minutes: 7,
    sections: [
      {
        heading: 'Yes or no: verb first',
        body: 'English needs "do" to ask a question. Norwegian just puts the verb first — far simpler, and one less thing to conjugate.',
        examples: [
          { no: 'Du snakker norsk.', en: 'You speak Norwegian.' },
          { no: 'Snakker du norsk?', en: 'Do you speak Norwegian?' },
          { no: 'Har du spist?', en: 'Have you eaten?' },
          { no: 'Kan du hjelpe meg?', en: 'Can you help me?' },
        ],
      },
      {
        heading: 'The question words',
        body: 'Nearly all of them begin with hv-, where the h is silent. The question word counts as the first element, so the verb still lands second.',
        table: {
          head: ['Norwegian', 'Said', 'English'],
          rows: [
            ['hva', 'va', 'what'],
            ['hvem', 'vem', 'who'],
            ['hvor', 'vor', 'where'],
            ['hvorfor', 'VOR-for', 'why'],
            ['hvordan', 'VOR-dan', 'how'],
            ['når', 'når', 'when'],
            ['hvilken / hvilket / hvilke', 'VIL-ken', 'which'],
          ],
        },
      },
      {
        heading: 'Question word, then verb, then subject',
        body: 'The pattern never varies, which makes questions one of the easiest things to produce correctly from day one.',
        examples: [
          { no: 'Hva heter du?', en: 'What is your name?' },
          { no: 'Hvor bor du?', en: 'Where do you live?' },
          { no: 'Når kommer toget?', en: 'When does the train come?' },
          { no: 'Hvorfor lærer du norsk?', en: 'Why are you learning Norwegian?' },
          { no: 'Hvor mye koster det?', en: 'How much does it cost?' },
        ],
      },
      {
        heading: 'hvor plus an adjective',
        body: 'Where English has separate words — how much, how many, how old — Norwegian builds them all from hvor.',
        examples: [
          { no: 'Hvor mye?', en: 'How much?' },
          { no: 'Hvor mange?', en: 'How many?' },
          { no: 'Hvor gammel er du?', en: 'How old are you?' },
          { no: 'Hvor lenge har du vært her?', en: 'How long have you been here?' },
        ],
      },
    ],
    vocab: [
      { no: 'et tog', en: 'a train', pos: 'noun', gender: 'n' },
      { no: 'å koste', en: 'to cost', pos: 'verb' },
      { no: 'lenge', en: 'for a long time', pos: 'adv' },
      { no: 'gammel', en: 'old', pos: 'adj' },
    ],
    practice: [
      { no: 'Hva heter du?', en: 'What is your name?' },
      { no: 'Hvor bor du?', en: 'Where do you live?' },
      { no: 'Snakker du engelsk?', en: 'Do you speak English?' },
      { no: 'Hvor mye koster det?', en: 'How much does it cost?' },
      { no: 'Når kommer toget?', en: 'When does the train come?' },
    ],
  },

  {
    id: 'nektelse',
    unitId: 'setninger',
    title: 'Ikke — å si nei',
    titleEn: 'Negation',
    summary: 'One word for "not", and a clear rule about where to put it.',
    minutes: 6,
    sections: [
      {
        heading: 'ikke follows the verb',
        body: 'In a normal main clause, ikke comes straight after the conjugated verb. No "do", no "does", no "did".',
        examples: [
          { no: 'Jeg forstår ikke.', en: 'I do not understand.' },
          { no: 'Han snakker ikke norsk.', en: 'He does not speak Norwegian.' },
          { no: 'Det er ikke sant.', en: 'That is not true.' },
        ],
      },
      {
        heading: 'With two verbs, ikke sits between them',
        body: 'When there is a modal or a perfect, ikke goes after the conjugated verb and before the infinitive or participle.',
        examples: [
          { no: 'Jeg kan ikke komme.', en: 'I cannot come.' },
          { no: 'Hun har ikke spist.', en: 'She has not eaten.' },
          { no: 'Vi skal ikke reise.', en: 'We are not going to travel.' },
        ],
      },
      {
        heading: 'After inversion, ikke follows the subject',
        body: 'If something has been fronted and the subject has moved behind the verb, ikke waits for the subject to go past.',
        examples: [
          { no: 'I dag kan jeg ikke komme.', en: 'Today I cannot come.' },
          { no: 'Dessverre har vi ikke tid.', en: 'Unfortunately we do not have time.' },
        ],
      },
      {
        heading: 'Other negatives',
        body: 'These behave like ikke and sit in the same slot.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['ikke', 'not'],
            ['aldri', 'never'],
            ['ingenting / ikke noe', 'nothing'],
            ['ingen', 'nobody, no'],
            ['ikke ennå', 'not yet'],
            ['heller ikke', 'not either'],
          ],
        },
        examples: [
          { no: 'Jeg har aldri vært der.', en: 'I have never been there.' },
          { no: 'Det er ingen her.', en: 'There is nobody here.' },
          { no: 'Jeg har ikke spist ennå.', en: 'I have not eaten yet.' },
        ],
      },
    ],
    vocab: [
      { no: 'sant', en: 'true', pos: 'adj' },
      { no: 'dessverre', en: 'unfortunately', pos: 'adv' },
      { no: 'tid', en: 'time', pos: 'noun', gender: 'f' },
      { no: 'ingenting', en: 'nothing' },
    ],
    practice: [
      { no: 'Jeg forstår ikke.', en: 'I do not understand.' },
      { no: 'Han snakker ikke norsk.', en: 'He does not speak Norwegian.' },
      { no: 'Jeg kan ikke komme i dag.', en: 'I cannot come today.' },
      { no: 'Jeg har aldri vært i Norge.', en: 'I have never been to Norway.' },
      { no: 'Vi har ikke tid.', en: 'We do not have time.' },
    ],
  },

  {
    id: 'leddsetninger',
    unitId: 'setninger',
    title: 'Leddsetninger — når ordstillingen snur',
    titleEn: 'Subordinate clauses',
    summary: 'After at, fordi, hvis, når and som, the word order changes: ikke moves in front of the verb.',
    minutes: 8,
    sections: [
      {
        heading: 'The joining words',
        body: 'A subordinate clause is one that cannot stand alone. It is introduced by one of these, and it plays by different word-order rules.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['at', 'that'],
            ['fordi', 'because'],
            ['hvis / dersom', 'if'],
            ['når', 'when (repeated or future)'],
            ['da', 'when (a single past event)'],
            ['som', 'who, which, that'],
            ['om', 'whether'],
            ['mens', 'while'],
            ['før', 'before'],
            ['etter at', 'after'],
          ],
        },
      },
      {
        heading: 'ikke jumps in front of the verb',
        body: 'This is the single difference to learn, and it is reliable: inside a subordinate clause, ikke and other short adverbs come before the conjugated verb rather than after it.',
        examples: [
          { no: 'Jeg kommer ikke.', en: 'I am not coming.', note: 'main clause — ikke after the verb' },
          { no: 'Han sier at han ikke kommer.', en: 'He says that he is not coming.', note: 'subordinate — ikke before the verb' },
          { no: 'Jeg lærer norsk fordi jeg ikke vil bruke engelsk.', en: 'I am learning Norwegian because I do not want to use English.' },
        ],
      },
      {
        heading: 'A subordinate clause at the front counts as one element',
        body: 'Put the whole clause first and V2 still applies to the main clause — so the main verb comes immediately after it.',
        examples: [
          { no: 'Hvis du vil, kan vi gå.', en: 'If you want, we can go.', note: 'kan comes straight after the clause' },
          { no: 'Når jeg er ferdig, ringer jeg deg.', en: 'When I am finished, I will call you.' },
          { no: 'Fordi det regnet, ble vi hjemme.', en: 'Because it was raining, we stayed home.' },
        ],
      },
      {
        heading: 'når or da?',
        body: 'Both translate as "when", and the split is clean. Use da for one specific completed event in the past; use når for the future, the present, or anything that happens repeatedly.',
        examples: [
          { no: 'Da jeg var barn, bodde vi i Bergen.', en: 'When I was a child, we lived in Bergen.', note: 'one past stretch — da' },
          { no: 'Når jeg kommer hjem, spiser jeg.', en: 'When I get home, I eat.', note: 'every time — når' },
          { no: 'Ring meg når du er ferdig.', en: 'Call me when you are finished.', note: 'future — når' },
        ],
      },
    ],
    vocab: [
      { no: 'å ringe', en: 'to call, to phone', pos: 'verb' },
      { no: 'ferdig', en: 'finished, ready', pos: 'adj' },
      { no: 'å regne', en: 'to rain', pos: 'verb' },
      { no: 'å bruke', en: 'to use', pos: 'verb' },
    ],
    practice: [
      { no: 'Han sier at han ikke kommer.', en: 'He says that he is not coming.' },
      { no: 'Hvis du vil, kan vi gå.', en: 'If you want, we can go.' },
      { no: 'Ring meg når du er ferdig.', en: 'Call me when you are finished.' },
      { no: 'Da jeg var barn, bodde vi i Bergen.', en: 'When I was a child, we lived in Bergen.' },
      { no: 'Jeg lærer norsk fordi jeg vil bo i Norge.', en: 'I am learning Norwegian because I want to live in Norway.' },
    ],
  },
]
