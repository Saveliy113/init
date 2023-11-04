import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, data } from '../assets/data';
import filterByDate from '../utils/filterByDate';
import { DateFilter } from '../components/dateFitler';

const FilterPage = () => {
  const [dateRange, setDateRange] = useState({
    key: 'selection',
    startDate: null,
    endDate: new Date(''),
  });

  const [rows, setRows] = useState(data);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const filteredData = filterByDate(
        data,
        dateRange.startDate,
        dateRange.endDate
      );
      setRows(filteredData);
    }
  }, [dateRange]);
  return (
    <div className="container">
      <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      />
    </div>
  );
};

export default FilterPage;
