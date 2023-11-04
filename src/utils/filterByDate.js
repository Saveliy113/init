import convertToDate from './convertToDate';

export default function filterByDate(arr, start, end) {
  const filteredData = arr.filter((row) => {
    const rowDate = convertToDate(row.date);

    return rowDate >= start && rowDate <= end;
  });

  return filteredData;
}
