const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, (x) => x.toUpperCase());
  return capitalized;
};

export {capitalizeWords};