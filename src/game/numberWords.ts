const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

/** 42 -> "forty-two" (supports 0..99). */
export function numberToWords(n: number): string {
  if (n < 20) return ONES[n];
  const tens = TENS[Math.floor(n / 10)];
  const ones = n % 10;
  return ones ? `${tens}-${ONES[ones]}` : tens;
}

const PHRASES = [
  'Boo! It\'s…',
  'Abracadabra!',
  'Spooky number…',
  'The cauldron says…',
  'Hocus pocus!',
  'Eek! It\'s…',
  'Trick or treat!',
];

export function randomPhrase(): string {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}
