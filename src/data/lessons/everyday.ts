import type { Lesson } from '../../types'

/** Units 7–8: numbers, time, and the Norwegian of ordinary life. */
export const EVERYDAY: Lesson[] = [
  {
    id: 'tall',
    unitId: 'tall',
    title: 'Tall',
    titleEn: 'Numbers',
    summary: 'Count to a thousand. Two numbers are not pronounced as written, and prices are where you will need them first.',
    minutes: 7,
    sections: [
      {
        heading: 'Zero to twenty',
        body: 'Note seksten and sytten: the k and the first t are not pronounced, giving "seisten" and "søtten".',
        table: {
          head: ['#', 'Norwegian', '#', 'Norwegian'],
          rows: [
            ['0', 'null', '11', 'elleve'],
            ['1', 'én / ett', '12', 'tolv'],
            ['2', 'to', '13', 'tretten'],
            ['3', 'tre', '14', 'fjorten'],
            ['4', 'fire', '15', 'femten'],
            ['5', 'fem', '16', 'seksten — "seisten"'],
            ['6', 'seks', '17', 'sytten — "søtten"'],
            ['7', 'sju (syv)', '18', 'atten'],
            ['8', 'åtte', '19', 'nitten'],
            ['9', 'ni', '20', 'tjue'],
            ['10', 'ti', '21', 'tjueen'],
          ],
        },
      },
      {
        heading: 'Tens and beyond',
        body: 'Above twenty, say the tens then the units, as in English: tjueen, trettifem, åttisju.',
        table: {
          head: ['#', 'Norwegian', '#', 'Norwegian'],
          rows: [
            ['30', 'tretti', '80', 'åtti'],
            ['40', 'førti', '90', 'nitti'],
            ['50', 'femti', '100', 'hundre'],
            ['60', 'seksti', '1 000', 'tusen'],
            ['70', 'sytti', '1 000 000', 'en million'],
          ],
        },
        examples: [
          { no: 'trettifem', en: 'thirty-five' },
          { no: 'to hundre og femti', en: 'two hundred and fifty' },
          { no: 'nitten hundre og åttifire', en: 'nineteen eighty-four' },
        ],
      },
      {
        heading: 'én or ett?',
        body: 'The number one agrees with gender, like the article: én for masculine and feminine, ett for neuter. In counting aloud you say "én, to, tre".',
        examples: [
          { no: 'én bil', en: 'one car' },
          { no: 'ett hus', en: 'one house' },
          { no: 'Jeg har bare ett spørsmål.', en: 'I have only one question.' },
        ],
      },
      {
        heading: 'Ordinals and prices',
        body: 'Ordinals are used for dates and floors. For money, kroner is usually shortened to kroner or just left off when the context is obvious.',
        table: {
          head: ['Ordinal', 'English'],
          rows: [
            ['første', 'first'],
            ['andre', 'second'],
            ['tredje', 'third'],
            ['fjerde', 'fourth'],
            ['femte', 'fifth'],
            ['tiende', 'tenth'],
          ],
        },
        examples: [
          { no: 'Hvor mye koster det?', en: 'How much does it cost?' },
          { no: 'Det koster hundre og femti kroner.', en: 'It costs a hundred and fifty kroner.' },
          { no: 'Jeg bor i tredje etasje.', en: 'I live on the third floor.' },
        ],
      },
    ],
    vocab: [
      { no: 'et spørsmål', en: 'a question', pos: 'noun', gender: 'n' },
      { no: 'en krone', en: 'a krone (currency)', pos: 'noun', gender: 'f' },
      { no: 'en etasje', en: 'a floor, a storey', pos: 'noun', gender: 'm' },
      { no: 'å koste', en: 'to cost', pos: 'verb' },
    ],
    practice: [
      { no: 'Hvor mye koster det?', en: 'How much does it cost?' },
      { no: 'Det koster hundre kroner.', en: 'It costs a hundred kroner.' },
      { no: 'Jeg har to barn.', en: 'I have two children.' },
      { no: 'Jeg er førtifem år.', en: 'I am forty-five years old.' },
    ],
  },

  {
    id: 'klokka',
    unitId: 'tall',
    title: 'Klokka, dager og måneder',
    titleEn: 'Time, days and months',
    summary: 'Telling time in Norwegian runs half an hour ahead of English. Get halv right and the rest follows.',
    minutes: 8,
    sections: [
      {
        heading: 'halv means half TO, not half PAST',
        body: 'This catches every English speaker at least once, usually while missing a train. Halv tre is 2:30 — half way to three, not half past three. Read it as looking forward to the coming hour.',
        examples: [
          { no: 'Klokka er halv tre.', en: 'It is 2:30.', note: 'NOT 3:30' },
          { no: 'Klokka er halv ni.', en: 'It is 8:30.' },
          { no: 'Vi møtes klokka halv sju.', en: 'We are meeting at 6:30.' },
        ],
      },
      {
        heading: 'The rest of the clock',
        body: 'Over and på work like "past" and "to". Quarters use kvart.',
        table: {
          head: ['Time', 'Norwegian'],
          rows: [
            ['3:00', 'klokka tre'],
            ['3:10', 'ti over tre'],
            ['3:15', 'kvart over tre'],
            ['3:25', 'fem på halv fire'],
            ['3:30', 'halv fire'],
            ['3:35', 'fem over halv fire'],
            ['3:45', 'kvart på fire'],
            ['3:50', 'ti på fire'],
          ],
        },
        examples: [
          { no: 'Hva er klokka?', en: 'What time is it?' },
          { no: 'Klokka er kvart over ni.', en: 'It is a quarter past nine.' },
          { no: 'Når begynner det? Klokka sju.', en: 'When does it start? At seven.' },
        ],
      },
      {
        heading: 'Days of the week',
        body: 'Days and months are written in lower case in Norwegian, unlike English. Use på for a specific day.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['mandag', 'Monday'],
            ['tirsdag', 'Tuesday'],
            ['onsdag', 'Wednesday'],
            ['torsdag', 'Thursday'],
            ['fredag', 'Friday'],
            ['lørdag', 'Saturday'],
            ['søndag', 'Sunday'],
          ],
        },
        examples: [
          { no: 'Vi ses på fredag.', en: 'See you on Friday.' },
          { no: 'Jeg jobber hver mandag.', en: 'I work every Monday.' },
        ],
      },
      {
        heading: 'Months, seasons and the days around today',
        body: 'For seasons, om sommeren means "in the summer" as a general habit, while i sommer means this particular summer.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['januar, februar, mars, april', 'January – April'],
            ['mai, juni, juli, august', 'May – August'],
            ['september, oktober, november, desember', 'September – December'],
            ['en vår / en sommer / en høst / en vinter', 'spring / summer / autumn / winter'],
            ['i dag / i morgen / i går', 'today / tomorrow / yesterday'],
            ['i kveld / i natt', 'this evening / tonight'],
            ['en uke / en måned / et år', 'a week / a month / a year'],
          ],
        },
        examples: [
          { no: 'Om sommeren reiser vi til Norge.', en: 'In the summer we travel to Norway.' },
          { no: 'Bursdagen min er i mai.', en: 'My birthday is in May.' },
        ],
      },
    ],
    vocab: [
      { no: 'ei klokke', en: 'a clock, a watch', pos: 'noun', gender: 'f' },
      { no: 'ei uke', en: 'a week', pos: 'noun', gender: 'f' },
      { no: 'en måned', en: 'a month', pos: 'noun', gender: 'm' },
      { no: 'en bursdag', en: 'a birthday', pos: 'noun', gender: 'm' },
      { no: 'å jobbe', en: 'to work', pos: 'verb' },
      { no: 'å møtes', en: 'to meet (each other)', pos: 'verb' },
    ],
    practice: [
      { no: 'Hva er klokka?', en: 'What time is it?' },
      { no: 'Klokka er halv tre.', en: 'It is half past two.' },
      { no: 'Vi ses på fredag.', en: 'See you on Friday.' },
      { no: 'Jeg jobber hver mandag.', en: 'I work every Monday.' },
      { no: 'Bursdagen min er i mai.', en: 'My birthday is in May.' },
    ],
  },

  {
    id: 'familie',
    unitId: 'hverdag',
    title: 'Familie og folk',
    titleEn: 'Family and people',
    summary: 'Talk about who is in your family, where you are from, and what you do.',
    minutes: 6,
    sections: [
      {
        heading: 'The family',
        body: 'Norwegian builds family words by compounding, so once you know far and mor the rest falls into place: beste- for grandparents, svi- for in-laws.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['en far / en pappa', 'father / dad'],
            ['ei mor / ei mamma', 'mother / mum'],
            ['foreldre', 'parents'],
            ['en sønn / ei datter', 'son / daughter'],
            ['en bror / ei søster', 'brother / sister'],
            ['en bestefar / ei bestemor', 'grandfather / grandmother'],
            ['en mann / ei kone', 'husband / wife'],
            ['en kjæreste', 'boyfriend, girlfriend, partner'],
            ['en venn / ei venninne', 'friend (male) / friend (female)'],
          ],
        },
      },
      {
        heading: 'Talking about yourself',
        body: 'These are the questions you will be asked first, and the answers are worth having ready as whole sentences.',
        examples: [
          { no: 'Jeg er gift.', en: 'I am married.' },
          { no: 'Vi har tre barn.', en: 'We have three children.' },
          { no: 'Jeg er fra USA, men jeg bor i Norge.', en: 'I am from the USA, but I live in Norway.' },
          { no: 'Jeg lærer norsk.', en: 'I am learning Norwegian.' },
          { no: 'Hva jobber du med?', en: 'What do you do for work?' },
        ],
      },
    ],
    vocab: [
      { no: 'ei kone', en: 'a wife', pos: 'noun', gender: 'f' },
      { no: 'en kjæreste', en: 'a partner, sweetheart', pos: 'noun', gender: 'm' },
      { no: 'gift', en: 'married', pos: 'adj' },
      { no: 'en bestefar', en: 'a grandfather', pos: 'noun', gender: 'm' },
    ],
    practice: [
      { no: 'Jeg har to brødre og ei søster.', en: 'I have two brothers and a sister.' },
      { no: 'Vi har tre barn.', en: 'We have three children.' },
      { no: 'Jeg er fra USA.', en: 'I am from the USA.' },
      { no: 'Hva jobber du med?', en: 'What do you do for work?' },
    ],
  },

  {
    id: 'mat',
    unitId: 'hverdag',
    title: 'Mat og drikke',
    titleEn: 'Food and drink',
    summary: 'Order in a café, shop for groceries, and say you are hungry.',
    minutes: 6,
    sections: [
      {
        heading: 'Everyday food words',
        body: 'Norwegians eat frokost (breakfast), lunsj (a light lunch, often bread), middag (the hot meal, often mid-afternoon) and kveldsmat (a light supper). Note that middag means dinner, not midday.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['et brød / ei brødskive', 'a loaf / a slice of bread'],
            ['en ost / et smør', 'cheese / butter'],
            ['ei melk / et vann', 'milk / water'],
            ['en kaffe / en te', 'coffee / tea'],
            ['en fisk / et kjøtt', 'fish / meat'],
            ['en potet / grønnsaker', 'a potato / vegetables'],
            ['ei suppe / en salat', 'soup / salad'],
            ['et egg / en frukt', 'an egg / fruit'],
          ],
        },
      },
      {
        heading: 'Ordering',
        body: 'The polite formula is kan jeg få ("may I have") or jeg vil gjerne ha ("I would like"). Gjerne is the word that makes a request friendly.',
        examples: [
          { no: 'Kan jeg få en kaffe, takk?', en: 'Could I have a coffee, please?' },
          { no: 'Jeg vil gjerne ha en kopp te.', en: 'I would like a cup of tea.' },
          { no: 'Hva anbefaler du?', en: 'What do you recommend?' },
          { no: 'Regningen, takk.', en: 'The bill, please.' },
          { no: 'Det smaker godt!', en: 'That tastes good!' },
        ],
      },
      {
        heading: 'Hungry and thirsty',
        body: 'Norwegian says you "are" hungry, as English does — but note that the adjective agrees if the subject is plural.',
        examples: [
          { no: 'Jeg er sulten.', en: 'I am hungry.' },
          { no: 'Jeg er tørst.', en: 'I am thirsty.' },
          { no: 'Er du sulten?', en: 'Are you hungry?' },
          { no: 'Vi er sultne.', en: 'We are hungry.' },
        ],
      },
    ],
    vocab: [
      { no: 'sulten', en: 'hungry', pos: 'adj' },
      { no: 'tørst', en: 'thirsty', pos: 'adj' },
      { no: 'ei regning', en: 'a bill', pos: 'noun', gender: 'f' },
      { no: 'å smake', en: 'to taste', pos: 'verb' },
      { no: 'gjerne', en: 'gladly, willingly', pos: 'adv' },
      { no: 'å anbefale', en: 'to recommend', pos: 'verb' },
    ],
    practice: [
      { no: 'Kan jeg få en kaffe, takk?', en: 'Could I have a coffee, please?' },
      { no: 'Jeg er sulten.', en: 'I am hungry.' },
      { no: 'Regningen, takk.', en: 'The bill, please.' },
      { no: 'Det smaker godt!', en: 'That tastes good!' },
    ],
  },

  {
    id: 'reise',
    unitId: 'hverdag',
    title: 'Reise og retning',
    titleEn: 'Travel and directions',
    summary: 'Ask the way, buy a ticket, and understand the answer you get back.',
    minutes: 7,
    sections: [
      {
        heading: 'Getting around',
        body: 'Note that Norwegian uses å ta for transport — man tar bussen, "one takes the bus" — and that the definite form is normal here.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['en buss / et tog', 'a bus / a train'],
            ['ei t-bane / en trikk', 'the metro / a tram'],
            ['et fly / en båt', 'a plane / a boat'],
            ['en billett', 'a ticket'],
            ['en stasjon / en flyplass', 'a station / an airport'],
            ['et kart', 'a map'],
          ],
        },
        examples: [
          { no: 'Jeg tar bussen til jobben.', en: 'I take the bus to work.' },
          { no: 'En billett til Bergen, takk.', en: 'One ticket to Bergen, please.' },
        ],
      },
      {
        heading: 'Asking the way',
        body: 'Start with unnskyld to get someone\'s attention — it is the all-purpose "excuse me".',
        examples: [
          { no: 'Unnskyld, hvor er stasjonen?', en: 'Excuse me, where is the station?' },
          { no: 'Hvordan kommer jeg til sentrum?', en: 'How do I get to the town centre?' },
          { no: 'Er det langt herfra?', en: 'Is it far from here?' },
          { no: 'Kan du vise meg på kartet?', en: 'Can you show me on the map?' },
        ],
      },
      {
        heading: 'Understanding the directions',
        body: 'The answer will use these. Learn them as a receiving skill — you need to recognise them at speed more than produce them.',
        table: {
          head: ['Norwegian', 'English'],
          rows: [
            ['til høyre', 'to the right'],
            ['til venstre', 'to the left'],
            ['rett fram', 'straight ahead'],
            ['tilbake', 'back'],
            ['forbi', 'past'],
            ['ved siden av', 'next to'],
            ['overfor', 'opposite'],
            ['i nærheten', 'nearby'],
          ],
        },
        examples: [
          { no: 'Gå rett fram og så til høyre.', en: 'Go straight ahead and then to the right.' },
          { no: 'Det er like ved.', en: 'It is right nearby.' },
        ],
      },
    ],
    vocab: [
      { no: 'en billett', en: 'a ticket', pos: 'noun', gender: 'm' },
      { no: 'et sentrum', en: 'a town centre', pos: 'noun', gender: 'n' },
      { no: 'å vise', en: 'to show', pos: 'verb' },
      { no: 'langt', en: 'far', pos: 'adv' },
      { no: 'et kart', en: 'a map', pos: 'noun', gender: 'n' },
    ],
    practice: [
      { no: 'Unnskyld, hvor er stasjonen?', en: 'Excuse me, where is the station?' },
      { no: 'En billett til Bergen, takk.', en: 'One ticket to Bergen, please.' },
      { no: 'Gå rett fram og så til høyre.', en: 'Go straight ahead and then to the right.' },
      { no: 'Hvordan kommer jeg til sentrum?', en: 'How do I get to the town centre?' },
    ],
  },

  {
    id: 'smaprat',
    unitId: 'hverdag',
    title: 'Vær og småprat',
    titleEn: 'Weather and small talk',
    summary: 'The weather is the safest conversation in Norway, and det carries most of the sentences.',
    minutes: 6,
    sections: [
      {
        heading: 'Weather sentences all start with det',
        body: 'Like English "it is raining", Norwegian uses det as a placeholder subject. Most weather verbs need nothing else.',
        examples: [
          { no: 'Det regner.', en: 'It is raining.' },
          { no: 'Det snør.', en: 'It is snowing.' },
          { no: 'Det blåser.', en: 'It is windy.' },
          { no: 'Det er sol i dag.', en: 'It is sunny today.' },
          { no: 'Det er kaldt ute.', en: 'It is cold outside.' },
        ],
      },
      {
        heading: 'Commenting on it',
        body: 'For et is the way to build an exclamation — "what a ...". Note the neuter -t on the adjective, agreeing with vær.',
        examples: [
          { no: 'For et fint vær!', en: 'What lovely weather!' },
          { no: 'Det er deilig ute i dag.', en: 'It is lovely outside today.' },
          { no: 'Det var kaldt i går.', en: 'It was cold yesterday.' },
          { no: 'Hvordan er været i morgen?', en: 'What is the weather like tomorrow?' },
        ],
      },
      {
        heading: 'Closing a conversation',
        body: 'Norwegians end exchanges briskly and warmly. Any of these works with a stranger or a friend.',
        examples: [
          { no: 'Ha en fin dag!', en: 'Have a nice day!' },
          { no: 'Ha det bra!', en: 'Goodbye!' },
          { no: 'Vi snakkes!', en: 'We will talk again!' },
          { no: 'Kos deg!', en: 'Enjoy yourself!' },
          { no: 'Lykke til!', en: 'Good luck!' },
        ],
      },
    ],
    vocab: [
      { no: 'et vær', en: 'weather', pos: 'noun', gender: 'n' },
      { no: 'kald', en: 'cold', pos: 'adj' },
      { no: 'varm', en: 'warm', pos: 'adj' },
      { no: 'deilig', en: 'lovely, delicious', pos: 'adj' },
      { no: 'ute', en: 'outside', pos: 'adv' },
      { no: 'å snø', en: 'to snow', pos: 'verb' },
    ],
    practice: [
      { no: 'Det regner i dag.', en: 'It is raining today.' },
      { no: 'Det er kaldt ute.', en: 'It is cold outside.' },
      { no: 'For et fint vær!', en: 'What lovely weather!' },
      { no: 'Ha en fin dag!', en: 'Have a nice day!' },
      { no: 'Hvordan er været i morgen?', en: 'What is the weather like tomorrow?' },
    ],
  },
]
