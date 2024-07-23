// src/pages/ScheduleManager.js
import React, { useState, useEffect } from "react";
import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import api from "../api/api";
import { Container, Typography } from "@mui/material";

function ScheduleManagerDetailed() {
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
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Schedule Manager
      </Typography>
      <EventFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        stores={stores}
        employees={employees}
      />
      <EventList events={events} />
    </Container>
  );
}

export default ScheduleManagerDetailed;
