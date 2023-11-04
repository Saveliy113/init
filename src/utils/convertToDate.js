export default function convertToDate(dateString) {
  const year = Number(dateString.slice(6, 10));
  const month = Number(dateString.slice(3, 5)) - 1;
  const day = Number(dateString.slice(0, 2));

  return new Date(year, month, day);
}
