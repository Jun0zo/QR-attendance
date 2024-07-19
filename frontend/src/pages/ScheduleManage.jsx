// src/pages/ScheduleManager.js
import React, { useState, useEffect } from "react";
import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import api from "../api/api";

function ScheduleManager() {
  const [filters, setFilters] = useState({
    year: "",
    month: "",
    store_id: "",
    employee_id: "",
    start_date: "",
    end_date: "",
  });

  const [events, setEvents] = useState([]);
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesResponse = await api.get("/stores/");
        const employeesResponse = await api.get("/employees/");
        setStores(storesResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("Failed to fetch stores or employees:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { year, month, store_id, employee_id, start_date, end_date } =
          filters;
        const response = await api.get("/transactions/", {
          params: { year, month, store_id, employee_id, start_date, end_date },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div>
      <h1>Schedule Manager</h1>
      <EventFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        stores={stores}
        employees={employees}
      />
      <EventList events={events} />
    </div>
  );
}

export default ScheduleManager;
