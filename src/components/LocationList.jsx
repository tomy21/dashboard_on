import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function LocationList({
    data,
    onSelectLocation,
    onSelectNameLocation,
}) {
    console.log(data);
    const options = [
        { value: '', label: 'Selected All' },
        ...(Array.isArray(data)
            ? data.map((location) => ({
                  value: location.RefLocation.Code,
                  label: location.RefLocation.Name,
              }))
            : data.RefLocation && Array.isArray(data.RefLocation)
            ? data.RefLocation.map((location) => ({
                  value: location.Code,
                  label: location.Name,
              }))
            : [{ value: 'no-data', label: 'No Data Available' }]),
    ];

    const handleChange = (selectedOption) => {
        onSelectLocation(selectedOption.value);
        onSelectNameLocation(selectedOption.label);
    };

    return (
        <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            defaultValue={'selected'}
            onChange={handleChange}
            options={options}
            className="w-[60%] md:min-w-[20vw] md:max-w-[20vw] sm:min-w-[20vw] text-xs text-black z-10 border-slate-300 text-start"
        />
    );
}

LocationList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectLocation: PropTypes.func.isRequired,
    onSelectNameLocation: PropTypes.func.isRequired,
};
