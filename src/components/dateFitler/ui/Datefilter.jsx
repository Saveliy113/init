import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Calendar } from 'lucide-react';
import { ru } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from './dateFilter.module.scss';
import './dateRangeAdaptive.scss';
import { ruStaticInputRanges, ruStaticRanges } from '../model/staticRanges';

const Datefilter = ({ dateRange, setDateRange }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleSelect = (date) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: date.selection.startDate,
      endDate: date.selection.endDate,
    }));
    setIsOpened(!isOpened);
  };

  const toggleDateFilter = () => setIsOpened(!isOpened);

  let labelText = '';

  if (dateRange.startDate && dateRange.endDate) {
    labelText =
      dateRange?.startDate.toLocaleDateString() +
      ' — ' +
      dateRange?.endDate.toLocaleDateString();
  }

  return (
    <div className={styles.date__wrapper}>
      <div
        className={styles.date__preview}
        onClick={(event) => {
          event.stopPropagation();
          toggleDateFilter();
        }}
      >
        <Calendar />
        {labelText ? labelText : <span>Выберите дату</span>}
      </div>

      {isOpened && (
        <DateRangePicker
          className={styles.dateRangePicker}
          ranges={[dateRange]}
          staticRanges={ruStaticRanges}
          inputRanges={ruStaticInputRanges}
          locale={ru}
          onChange={handleSelect}
          startDatePlaceholder={'mm.dd.yyyy'}
          endDatePlaceholder={'mm.dd.yyyy'}
        />
      )}
    </div>
  );
};

export default Datefilter;
