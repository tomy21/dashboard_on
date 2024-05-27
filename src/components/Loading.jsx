import React from "react";
import { ScaleLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <ScaleLoader size={150} color={"#ffff"} loading={true} />
    </div>
  );
};

export default Loading;
