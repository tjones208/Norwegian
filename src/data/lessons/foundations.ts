import type { Lesson } from '../../types'

/** Unit 1–2: the sounds of Norwegian, first conversations, and nouns. */
export const FOUNDATIONS: Lesson[] = [
  {
    id: 'alfabetet',
    unitId: 'lyder',
    title: 'Alfabetet og vokalene',
    titleEn: 'The alphabet and the vowels',
    summary: 'Norwegian has 29 letters and nine vowels. Three letters and four vowel sounds do not exist in English.',
    minutes: 6,
    sections: [
      {
        heading: 'Three extra letters',
        body: 'The Norwegian alphabet is the English one plus Æ, Ø and Å at the end. They are letters in their own right, not decorated versions of A and O, and they come last in any alphabetical list — so Ålesund is at the back of the phone book, not the front.',
        examples: [
          { no: 'æ', en: 'like the a in "cat"', note: 'være (to be), lære (to learn)' },
          { no: 'ø', en: 'like the i in "bird"', note: 'øye (eye), sønn (son)' },
          { no: 'å', en: 'like the o in "more"', note: 'år (year), gå (to go)' },
        ],
      },
      {
        heading: 'The nine vowels',
        body: 'Norwegian has nine vowel letters, and each has a long and a short version. The rule of thumb: a vowel is long before one consonant and short before two. That difference carries meaning — tak (roof) and takk (thanks) differ only in vowel length.',
        table: {
          caption: 'Vowel sounds, with the closest English approximation',
          head: ['Letter', 'Sounds like', 'Example', 'Meaning'],
          rows: [
            ['a', 'father', 'dag', 'day'],
            ['e', 'bed', 'seg', 'himself'],
            ['i', 'see', 'tid', 'time'],
            ['o', 'food (often)', 'bok', 'book'],
            ['u', 'a tighter, rounder "oo"', 'hus', 'house'],
            ['y', 'say "ee" with rounded lips', 'by', 'city'],
            ['æ', 'cat', 'her', 'here'],
            ['ø', 'bird', 'brød', 'bread'],
            ['å', 'more', 'språk', 'language'],
          ],
        },
      },
      {
        heading: 'Long and short, and why it matters',
        body: 'Doubling a consonant shortens the vowel before it. This is the single most common spelling pattern in Norwegian, and mixing it up changes the word.',
        examples: [
          { no: 'tak — takk', en: 'roof — thanks' },
          { no: 'lese — lesse', en: 'to read — to load' },
          { no: 'pen — penn', en: 'good-looking — pen' },
        ],
      },
    ],
    vocab: [
      { no: 'et år', en: 'a year', pos: 'noun', gender: 'n' },
      { no: 'et språk', en: 'a language', pos: 'noun', gender: 'n' },
      { no: 'en bok', en: 'a book', pos: 'noun', gender: 'f' },
      { no: 'et hus', en: 'a house', pos: 'noun', gender: 'n' },
      { no: 'en dag', en: 'a day', pos: 'noun', gender: 'm' },
      { no: 'takk', en: 'thanks' },
    ],
    practice: [
      { no: 'Jeg leser en bok.', en: 'I am reading a book.' },
      { no: 'Takk for i dag.', en: 'Thanks for today.' },
      { no: 'Norsk er et språk.', en: 'Norwegian is a language.' },
      { no: 'Huset er stort.', en: 'The house is big.' },
    ],
  },

  {
    id: 'uttale',
    unitId: 'lyder',
    title: 'Lyder som lurer deg',
    titleEn: 'Sounds that trick you',
    summary: 'A handful of spellings are not pronounced anything like they look. Learn these eight and most words will come out right.',
    minutes: 8,
    sections: [
      {
        heading: 'Letters that go silent',
        body: 'Norwegian drops more letters than English does. The d at the end of -ld, -nd and -rd is silent, the g in the ending -ig is silent, and the t in the neuter "the" ending -et is silent.',
        examples: [
          { no: 'land', en: 'country', note: 'said "lann" — no d' },
          { no: 'ord', en: 'word', note: 'said "or"' },
          { no: 'ferdig', en: 'finished', note: 'said "færdi" — no g' },
          { no: 'huset', en: 'the house', note: 'said "huse" — no t' },
        ],
      },
      {
        heading: 'sj, skj, and sk before a soft vowel',
        body: 'All of these are the English "sh". Note that sk only softens before i, y, øy or ei — before a, o, u and å it stays a hard "sk".',
        examples: [
          { no: 'skje', en: 'spoon — "sheh"' },
          { no: 'ski', en: 'ski — "shee"' },
          { no: 'stasjon', en: 'station — "sta-SHOON"' },
          { no: 'skole', en: 'school — hard sk, "SKOO-le"', note: 'o is not a soft vowel, so no softening' },
        ],
      },
      {
        heading: 'kj and gj',
        body: 'kj (and k before i, y or ei) is a sound English does not have: start to say "hue" and push the air through the middle of your tongue. gj (and g before i, y or ei) is simply an English "y".',
        examples: [
          { no: 'kjøre', en: 'to drive — the soft "hy" sound' },
          { no: 'kirke', en: 'church — k before i, so soft' },
          { no: 'gjøre', en: 'to do — said "YØ-re"' },
          { no: 'gi', en: 'to give — said "yee"' },
        ],
      },
      {
        heading: 'hv and rs',
        body: 'Question words mostly start with hv, where the h is silent. And when r meets s — inside a word or across two words — they merge into "sh" in eastern Norwegian.',
        examples: [
          { no: 'hva', en: 'what — said "va"' },
          { no: 'hvor', en: 'where — said "vor"' },
          { no: 'norsk', en: 'Norwegian — said "noshk"' },
          { no: 'er sen', en: 'is late — runs together as "æ-shen"' },
        ],
      },
      {
        heading: 'Small words that are said nothing like they are spelled',
        body: 'These are the most frequent words in the language, so the payoff for learning their real pronunciation is immediate.',
        table: {
          head: ['Written', 'Said', 'Meaning'],
          rows: [
            ['jeg', 'yei', 'I'],
            ['meg / deg / seg', 'mei / dei / sei', 'me / you / himself'],
            ['og', 'å', 'and'],
            ['også', 'OS-så', 'also'],
            ['det', 'de', 'it, that'],
            ['de', 'di', 'they'],
            ['mye', 'MY-e', 'much'],
          ],
        },
      },
    ],
    vocab: [
      { no: 'å kjøre', en: 'to drive', pos: 'verb' },
      { no: 'å gjøre', en: 'to do, to make', pos: 'verb' },
      { no: 'en skole', en: 'a school', pos: 'noun', gender: 'm' },
      { no: 'en kirke', en: 'a church', pos: 'noun', gender: 'f' },
      { no: 'hva', en: 'what' },
      { no: 'hvor', en: 'where' },
    ],
    practice: [
      { no: 'Hva gjør du?', en: 'What are you doing?' },
      { no: 'Jeg kjører til skolen.', en: 'I am driving to school.' },
      { no: 'Hvor er kirken?', en: 'Where is the church?' },
      { no: 'Jeg snakker norsk.', en: 'I speak Norwegian.' },
    ],
  },

  {
    id: 'hilsener',
    unitId: 'lyder',
    title: 'Hei! Å hilse og presentere seg',
    titleEn: 'Greetings and introducing yourself',
    summary: 'Enough to open and close a conversation, say who you are, and admit you did not catch that.',
    minutes: 7,
    sections: [
      {
        heading: 'Hello and goodbye',
        body: 'Hei works at any hour and with anyone — it is the default. The god- greetings are a little more formal, and Norwegians use them less than English speakers expect.',
        examples: [
          { no: 'Hei!', en: 'Hi! — use this one' },
          { no: 'God morgen.', en: 'Good morning.' },
          { no: 'God kveld.', en: 'Good evening.' },
          { no: 'Ha det bra!', en: 'Goodbye! — literally "have it good"' },
          { no: 'Vi ses!', en: 'See you!' },
        ],
      },
      {
        heading: 'Saying who you are',
        body: 'Norwegian uses å hete — "to be called" — where English uses "my name is". Learn the question and the answer as a pair.',
        examples: [
          { no: 'Hva heter du?', en: 'What is your name?' },
          { no: 'Jeg heter Thomas.', en: 'My name is Thomas.' },
          { no: 'Hvor kommer du fra?', en: 'Where are you from?' },
          { no: 'Jeg kommer fra USA.', en: 'I am from the USA.' },
          { no: 'Hyggelig å møte deg.', en: 'Nice to meet you.' },
        ],
      },
      {
        heading: 'How are you',
        body: 'Hvordan går det is the everyday version — literally "how goes it". The answer is short; Norwegians do not elaborate.',
        examples: [
          { no: 'Hvordan går det?', en: 'How are you?' },
          { no: 'Det går bra, takk.', en: 'Fine, thanks.' },
          { no: 'Bare bra.', en: 'Just fine.' },
          { no: 'Og med deg?', en: 'And you?' },
        ],
      },
      {
        heading: 'When you are lost',
        body: 'These four sentences will carry you through your first months. Say them without apology — people switch to slow Norwegian rather than to English if you ask.',
        examples: [
          { no: 'Jeg snakker litt norsk.', en: 'I speak a little Norwegian.' },
          { no: 'Jeg forstår ikke.', en: 'I do not understand.' },
          { no: 'Kan du gjenta det?', en: 'Can you repeat that?' },
          { no: 'Kan du snakke saktere?', en: 'Can you speak more slowly?' },
          { no: 'Hva betyr det?', en: 'What does that mean?' },
        ],
      },
      {
        heading: 'Please and thank you',
        body: 'Norwegian has no single word for "please". Vær så snill is a real request ("be so kind"), but most of the time politeness lives in the verb: you say kan jeg få — "may I have".',
        examples: [
          { no: 'Takk!', en: 'Thanks!' },
          { no: 'Tusen takk!', en: 'Thank you very much! — "a thousand thanks"' },
          { no: 'Vær så god.', en: 'Here you go. / You are welcome.' },
          { no: 'Unnskyld.', en: 'Excuse me. / Sorry.' },
          { no: 'Kan jeg få en kaffe?', en: 'Could I have a coffee?' },
        ],
      },
    ],
    vocab: [
      { no: 'å hete', en: 'to be called', pos: 'verb' },
      { no: 'å forstå', en: 'to understand', pos: 'verb' },
      { no: 'å gjenta', en: 'to repeat', pos: 'verb' },
      { no: 'hyggelig', en: 'pleasant, nice', pos: 'adj' },
      { no: 'unnskyld', en: 'excuse me, sorry' },
      { no: 'sakte', en: 'slowly', pos: 'adv' },
    ],
    practice: [
      { no: 'Hei, jeg heter Thomas.', en: 'Hi, my name is Thomas.' },
      { no: 'Hvordan går det?', en: 'How are you?' },
      { no: 'Jeg forstår ikke.', en: 'I do not understand.' },
      { no: 'Kan du snakke saktere?', en: 'Can you speak more slowly?' },
      { no: 'Hyggelig å møte deg.', en: 'Nice to meet you.' },
      { no: 'Tusen takk!', en: 'Thank you very much!' },
    ],
  },

  {
    id: 'kjonn',
    unitId: 'substantiv',
    title: 'En, ei, et — kjønn',
    titleEn: 'Noun gender',
    summary: 'Every Norwegian noun is masculine, feminine or neuter. You learn the gender with the word, not from the word.',
    minutes: 7,
    sections: [
      {
        heading: 'Three genders, three words for "a"',
        body: 'There is no reliable way to guess a noun\'s gender from its meaning or its shape, so learn each noun together with its article — not bil but en bil. About half of all nouns are masculine, so when you truly cannot recall, en is the best guess.',
        table: {
          head: ['Gender', '"a"', 'Example', 'Meaning'],
          rows: [
            ['masculine', 'en', 'en bil', 'a car'],
            ['feminine', 'ei (or en)', 'ei bok', 'a book'],
            ['neuter', 'et', 'et hus', 'a house'],
          ],
        },
      },
      {
        heading: 'The feminine is optional',
        body: 'This surprises learners: in bokmål every feminine noun may also be treated as masculine. Ei bok and en bok are both correct. Written bokmål, and most of Oslo, leans masculine; dialects and spoken Norwegian keep the feminine alive. Pick one habit and stay consistent — using en everywhere is perfectly good Norwegian.',
        examples: [
          { no: 'ei jente / en jente', en: 'a girl — both correct' },
          { no: 'ei bok / en bok', en: 'a book — both correct' },
          { no: 'et hus', en: 'a house — neuter has no choice' },
        ],
      },
      {
        heading: 'Neuter is worth spotting early',
        body: 'Neuter nouns behave differently in three separate places — the definite ending, the plural, and adjective agreement — so the gender you most need to remember is which nouns are et-words.',
        examples: [
          { no: 'et barn — barnet — barn — barna', en: 'a child — the child — children — the children' },
          { no: 'et år — året — år — årene', en: 'a year — the year — years — the years' },
          { no: 'et eple — eplet — epler — eplene', en: 'an apple — the apple — apples — the apples' },
        ],
      },
    ],
    vocab: [
      { no: 'en bil', en: 'a car', pos: 'noun', gender: 'm' },
      { no: 'ei jente', en: 'a girl', pos: 'noun', gender: 'f' },
      { no: 'en gutt', en: 'a boy', pos: 'noun', gender: 'm' },
      { no: 'et barn', en: 'a child', pos: 'noun', gender: 'n' },
      { no: 'et eple', en: 'an apple', pos: 'noun', gender: 'n' },
      { no: 'en venn', en: 'a friend', pos: 'noun', gender: 'm' },
    ],
    practice: [
      { no: 'Jeg har en bil.', en: 'I have a car.' },
      { no: 'Det er et hus.', en: 'That is a house.' },
      { no: 'Hun har et barn.', en: 'She has a child.' },
      { no: 'Han er en venn.', en: 'He is a friend.' },
    ],
  },

  {
    id: 'bestemt',
    unitId: 'substantiv',
    title: 'Bestemt form — "the" på slutten',
    titleEn: 'The definite form',
    summary: 'Norwegian has no separate word for "the". It glues the article onto the end of the noun.',
    minutes: 7,
    sections: [
      {
        heading: 'The article moves to the back',
        body: 'This is the first real structural difference from English, and it is completely regular. Whatever you would put in front of the noun, Norwegian puts behind it.',
        table: {
          head: ['Gender', 'a ...', 'the ...', 'Meaning'],
          rows: [
            ['masculine', 'en bil', 'bilen', 'the car'],
            ['feminine', 'ei bok', 'boka', 'the book'],
            ['feminine as masc.', 'en bok', 'boken', 'the book'],
            ['neuter', 'et hus', 'huset', 'the house'],
          ],
        },
      },
      {
        heading: 'Nouns that already end in -e',
        body: 'You do not double the vowel. A noun ending in -e simply adds -n or -t.',
        examples: [
          { no: 'en gate → gata / gaten', en: 'a street → the street' },
          { no: 'et eple → eplet', en: 'an apple → the apple' },
          { no: 'en time → timen', en: 'an hour → the hour' },
        ],
      },
      {
        heading: 'Remember the silent t',
        body: 'The neuter ending -et is pronounced as if the t were not there. Huset is said "HU-se", ordet is "OR-e". Getting this right makes you sound dramatically more Norwegian than getting any grammar rule right.',
        examples: [
          { no: 'huset', en: 'the house — said "HU-se"' },
          { no: 'barnet', en: 'the child — said "BAR-ne"' },
          { no: 'året', en: 'the year — said "Å-re"' },
        ],
      },
    ],
    vocab: [
      { no: 'en gate', en: 'a street', pos: 'noun', gender: 'f' },
      { no: 'en time', en: 'an hour, a lesson', pos: 'noun', gender: 'm' },
      { no: 'et bord', en: 'a table', pos: 'noun', gender: 'n' },
      { no: 'en dør', en: 'a door', pos: 'noun', gender: 'f' },
      { no: 'et vindu', en: 'a window', pos: 'noun', gender: 'n' },
    ],
    practice: [
      { no: 'Bilen er rød.', en: 'The car is red.' },
      { no: 'Boka ligger på bordet.', en: 'The book is lying on the table.' },
      { no: 'Huset er stort.', en: 'The house is big.' },
      { no: 'Døra er åpen.', en: 'The door is open.' },
    ],
  },

  {
    id: 'flertall',
    unitId: 'substantiv',
    title: 'Flertall',
    titleEn: 'Plurals',
    summary: 'Add -er for more than one, -ene for "the" plural — with one big exception and a short list of irregulars.',
    minutes: 8,
    sections: [
      {
        heading: 'The regular pattern',
        body: 'Masculine and feminine nouns take -er in the plural and -ene in the definite plural. A noun already ending in -e just adds -r and -ne.',
        table: {
          head: ['a', 'the', 'some', 'the (plural)'],
          rows: [
            ['en bil', 'bilen', 'biler', 'bilene'],
            ['en venn', 'vennen', 'venner', 'vennene'],
            ['en gate', 'gata', 'gater', 'gatene'],
          ],
        },
      },
      {
        heading: 'The neuter exception',
        body: 'Short neuter nouns — one syllable — do not change at all in the indefinite plural. Et hus is "a house"; hus on its own is "houses". Only the definite plural gets an ending.',
        table: {
          head: ['a', 'the', 'some', 'the (plural)'],
          rows: [
            ['et hus', 'huset', 'hus', 'husene'],
            ['et år', 'året', 'år', 'årene'],
            ['et barn', 'barnet', 'barn', 'barna'],
          ],
        },
        examples: [
          { no: 'Jeg har to barn.', en: 'I have two children.', note: 'barn, not "barner"' },
          { no: 'Det er mange hus her.', en: 'There are many houses here.' },
        ],
      },
      {
        heading: 'The irregulars worth memorising',
        body: 'A small group changes its vowel, much like English foot/feet. These are all extremely common words, so learning the list is a good investment.',
        table: {
          head: ['Singular', 'Plural', 'Definite plural', 'Meaning'],
          rows: [
            ['en mann', 'menn', 'mennene', 'man / men'],
            ['ei bok', 'bøker', 'bøkene', 'book / books'],
            ['en far', 'fedre', 'fedrene', 'father / fathers'],
            ['ei mor', 'mødre', 'mødrene', 'mother / mothers'],
            ['en bror', 'brødre', 'brødrene', 'brother / brothers'],
            ['ei søster', 'søstre', 'søstrene', 'sister / sisters'],
            ['ei hånd', 'hender', 'hendene', 'hand / hands'],
            ['en fot', 'føtter', 'føttene', 'foot / feet'],
            ['ei natt', 'netter', 'nettene', 'night / nights'],
            ['et tre', 'trær', 'trærne', 'tree / trees'],
            ['et øye', 'øyne', 'øynene', 'eye / eyes'],
          ],
        },
      },
    ],
    vocab: [
      { no: 'en mann', en: 'a man', pos: 'noun', gender: 'm' },
      { no: 'ei bok', en: 'a book', pos: 'noun', gender: 'f' },
      { no: 'en bror', en: 'a brother', pos: 'noun', gender: 'm' },
      { no: 'ei søster', en: 'a sister', pos: 'noun', gender: 'f' },
      { no: 'mange', en: 'many' },
    ],
    practice: [
      { no: 'Jeg har to brødre.', en: 'I have two brothers.' },
      { no: 'Det er mange hus her.', en: 'There are many houses here.' },
      { no: 'Bøkene ligger på bordet.', en: 'The books are lying on the table.' },
      { no: 'Hun har tre barn.', en: 'She has three children.' },
    ],
  },
]
