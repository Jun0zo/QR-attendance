// src/components/EventFilters.js
import React from "react";
import { TextField, Button, MenuItem } from "@mui/material";

function EventFilters({ filters, handleFilterChange, stores, employees }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFilterChange({ [name]: value });
  };

  return (
    <div>
      <TextField
        name="year"
        label="Year"
        value={filters.year}
        onChange={handleChange}
      />
      <TextField
        name="month"
        label="Month"
        value={filters.month}
        onChange={handleChange}
      />
      <TextField
        select
        name="store_id"
        label="Store"
        value={filters.store_id}
        onChange={handleChange}
        helperText="Please select a store"
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
        label="Employee"
        value={filters.employee_id}
        onChange={handleChange}
        helperText="Please select an employee"
      >
        {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="start_date"
        label="Start Date"
        type="date"
        value={filters.start_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="end_date"
        label="End Date"
        type="date"
        value={filters.end_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Button onClick={() => handleFilterChange(filters)}>Apply Filters</Button>
    </div>
  );
}

export default EventFilters;
