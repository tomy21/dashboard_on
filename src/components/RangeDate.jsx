import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function RangeDate({ startDate, endDate, handleDateChange }) {
  return (
    <div>
      <div className="relative z-20">
        <DatePicker
          id="rangeDate"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          isClearable={true}
          className="border border-gray-300 text-start text-xs items-center w-56 h-10 pl-8 pr-3 py-1 rounded-md"
          dateFormat={"yyyy-MM-dd"}
        />
        <FaRegCalendarAlt className="absolute top-3 left-3 text-gray-500" />
        {/* <FaAngleDown className="absolute top-3 right-1 text-gray-500" /> */}
      </div>
    </div>
  );
}
