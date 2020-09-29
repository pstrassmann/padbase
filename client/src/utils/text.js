const capitalizeWords = (s) => {
  const lowers = ['a', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at',
    'by', 'for', 'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'with'];
  return s
    .split(' ')
    .map(w => {
      if (lowers.includes(w)) return w;
      return w ? w[0].toUpperCase() + w.substr(1) : w;
    })
    .join(' ')
};

const numbersOnly = (s) => {
  const re = /[^0-9]/g;
  const numbersOnly = s.replace(re, "")
  return (numbersOnly);
}

const removeSpacesAndPunctuation = (s) => {
  const re = /([^\ws])/g;
  const formattedString = s.replace(re, "")
  return formattedString;
}

// Escapes special characters from search
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export {capitalizeWords, numbersOnly, removeSpacesAndPunctuation, escapeRegExp};