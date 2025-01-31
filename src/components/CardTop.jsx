import PropTypes from 'prop-types';
import React from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

export default function CardTop({ title, value }) {
    return (
        <div className="w-full">
            <div
                className={`border shadow-md rounded-md h-24 md:w-72 md:h-32 w-full sm:w-full text-start px-3 py-2 
            ${
                title === 'Transaksi POST' || title === 'Ceklist Kendaraan'
                    ? 'bg-gradient-to-br from-amber-500 to-amber-400 border-gradient-to-br '
                    : 'bg-white border-slate-200'
            }`}
            >
                <div className="flex justify-between items-center w-full flex-wrap">
                    <h1
                        className={`text-xs md:text-base font-medium mb-2 
                    ${
                        title === 'Transaksi POST' ||
                        title === 'Ceklist Kendaraan'
                            ? 'text-white'
                            : 'text-gray-400'
                    }`}
                    >
                        {title}
                    </h1>
                    <HiOutlineDotsVertical className="text-gray-500" />
                </div>

                <p className="text-2xl font-semibold my-3 break-words">
                    {value}
                </p>
            </div>
        </div>
    );
}

CardTop.propTypes = {
    title: PropTypes.string.isRequired, // `title` harus berupa string dan wajib
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // `value` bisa string atau number, wajib
    avg: PropTypes.number, // `avg` adalah number (opsional)
    from: PropTypes.string, // `from` adalah string (opsional)
};
