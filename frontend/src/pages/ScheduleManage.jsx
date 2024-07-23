// src/pages/ScheduleManager.js
import React, { useState, useEffect } from "react";
import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import api from "../api/api";
import { Container, Typography, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";

const ScheduleManager = () => {
  const [filters, setFilters] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1, // dayjs의 month는 0부터 시작하므로 1을 더해줍니다.
    store_id: "",
    employee_id: "",
    start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
    end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const [events, setEvents] = useState([]);
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores/");
        setStores(response.data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (filters.store_id) {
      const fetchEmployees = async () => {
        try {
          const response = await api.get("/employees/", {
            params: { store_id: filters.store_id },
          });
          setEmployees(response.data);
        } catch (error) {
          console.error("Failed to fetch employees:", error);
        }
      };

      fetchEmployees();
    }
  }, [filters.store_id]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { start_date, end_date, store_id, employee_id } = filters;
        const response = await api.get("/transactions/", {
          params: { start_date, end_date, store_id, employee_id },
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

  const handleMonthChange = (direction) => {
    setFilters((prevFilters) => {
      const newDate = dayjs(`${prevFilters.year}-${prevFilters.month}-01`).add(
        direction,
        "month"
      );
      return {
        ...prevFilters,
        year: newDate.year(),
        month: newDate.month() + 1,
        start_date: newDate.startOf("month").format("YYYY-MM-DD"),
        end_date: newDate.endOf("month").format("YYYY-MM-DD"),
      };
    });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => handleMonthChange(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom>
          {filters.year}년 {filters.month}월
        </Typography>
        <IconButton onClick={() => handleMonthChange(1)}>
          <ArrowForward />
        </IconButton>
      </div>
      <EventFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        stores={stores}
        employees={employees}
      />
      <EventList events={events} />
    </Container>
  );
};

export default ScheduleManager;
