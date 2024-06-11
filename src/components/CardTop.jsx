import React from "react";

export default function CardTop({ title, value }) {
  return (
    <div>
      <div className="border border-slate-400 bg-white shadow-md rounded-md w-52 h-32 text-start px-3 py-2">
        <h1 className="text-sm font-medium mb-2 text-gray-400">{title}</h1>
        <hr />
        <p className="text-xl font-bold my-3">{value}</p>
        {/* <p className={`text-xs ${avg < 1 ? "text-red-500" : "text-green-500"}`}>
          {avg}% <span className="text-gray-400">from {from}</span>
        </p> */}
      </div>
    </div>
  );
}
