export const formatPrice = (price: string) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(price));

export const formatCapitilized = (str: string) => str.split(' ').map(word =>
    word.charAt(0).toLocaleUpperCase('tr') + word.slice(1).toLocaleLowerCase('tr')
).join(' ');