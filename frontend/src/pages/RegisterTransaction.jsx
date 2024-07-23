// src/pages/RegisterTransaction.js
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

const RegisterTransaction = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

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

  const handleRegister = async () => {
    alert(selectedEmployeeId);
    if (!selectedEmployeeId) {
      alert("Please select an employee.");
      return;
    }

    try {
      await api.post("/transactions/", {
        employee_id: selectedEmployeeId,
        store_id: storeId,
      });
      alert("Transaction registered successfully.");
      // navigate("/");
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
      maxWidth="sm"
      style={{
        marginTop: "2rem",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
      <TextField
        select
        name="employee_id"
        label="직원명"
        value={selectedEmployeeId}
        onChange={(e) => setSelectedEmployeeId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
        style={{ marginTop: "1rem" }}
      >
        출근
      </Button>
    </Container>
  );
};

export default RegisterTransaction;
