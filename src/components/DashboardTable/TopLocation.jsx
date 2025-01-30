import PropTypes from 'prop-types';
import React from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { ScaleLoader } from 'react-spinners';

export default function TopLocation({ isLoading, data = [] }) {
    return (
        <table className="w-full bg-white rounded-lg">
            <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="text-left text-sm text-gray-600 px-4 py-3">
                        No
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-3">
                        Location
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-3">
                        Vendor
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-3">
                        Total ON
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-3"></th>
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="text-center px-4 py-6">
                            <div className="flex flex-col items-center justify-center">
                                <ScaleLoader
                                    size={50}
                                    color={'#FDAA10FF'}
                                    loading={true}
                                />
                                <p className="mt-3 text-sm text-gray-500">
                                    Loading...
                                </p>
                            </div>
                        </td>
                    </tr>
                ) : data.length > 0 ? (
                    data.map((item, index) => (
                        <tr
                            key={index}
                            className="border-b hover:bg-gray-50 transition duration-200"
                        >
                            <td className="px-4 py-4 text-sm text-gray-800">
                                {index + 1}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                {item.RefLocation?.Name || '-'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800">
                                {item.RefLocation?.Vendor || '-'}
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                                {item.total}
                            </td>
                            <td className="px-4 py-4 w-12 text-gray-500 hover:text-gray-700">
                                <HiOutlineDotsHorizontal size={20} />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={5}
                            className="text-center text-sm text-gray-600 px-4 py-5"
                        >
                            No Data Available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

TopLocation.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
