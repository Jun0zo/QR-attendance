// src/components/EventFilters.js
import React from "react";
import { TextField, MenuItem, Box } from "@mui/material";

function EventFilters({ filters, handleFilterChange, stores, employees }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFilterChange({ [name]: value });
  };

  return (
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      <TextField
        select
        name="store_id"
        label="점포명"
        value={filters.store_id}
        onChange={handleChange}
        helperText="점포를 선택해주세요"
      >
        {stores.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        name="employee_id"
        label="직원명"
        value={filters.employee_id}
        onChange={handleChange}
        helperText="직원 이름을 선택해주세요"
        disabled={!filters.store_id} // store가 선택되지 않으면 비활성화
      >
        {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default EventFilters;
