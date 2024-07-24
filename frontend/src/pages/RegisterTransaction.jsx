import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import api from "../api/api";
import dayjs from "dayjs";

import { getTimeDifferenceInHours } from "../utils/dateUtils";

const RegisterTransaction = () => {
  const [filters, setFilters] = useState({
    store_id: "",
    employee_id: "",
    start_date: dayjs().format("YYYY-MM-DD"),
    // end date = start date + 1
    end_date: dayjs().add(1, "day").format("YYYY-MM-DD"),
  });

  const { storeId } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [message, setMessage] = useState("");
  const [buttonMessage, setButtonMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("primary");

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      store_id: storeId,
    }));
  }, [storeId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/stores/", {
          params: { store_id: storeId },
        });
        setStoreName(response.data[0].name);
      } catch (error) {}
    };
    fetchEmployees();
  }, [storeId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees/", {
          params: { store_id: storeId },
        });
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [storeId]);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      employee_id: selectedEmployeeId,
    }));
  }, [selectedEmployeeId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { start_date, end_date, store_id, employee_id } = filters;
        const response = await api.get("/transactions/", {
          params: { start_date, end_date, store_id, employee_id },
        });
        const event = response.data.transactions[0];
        if (!event) {
          setMessage("아직 출근하지 않았습니다");
          setButtonMessage("출근");
          setButtonColor("primary");
        } else {
          if (event.check_in && !event.check_out) {
            setMessage(
              `${getTimeDifferenceInHours(event.check_in).toFixed(
                0
              )} 시간 동안 출근 중입니다`
            );
            setButtonColor("warning");
            setButtonMessage("퇴근");
          } else if (event.check_in && event.check_out) {
            setMessage("오늘 근무를 이미 마치셨습니다");
            setButtonMessage("연장근무");
          }
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, [filters]);

  const handleRegister = async () => {
    if (!selectedEmployeeId) {
      alert("직원을 선택해주세요.");
      return;
    }

    try {
      await api.post("/transactions/", {
        employee_id: selectedEmployeeId,
        store_id: storeId,
      });
      alert("Transaction registered successfully.");
    } catch (error) {
      console.error("Failed to register transaction:", error);
      alert("Failed to register transaction.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      style={{
        display: "flex",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        maxWidth="sm"
        sx={{
          marginTop: "2rem",
          height: "60vh", // Adjust the height to make it slightly above center
          minHeight: "500px",
          width: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #F4F5F6",
          borderRadius: "16px",
          backgroundColor: "white",
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
        }}
      >
        <Box textAlign="center" mb={4}>
          <img
            src="/logo.svg"
            alt="Description"
            style={{ width: "200px", maxWidth: "100%", height: "auto" }}
          />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          파스쿠찌 {storeName}점
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          {message}
        </Typography>
        <TextField
          select
          name="employee_id"
          label="직원명"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          fullWidth
          margin="normal"
          style={{ maxWidth: "300px" }} // Adjust the width of TextField
        >
          {employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color={buttonColor}
          onClick={handleRegister}
          fullWidth
          style={{
            marginTop: "1rem",
            maxWidth: "300px", // Adjust the width of Button
            borderRadius: "20px", // Make button corners more rounded
            padding: "12px 20px", // Increase the padding for larger size
            fontSize: "16px", // Increase the font size
          }}
        >
          {buttonMessage}
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterTransaction;
