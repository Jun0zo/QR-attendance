// src/components/EventList.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function calculateWorkHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const checkInTime = new Date(checkIn);
  const checkOutTime = new Date(checkOut);
  const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
  return workHours.toFixed(2); // 소수점 둘째 자리까지 표시
}

function toLocalTime(utcTime) {
  const localTime = new Date(utcTime);
  return localTime.toLocaleString(); // 로컬 시간 형식으로 변환
}

function EventList({ events }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>직원명</TableCell>
            <TableCell>출근시간</TableCell>
            <TableCell>퇴근시간</TableCell>
            <TableCell>총 근무시간</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.employee_name}</TableCell>
              <TableCell>
                {event.check_in ? toLocalTime(event.check_in) : "-"}
              </TableCell>
              <TableCell>
                {event.check_out ? toLocalTime(event.check_out) : "-"}
              </TableCell>
              <TableCell>
                {event.check_in && event.check_out
                  ? calculateWorkHours(event.check_in, event.check_out)
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventList;
