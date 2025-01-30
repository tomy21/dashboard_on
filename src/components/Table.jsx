import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import ReactPagination from 'react-paginate';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineDownload } from 'react-icons/hi';
import { ScaleLoader } from 'react-spinners';
import { DateTime } from 'luxon';
import LocationList from './LocationList';
import { apiTable } from '../api/apiTransaction';
import CustomInput from './CustomeInput';
import Dropwdown from './Dropdown';

export default function Table() {
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [startDateExport, setStartDateExport] = useState(new Date());
    const [isLoading, setIsLoading] = useState(null);
    const [search, setSearch] = useState('');
    const [locationData, setLocation] = useState('');
    const [selectLocation, setSelectLocation] = useState('');
    const [selectLocationName, setSelectLocationName] = useState('');
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [countData, setCountData] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalGetDataPOST, setModalGetDataPOST] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [userLocations, setUserLocations] = useState([]);
    const [loading, setLoading] = useState(false); // Untuk loading state
    const [progress, setProgress] = useState(0); // Untuk progress line
    const [showToast, setShowToast] = useState(false); // Untuk menampilkan toast
    const [modalExport, setModalExport] = useState(false);

    const dateTime = DateTime.fromJSDate(startDate, { zone: 'Asia/Jakarta' });
    const formattedDate = dateTime.toFormat('yyyy-MM-dd');

    const dateTimeExport = DateTime.fromJSDate(startDateExport, {
        zone: 'Asia/Jakarta',
    });
    const formattedDateExport = dateTimeExport.toFormat('yyyy-MM-dd');

    useEffect(() => {
        fetchData();
        fetchLocations();
    }, [pages, limit, formattedDate, search]);

    const fetchLocations = async () => {
        try {
            const locationResponse = await apiTable.fetchLocations();
            setLocation(locationResponse.UsersLocations);
            setUserLocations(locationResponse || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await apiTable.getLocationByUsers(
                pages,
                limit,
                formattedDate,
                search
            );
            console.log(response);
            setData(response.data.transaction);
            setTotalPages(response.data.totalPages);
            setCountData(response.data.total);
        } catch (error) {
            console.log(error);
        }
    };

    const changePage = ({ selected }) => {
        setPages(selected + 1);
    };

    const handleLimit = (event) => {
        const selectedLimit = parseInt(event.target.value);
        const newTotalPages = Math.ceil(countData / selectedLimit);

        setLimit(selectedLimit);

        if (pages > newTotalPages) {
            setPages(1);
        } else {
            changePage({ selected: 0 });
        }
    };

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const { blob, fileName } = await apiTable.handleExport(
                selectLocation,
                formattedDateExport,
                userLocations,
                selectLocationName,
                locationData
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast.success('Data berhasil diunduh!', {
                position: 'top-right',
            });
            setStartDateExport(new Date());
            setModalExport(false);
        } catch (error) {
            console.log(error);
            toast.error('Terjadi kesalahan saat mengunduh data.', {
                position: 'top-right',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModalExport = () => {
        setModalExport(false);
        setStartDateExport(new Date());
    };
    // console.log(locationData);
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);

        setRemarks(row.Remarks || '');
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleSave = async (idData) => {
        setIsLoading(true);
        try {
            const response = await apiTable.updateData(
                idData,
                selectedCategory.Name,
                remarks.Name
            );
            if (response.statusCode === 200) {
                setIsLoading(false);
                setIsModalOpen(false);
                toast.success('Data berhasil disimpan!', {
                    position: 'top-right',
                });
                fetchData();
                setSelectedCategory('');
            } else {
                toast.error('Terjadi kesalahan saat menyimpan data.', {
                    position: 'top-right',
                });
                setIsModalOpen(false);
                setIsLoading(false);
                fetchData();
                setSelectedCategory('');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('An error occurred during update. Please try again.', {
                position: 'top-right',
            });
            console.error('Error updating data:', error);
        }
    };

    const handleLocationSelect = (locCode) => {
        setSelectLocation(locCode);
    };

    const handleLocationNameSelect = (locName) => {
        setSelectLocationName(locName);
    };

    const Category = [
        { value: 'Inap', label: 'Inap' },
        { value: 'Lost Ticket', label: 'Lost Ticket' },
        { value: 'IT', label: 'IT' },
        { value: 'Tidak Teridentifikasi', label: 'Tidak Teridentifikasi' },
        { value: 'Lain-lain', label: 'Lain-lain' },
    ];

    const IT = [
        { value: 'Printer', label: 'Printer' },
        { value: 'Jaringan', label: 'Jaringan' },
        { value: 'Offline', label: 'Offline' },
        { value: 'Voucher', label: 'Voucher' },
        { value: 'Member', label: 'Member' },
        { value: 'Test Ticket', label: 'Test Ticket' },
        { value: 'System', label: 'System' },
        { value: 'Double Ticket', label: 'Double Ticket' },
        { value: 'Double Payment', label: 'Double Payment' },
    ];

    const LainLain = [
        { value: 'Tenant', label: 'Tenant' },
        { value: 'Proyek', label: 'Proyek' },
        { value: 'Mobil Oprational', label: 'Mobil Oprational' },
        { value: 'listrik Padam', label: 'listrik Padam' },
    ];

    const listCategory = Array.isArray(Category)
        ? [
              ...new Set(
                  Category.map((item) => ({
                      Code: item.value,
                      Name: item.label,
                  }))
              ),
          ]
        : [];

    let listRemaks = [];
    if (selectedCategory) {
        if (selectedCategory.Code === 'IT') {
            listRemaks = Array.isArray(IT)
                ? [
                      ...new Set(
                          IT.map((item) => ({
                              Code: item.value,
                              Name: item.label,
                          }))
                      ),
                  ]
                : [];
        } else if (selectedCategory.Code === 'Lain-lain') {
            listRemaks = Array.isArray(LainLain)
                ? [
                      ...new Set(
                          LainLain.map((item) => ({
                              Code: item.value,
                              Name: item.label,
                          }))
                      ),
                  ]
                : [];
        } else {
            listRemaks = [];
        }
    }

    const timeDifferenceFormat = (startDateTime, endDateTime) => {
        const start = DateTime.fromISO(startDateTime, { zone: '+07:00' });
        const end = DateTime.fromISO(endDateTime, { zone: '+07:00' });

        const diff = end.diff(start, ['days', 'hours', 'minutes']);
        const { days, hours, minutes } = diff.toObject();

        return `${Math.floor(days)} d, ${Math.floor(hours)} h, ${Math.floor(
            minutes
        )} m`;
    };

    const handleGetDataPOST = async () => {
        setLoading(true);
        setProgress(0);
        setShowToast(false);

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + 10;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, 200);

        try {
            const response = await apiTable.getDataPOST(selectLocation);
            if (response.status === 200) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setModalGetDataPOST(false);
                setShowToast(true);
                setMessage(response.data.message);
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
                fetchData();
            } else {
                setError(true);
                setMessage(response.data.message);
            }
        } catch (error) {
            setError(true);
            setMessage(error);
        } finally {
            clearInterval(interval); // Hentikan progress bar
            setLoading(false); // Hilangkan modal loading
        }
    };

    return (
        <div>
            <ToastContainer />

            <div className="flex flex-wrap md:justify-between items-center mb-2 mt-3">
                <div className="flex flex-wrap md:flex-row gap-3 z-10">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd-MMMM-yyyy"
                        popperPlacement="bottom-start"
                        className="custom-date-picker"
                        customInput={<CustomInput />}
                    />
                    <LocationList
                        data={locationData || []}
                        onSelectLocation={handleLocationSelect}
                        onSelectNameLocation={handleLocationNameSelect}
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={handleSearchChange}
                        className="border border-slate-300 px-3 py-2 rounded-xl text-sm"
                        placeholder="Search"
                    />
                </div>
                <div className="flex flex-row gap-3">
                    <button
                        className="bg-amber-500 hover:bg-amber-600 text-white font-normal py-2 px-4 rounded-lg whitespace-nowrap text-sm"
                        onClick={() => setModalGetDataPOST(true)}
                    >
                        Get Data POST
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalExport(true)}
                        className="inline-flex gap-2 justify-center items-center w-full px-4 py-3 font-medium text-gray-700 hover:text-amber-500 focus:outline-none text-sm bg-white border border-gray-300 rounded-lg"
                    >
                        <HiOutlineDownload />
                        <p className="text-xs">Export Data</p>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto max-h-[56vh] w-full mt-5">
                <table className="table table-zebra table-xs table-pin-rows table-pin-cols text-xs cursor-pointer">
                    <thead>
                        <tr className="font-semibold p-2">
                            <th className="bg-slate-100 px-2 py-5 rounded-tl-xl">
                                No
                            </th>
                            <th className="bg-slate-100 px-2 py-5">Lokasi</th>
                            <th className="bg-slate-100 px-2 py-5">
                                Transaction No
                            </th>
                            <th className="bg-slate-100 px-2 py-5">In Time</th>
                            <th className="bg-slate-100 px-2 py-5">
                                Plate POST
                            </th>
                            <th className="bg-slate-100 px-2 py-5">
                                Plate Recognize
                            </th>
                            <th className="bg-slate-100 px-2 py-5">
                                Plate Manual
                            </th>
                            <th className="bg-slate-100 px-2 py-5">
                                Updated By
                            </th>
                            <th className="bg-slate-100 px-2 py-5">
                                Upload Date
                            </th>
                            <th className="bg-slate-100 px-2 py-5">Duration</th>
                            <th className="bg-slate-100 px-2 py-5">Category</th>
                            <th className="bg-slate-100 px-2 py-5 rounded-tr-xl">
                                Detail
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!Array.isArray(data) || data.length === 0 ? (
                            <tr className="text-center">
                                <td
                                    colSpan={10}
                                    className="text-center py-5 text-xl font-semibold"
                                >
                                    Data Not Found
                                </td>
                            </tr>
                        ) : (
                            data.map((list, index) => (
                                <tr
                                    key={list.Id}
                                    onClick={() => handleRowClick(list)}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        {list.RefLocation &&
                                        list.RefLocation.Name
                                            ? list.RefLocation.Name
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.TransactionNo
                                            ? list.TransactionNo
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.InTime
                                            ? DateTime.fromISO(list.InTime, {
                                                  zone: '+07:00',
                                              }).toFormat(
                                                  'dd MMM yyyy, HH:mm:ss'
                                              )
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.PlatePOST ? list.PlatePOST : '-'}
                                    </td>
                                    <td>
                                        {list.Plateregognizer
                                            ? list.Plateregognizer
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.VehiclePlateNo
                                            ? list.VehiclePlateNo
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.ModifiedBy
                                            ? list.ModifiedBy
                                            : '-'}
                                    </td>
                                    <td>
                                        {list.UploadedAt
                                            ? DateTime.fromISO(
                                                  list.UploadedAt,
                                                  {
                                                      zone: '+07:00',
                                                  }
                                              ).toFormat(
                                                  'dd MMM yyyy, HH:mm:ss'
                                              )
                                            : '-'}
                                    </td>
                                    <td>
                                        {timeDifferenceFormat(
                                            list.InTime,
                                            list.CreatedAt
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-start items-center gap-3">
                                            <div>
                                                <div
                                                    className={`relative w-5 h-5 rounded-full ${
                                                        list.Status ===
                                                        'In Area'
                                                            ? 'bg-green-100'
                                                            : list.Status ===
                                                              'No vehicle'
                                                            ? 'bg-red-100'
                                                            : 'bg-blue-100'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-[6px] left-[6px] w-2 h-2 rounded-full ${
                                                            list.Status ===
                                                            'In Area'
                                                                ? 'bg-green-600'
                                                                : list.Status ===
                                                                  'No vehicle'
                                                                ? 'bg-red-600'
                                                                : 'bg-blue-600'
                                                        }`}
                                                    ></div>
                                                </div>
                                            </div>
                                            <h1>{list.Status}</h1>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-start items-center gap-3">
                                            <h1>{list.Remarks}</h1>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className=" flex items-center justify-between border-t border-gray-200 bg-white py-3  text-xs">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div className="flex flex-row gap-x-3 items-center justify-center">
                        <p className=" text-gray-700">
                            Showing
                            <span className="font-medium px-1">1</span>
                            to
                            <span className="font-medium px-1">
                                {limit > countData ? countData : limit}
                            </span>
                            of
                            <span className="font-medium px-1">
                                {countData}
                            </span>
                            results
                        </p>
                        <div className="flex flex-row gap-2 justify-start items-center">
                            <select
                                name="limit"
                                value={limit}
                                onChange={handleLimit}
                                className="border border-slate-300 rounded-md p-1 text-xs"
                            >
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <nav aria-label="Page navigation">
                            <ul className="justify-content-center">
                                <ReactPagination
                                    previousLabel={'Prev'}
                                    nextLabel={'Next'}
                                    pageCount={totalPages}
                                    onPageChange={changePage}
                                    containerClassName={
                                        'isolate inline-flex -space-x-px rounded-md shadow-sm '
                                    }
                                    activeClassName={
                                        'bg-yellow-500 text-white focus:z-20'
                                    }
                                    previousClassName={
                                        'inline-flex items-center rounded-l-md px-4 py-1 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }
                                    nextClassName={
                                        'inline-flex items-center rounded-r-md px-4 py-1 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }
                                    pageLinkClassName={
                                        'inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 '
                                    }
                                    disabledLinkClassName={'text-gray-400'}
                                />
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <div className="flex items-center justify-center mb-3">
                            <ScaleLoader
                                size={150}
                                color={'#333'}
                                loading={true}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && selectedRow && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Update Status Transaction
                        </h2>

                        <div className="border w-full border-gray-300 rounded-md"></div>

                        <div className="mb-3">
                            <img
                                src={
                                    `http://localhost:3002/${selectedRow.PathPhotoImage}` ===
                                    ' '
                                        ? `/notAvailable.png`
                                        : `http://localhost:3002/${selectedRow.PathPhotoImage}`
                                }
                                alt=""
                                width={150}
                            />
                        </div>
                        <form>
                            <div className="flex flex-wrap mb-4 gap-x-10">
                                <div>
                                    <label className="block text-sm font-semibold">
                                        Location Code
                                    </label>
                                    <p className="text-slate-500">
                                        {selectedRow.LocationCode}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold">
                                        Transaction No
                                    </label>
                                    <p className="text-slate-500">
                                        {selectedRow.TransactionNo}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold">
                                        Vehicle Plate No
                                    </label>
                                    <p className="text-slate-500">
                                        {selectedRow.VehiclePlateNo}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Case Category
                                </label>

                                <Dropwdown
                                    id={'case-category'}
                                    name={'category'}
                                    list={listCategory}
                                    title={'Pilih category'}
                                    search={'Cari category'}
                                    selected={selectedCategory}
                                    setSelected={setSelectedCategory}
                                    bottom={false}
                                />
                            </div>
                            {selectedCategory && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Case Sub Category
                                    </label>
                                    <Dropwdown
                                        id={'case-remaks'}
                                        name={'remaks'}
                                        list={listRemaks}
                                        title={'Pilih Remaks'}
                                        search={'Cari Remaks'}
                                        selected={remarks}
                                        setSelected={setRemarks}
                                        bottom={false}
                                    />
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => handleSave(selectedRow.Id)}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black px-4 py-2 rounded"
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalGetDataPOST && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white w-1/3 rounded-lg min-h-32 px-2 py-3">
                        <div className="flex flex-col justify-start items-start">
                            <h1 className="text-base font-semibold">
                                Get Data POST
                            </h1>
                            <p className="px-2 py-1 rounded bg-cyan-100 text-xs text-cyan-700">
                                Default transaction date is today
                            </p>
                        </div>
                        <div className="border border-b w-full border-slate-3200 mt-2"></div>
                        <div className="flex justify-between items-center w-full mt-2">
                            <div className="flex flex-col justify-start items-start space-y-2">
                                <p className="text-sm text-slate-400">
                                    Location
                                </p>
                                <LocationList
                                    data={locationData || []}
                                    onSelectLocation={handleLocationSelect}
                                    onSelectNameLocation={
                                        handleLocationNameSelect
                                    }
                                />
                            </div>
                        </div>
                        <div className="border border-t border-slate-200 w-full my-4"></div>

                        <div className="flex flex-row justify-end items-end w-full space-x-2">
                            <button
                                onClick={handleGetDataPOST}
                                className="text-sm text-white bg-green-500 rounded-lg shadow-md shadow-green-400 hover:bg-opacity-90 hover:shadow-none px-4 py-2"
                            >
                                Get Data
                            </button>
                            <button className="text-sm text-red-500 bg-white border border-red-500 rounded-lg shadow-md shadow-red-400 hover:bg-red-500 hover:text-white hover:shadow-none px-4 py-2">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalExport && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white w-1/3 rounded-lg min-h-32 p-3">
                        <div className="flex flex-col justify-start items-start">
                            <h1 className="text-base font-semibold">
                                Export Data
                            </h1>
                        </div>
                        <div className="border border-b w-full border-slate-3200 mt-2"></div>
                        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full mt-2">
                            <div className="flex flex-col justify-start items-start space-y-2">
                                <p className="text-sm text-slate-400">
                                    Transaction Date
                                </p>
                                <DatePicker
                                    selected={startDateExport}
                                    onChange={(date) =>
                                        setStartDateExport(date)
                                    }
                                    dateFormat="dd-MMMM-yyyy"
                                    popperPlacement="bottom-start"
                                    className="custom-date-picker"
                                    customInput={<CustomInput />}
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start space-y-2">
                                <p className="text-sm text-slate-400">
                                    Location
                                </p>
                                <LocationList
                                    data={locationData || []}
                                    onSelectLocation={handleLocationSelect}
                                    onSelectNameLocation={
                                        handleLocationNameSelect
                                    }
                                />
                            </div>
                        </div>
                        <div className="border border-t border-slate-200 w-full my-4"></div>

                        <div className="flex flex-row justify-end items-end w-full space-x-2">
                            <button
                                onClick={handleExport}
                                className="text-sm text-white bg-green-500 rounded-lg shadow-md shadow-green-400 hover:bg-opacity-90 hover:shadow-none px-4 py-2"
                            >
                                Export Data
                            </button>
                            <button
                                onClick={handleCloseModalExport}
                                className="text-sm text-red-500 bg-white border border-red-500 rounded-lg shadow-md shadow-red-400 hover:bg-red-500 hover:text-white hover:shadow-none px-4 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white w-1/3 rounded-lg min-h-32 px-4 py-6">
                        <h1 className="text-lg font-semibold text-center">
                            Loading...
                        </h1>
                        <div className="relative w-full bg-gray-200 h-2 rounded mt-4">
                            <div
                                className="absolute top-0 left-0 h-2 bg-green-500 rounded"
                                style={{
                                    width: `${progress}%`,
                                    transition: 'width 0.2s',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <div className="toast toast-top toast-end">
                    <div className="bg-emerald-500 p-3 rounded-lg bg-opacity-90">
                        <span>{message}</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="toast toast-top toast-end">
                    <div className="bg-red-500 p-3 rounded-lg bg-opacity-90">
                        <span>{message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
