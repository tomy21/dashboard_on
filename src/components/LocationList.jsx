import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function LocationList({
  data,
  onSelectLocation,
  onSelectNameLocation,
}) {
  if (!data || data.length === 0) {
    return <p>No location data available.</p>;
  }

  const options = [
    { value: "", label: "Selected All" }, // Opsi "Selected All" dengan value kosong
    ...data.map((location) => ({
      value: location.Code,
      label: location.Name,
    })),
  ];

  const handleChange = (selectedOption) => {
    onSelectLocation(selectedOption.value);
    onSelectNameLocation(selectedOption.label);
  };

  return (
    <Select
      closeMenuOnSelect={true}
      components={animatedComponents}
      defaultValue={"selected"}
      onChange={handleChange}
      options={options}
      className="w-1/2 md:min-w-[20vw] md:max-w-[30vw] text-xs text-black z-10 border-slate-300 text-start"
    />
  );
}
