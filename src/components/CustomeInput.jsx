import PropTypes from 'prop-types';
import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const CustomInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
    <div className="relative">
        <input
            type="text"
            ref={ref} // Forwarding the ref to the input
            value={value} // Bind the value prop to the input value
            onClick={onClick} // Bind onClick handler
            onChange={onChange} // Bind onChange handler for changes in the input
            className="border border-gray-300 text-start text-xs items-center md:w-44 h-10 pl-8 pr-3 py-1 rounded-md w-full"
        />
        <FaRegCalendarAlt className="absolute top-3 left-2 text-gray-500" />
    </div>
));

// Menambahkan displayName untuk debugging
CustomInput.displayName = 'CustomInput';

CustomInput.propTypes = {
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CustomInput;
