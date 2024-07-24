import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function toLocalTime(utcTime) {
  const localTime = new Date(utcTime);
  return localTime.toLocaleString(); // 로컬 시간 형식으로 변환
}

const calculatePay = (hourSums) => {
  return (hourSums * 10000).toFixed(2);
};

const EventSummary = ({ events }) => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const res = {};
    events.forEach((event) => {
      if (event.check_in && event.check_out) {
        if (!res[event.employee_name]) {
          res[event.employee_name] = { days: 0, hours: 0, store_name: "" };
        }
        res[event.employee_name]["hours"] +=
          (new Date(event.check_out) - new Date(event.check_in)) /
          (1000 * 60 * 60);
        res[event.employee_name]["days"] += 1;
        res[event.employee_name]["store_name"] = event.store_name;
      }
      setSummary(res);
      console.log(res);
    });
  }, [events]);

  return (
    <TableContainer style={{ borderRadius: "0px 0px 30px 30px",  boxShadow:"rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px" }}>
      <Table>
        <TableHead>
          <TableRow
            style={{
              backgroundColor: "#F4F6F8",
            }}
          >
            <TableCell>점포명</TableCell>
            <TableCell>직원명</TableCell>
            <TableCell>총 근무일 수</TableCell>
            <TableCell>총 근무시간</TableCell>
            <TableCell>총 금액</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(summary).length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: "center" }}>
                출근 기록이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(summary).map(
              ([employeeName, data], index, array) => (
                <TableRow key={employeeName}>
                  <TableCell
                    style={{
                      borderBottom:
                        index === array.length - 1
                          ? "none"
                          : "1px solid #E0E0E0",
                    }}
                  >
                    {data.store_name}
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom:
                        index === array.length - 1
                          ? "none"
                          : "1px solid #E0E0E0",
                    }}
                  >
                    {employeeName}
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom:
                        index === array.length - 1
                          ? "none"
                          : "1px solid #E0E0E0",
                    }}
                  >
                    {data.days}
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom:
                        index === array.length - 1
                          ? "none"
                          : "1px solid #E0E0E0",
                    }}
                  >
                    {data.hours.toFixed(2)} 시간
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom:
                        index === array.length - 1
                          ? "none"
                          : "1px solid #E0E0E0",
                    }}
                  >
                    {calculatePay(data.hours)} 원
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventSummary;
