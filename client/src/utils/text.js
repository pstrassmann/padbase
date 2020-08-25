const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, (x) => x.toUpperCase());
  return capitalized;
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

export {capitalizeWords, numbersOnly, removeSpacesAndPunctuation};