import PropTypes from 'prop-types';
import React from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { ScaleLoader } from 'react-spinners';

export default function TopStatus({ isLoading, dataStatus = [] }) {
    return (
        <table className="w-full bg-white rounded-lg table table-zebra">
            <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                    <th className="text-left text-sm text-gray-600 px-4 py-4">
                        No
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-4">
                        Category
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-4">
                        Total
                    </th>
                    <th className="text-left text-sm text-gray-600 px-4 py-4"></th>
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={4} className="text-center px-4 py-6">
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
                ) : dataStatus.length > 0 ? (
                    dataStatus.map((item, index) => (
                        <tr
                            key={index}
                            className="border-b hover:bg-gray-50 transition duration-200"
                        >
                            <td className="px-4 py-4 text-sm text-gray-800">
                                {index + 1}
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-gray-900">
                                        {item.Status}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {item.Remarks ?? '-'}
                                    </span>
                                </div>
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
                            colSpan={4}
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

TopStatus.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dataStatus: PropTypes.arrayOf(PropTypes.object).isRequired,
};
