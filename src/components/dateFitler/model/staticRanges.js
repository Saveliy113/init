import { defaultStaticRanges, defaultInputRanges } from 'react-date-range';

export const ruStaticRanges = [];
export const ruStaticInputRanges = [];

const ruMap = new Map([
  ['today', 'Сегодня'],
  ['yesterday', 'Завтра'],
  ['this week', 'Текущая неделя'],
  ['last week', 'Прошлая неделя'],
  ['this month', 'Текущий месяц'],
  ['last month', 'Прошылый месяц'],
  ['days up to today', 'дней до сегодня'],
  ['days starting today', 'дней от сегодня'],
]);

defaultInputRanges.forEach((range) => {
  let label = range.label;

  if (ruMap.has(label.toLowerCase())) {
    label = ruMap.get(label.toLowerCase());
  }

  ruStaticInputRanges.push({
    ...range,
    label,
  });
});

defaultStaticRanges.forEach((range) => {
  let label = range.label;
  if (ruMap.has(label.toLowerCase())) {
    label = ruMap.get(label.toLowerCase());
  }

  ruStaticRanges.push({
    label,
    hasCustomRendering: range.hasCustomRendering,
    isSelected: range.isSelected,
    range: range.range,
  });
});
