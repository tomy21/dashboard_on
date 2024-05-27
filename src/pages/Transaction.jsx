import React from "react";
import Navbar from "../components/Navbar";
import { DateTime } from "luxon";
import Table from "../components/Table";

export default function Transaction() {
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto h-[89vh] min-w-screen">
        <div className="flex justify-between mx-auto items-center ">
          <div className="flex flex-col my-2 text-start">
            <p className="text-base text-stone-500 font-medium">Transaction</p>
            <h1 className="text-sm">
              {DateTime.local().toFormat("EEEE, dd LLLL yyyy")}
            </h1>
          </div>
        </div>
        <div className="bg-white rounded-md p-2 mx-auto mt-2 w-full h-[76vh]">
          <Table />
        </div>
      </div>
    </>
  );
}
