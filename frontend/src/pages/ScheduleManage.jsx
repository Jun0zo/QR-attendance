import React, { useState, useEffect } from "react";
import EventList from "../components/EventList";
import EventFilters from "../components/EventFilters";
import api from "../api/api";
import { Container, Typography, IconButton, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";
import EventSummary from "../components/EventSummary";

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
  const [secondsLeft, setSecondsLeft] = useState(60); // 남은 시간을 관리하는 상태

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

  const fetchEvents = async () => {
    try {
      const { start_date, end_date, store_id, employee_id } = filters;
      const params = { start_date, end_date };
      if (store_id) params.store_id = store_id;
      if (employee_id) params.employee_id = employee_id;

      const response = await api.get("/transactions/", {
        params,
      });

      setEvents(response.data.transactions);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();

    const intervalId = setInterval(() => {
      fetchEvents();
      setSecondsLeft(60); // 새로고침 시 남은 시간을 5초로 재설정
    }, 60000); // 1분마다 데이터를 다시 불러옴

    return () => clearInterval(intervalId);
  }, [filters]);

  useEffect(() => {
    const countdownId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000); // 1초마다 남은 시간을 1씩 줄임

    return () => clearInterval(countdownId);
  }, []);

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
      <Typography variant="subtitle1" component="p">
        {secondsLeft}초 후에 새로고침됩니다.
      </Typography>

      <EventFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        stores={stores}
        employees={employees}
      />
      <Box
        sx={{
          borderRadius: "30px",
          margin: "50px 0px",
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" sx={{ padding: "20px 20px" }}>
          요약
        </Typography>
        <EventSummary events={events} />
      </Box>

      <Box
        sx={{
          borderRadius: "30px",
          border: "1px solid #E0E0E0",
          margin: "50px 0px",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" sx={{ padding: "20px 20px" }}>
          요약
        </Typography>

        <EventList events={events} />
      </Box>
    </Container>
  );
};

export default ScheduleManager;
