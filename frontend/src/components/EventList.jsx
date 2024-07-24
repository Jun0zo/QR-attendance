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
  const workHours = (checkOutTime - checkInTime) / (1000 * 60);
  // 반올림하여 소수점 둘째 자리까지 표시
  return workHours.toFixed(0); // 소수점 둘째 자리까지 표시
}

function toLocalTime(utcTime) {
  const localTime = new Date(utcTime);
  return localTime.toLocaleString(); // 로컬 시간 형식으로 변환
}

function EventList({ events }) {
  return (
    <TableContainer 
    style={{ borderRadius: "0px 0px 30px 30px", 
    boxShadow:"rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
   }
    
    }>
      <Table>
        <TableHead style={{}}>
          <TableRow
            style={{
              backgroundColor: "#F4F6F8",
            }}
          >
            <TableCell>점포명</TableCell>
            <TableCell>직원명</TableCell>
            <TableCell>출근시간</TableCell>
            <TableCell>퇴근시간</TableCell>
            <TableCell>총 근무시간</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: "center" }}>
                출근 기록이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index, array) => (
              <TableRow key={event.id}>
                <TableCell
                  style={{
                    borderBottom:
                      index === array.length - 1 ? "none" : "1px solid #E0E0E0",
                  }}
                >
                  {event.store_name}
                </TableCell>
                <TableCell
                  style={{
                    borderBottom:
                      index === array.length - 1 ? "none" : "1px solid #E0E0E0",
                  }}
                >
                  {event.employee_name}
                </TableCell>
                <TableCell
                  style={{
                    borderBottom:
                      index === array.length - 1 ? "none" : "1px solid #E0E0E0",
                  }}
                >
                  {event.check_in ? toLocalTime(event.check_in) : "-"}
                </TableCell>
                <TableCell
                  style={{
                    borderBottom:
                      index === array.length - 1 ? "none" : "1px solid #E0E0E0",
                  }}
                >
                  {event.check_out ? toLocalTime(event.check_out) : "-"}
                </TableCell>
                <TableCell
                  style={{
                    borderBottom:
                      index === array.length - 1 ? "none" : "1px solid #E0E0E0",
                  }}
                >
                  {event.check_in && event.check_out
                    ? calculateWorkHours(event.check_in, event.check_out) + "분"
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventList;
