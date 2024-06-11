import React, { Fragment, useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import RangeDate from "./RangeDate";
import { toast, ToastContainer } from "react-toastify";
import ReactPagination from "react-paginate";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineDownload } from "react-icons/hi";
import { ScaleLoader } from "react-spinners";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { LuDownloadCloud, LuUploadCloud } from "react-icons/lu";
import LocationList from "./LocationList";
import { TbEyeSearch } from "react-icons/tb";

export default function Table() {
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [locationData, setLocation] = useState("");
  const [selectLocation, setSelectLocation] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [countData, setCountData] = useState(0);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [outTime, setOutTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userId, setUserId] = useState(0);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    setError("");
  };

  const startDateFormat = startDate
    ? DateTime.fromJSDate(new Date(startDate)).toFormat("yyyy-MM-dd")
    : "";
  const endDateFormat = endDate
    ? DateTime.fromJSDate(new Date(endDate)).toFormat("yyyy-MM-dd")
    : "";

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3008/api/token", {
        withCredentials: true,
      });
      setToken(response.data.accessToken);
      const decode = jwtDecode(response.data.accessToken);
      setLocationCode(decode.locationCode);
      setUserId(decode.userId);
      if (decode.exp * 1000 < Date.now()) {
        navigate("/");
        return null;
      }
      return response.data.accessToken;
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationResponse = await axios.get(
          `http://localhost:3008/api/getByLocation?userId=${userId}`
        );
        setLocation(locationResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocations();
  }, [userId]);

  const getData = useCallback(
    async (accessToken) => {
      try {
        const locationParam =
          selectLocation === " " ? locationData : selectLocation;
        const responseData = await axios.get(
          `http://localhost:3008/api/getDatabyLocation?limit=${limit}&location=${locationParam}&page=${pages}&keyword=${search}&startDate=${startDateFormat}&endDate=${endDateFormat}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setData(responseData.data.data);
        setTotalPages(responseData.data.totalPages);
        setCountData(responseData.data.totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [
      limit,
      selectLocation,
      locationData,
      pages,
      search,
      startDateFormat,
      endDateFormat,
    ]
  );

  const changePage = ({ selected }) => {
    setPages(selected + 1);
  };

  useEffect(() => {
    refreshToken().then((accessToken) => {
      if (accessToken) {
        getData(accessToken);
      }
    });
  }, [refreshToken, getData]);

  const handleLimit = (event) => {
    const selectedLimit = parseInt(event.target.value);
    const newTotalPages = Math.ceil(countData / selectedLimit); // Calculate new total pages based on total data count

    setLimit(selectedLimit);

    // Update current page if it exceeds new total pages
    if (pages > newTotalPages) {
      setPages(1); // Reset to first page
    } else {
      // Ensure first page has active class when changing limit
      changePage({ selected: 0 }); // Set to first page
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const newToken = await refreshToken();
      const locationParam =
        selectLocation === "" ? locationData : selectLocation;
      const response = await axios.get(
        `http://localhost:3008/api/exportDataOn?location=${locationParam}&startDate=${startDateFormat}&endDate=${endDateFormat}`,
        {
          responseType: "arraybuffer", // Mengatur responseType sebagai arraybuffer
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const fileName = `${startDateFormat}_sd${endDateFormat}_alldata.xlsx`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      if (response.data) {
        toast.success("Data berhasil diunduh!", {
          position: "top-right",
        });
      } else {
        toast.error("Gagal mengunduh data.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan saat mengunduh data.", {
        position: "top-right",
      });
      setIsLoading(false); // Menghentikan loading jika terjadi kesalahan
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Only Excel files are allowed.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const newToken = await refreshToken(); // Refresh token before upload

        const response = await axios.post(
          `http://localhost:3008/api/upload/dataOverNight?locationCode=${locationCode}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${newToken}`, // Use new token here
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            },
          }
        );

        if (response.status === 200) {
          setIsLoading(false);
          toast.success("File uploaded successfully!", {
            position: "top-right",
          });
          await getData(newToken); // Pass the new token to getData
          closeModal();
        } else {
          setIsLoading(false);
          setError("File upload failed. Please try again.");
        }
      } catch (error) {
        setError("An error occurred during file upload. Please try again.");
        console.error("File upload error:", error);
        setIsLoading(false);
      }

      console.log("File uploaded:", file);
      closeModal();
    } else {
      setError("Please select a valid Excel file.");
    }
  };

  const downloadTemplate = () => {
    // Buat data template
    const templateData = [
      ["No", "Ticket Number", "License Plate", "InTime"],
      // Tambahkan data lainnya di sini jika perlu
    ];

    // Buat workbook dan worksheet
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Konversi workbook ke file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Buat file dan unduh
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "Template.xlsx");
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOutTime(
      row.OutTime
        ? DateTime.fromISO(row.OutTime).toFormat("yyyy-MM-dd'T'HH:mm")
        : ""
    );
    setRemarks(row.Remarks || "");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const newToken = await refreshToken();
      const decode = jwtDecode(newToken);

      const requestBody = {
        outTime: outTime,
        remaks: remarks,
        officer: decode.name,
        idTransaction: selectedRow.Id,
      };

      const response = await axios.put(
        "http://localhost:3008/api/updateOutAndRemaks",
        requestBody, // Mengirim request body secara langsung
        {
          headers: {
            Authorization: `Bearer ${newToken}`, // Menyertakan token dalam header
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data updated successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to update data. Please try again.", {
          position: "top-right",
        });
      }
      await getData(newToken);
      setIsLoading(false);
      handleModalClose();
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred during update. Please try again.", {
        position: "top-right",
      });
      console.error("Error updating data:", error);
    }
  };

  const handleLocationSelect = (locCode) => {
    setSelectLocation(locCode);
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-row gap-3 z-10">
          <RangeDate
            startDate={startDate}
            endDate={endDate}
            handleDateChange={handleDateChange}
          />
          <LocationList
            data={locationData}
            onSelectLocation={handleLocationSelect}
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
            className="flex flex-row justify-center items-center gap-x-2 text-red-700 hover:text-red-500 cursor-pointer text-sm"
            onClick={downloadTemplate}
          >
            <LuDownloadCloud />
            <p className="whitespace-nowrap">Download Template</p>
          </button>
          <button
            className="flex flex-row justify-center items-center gap-x-2 text-teal-700 hover:text-teal-500 cursor-pointer text-sm"
            onClick={openModal}
          >
            <LuUploadCloud />
            <p>Upload</p>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex gap-2 justify-center items-center w-full px-4 py-3 font-medium text-gray-700 hover:text-amber-500 focus:outline-none text-sm"
          >
            <HiOutlineDownload />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[56vh] w-full mt-5">
        <table className="table table-zebra table-xs table-pin-rows table-pin-cols text-xs cursor-pointer">
          <thead>
            <tr className="font-semibold p-2">
              <th className="bg-slate-100 px-2 py-5 rounded-tl-xl">No</th>
              <th className="bg-slate-100 px-2 py-5">Locations</th>
              <th className="bg-slate-100 px-2 py-5">Transaction No</th>
              <th className="bg-slate-100 px-2 py-5">Vehicle Plate</th>
              <th className="bg-slate-100 px-2 py-5">In Time</th>
              <th className="bg-slate-100 px-2 py-5">Last Update by</th>
              <th className="bg-slate-100 px-2 py-5">Last Update Date</th>
              <th className="bg-slate-100 px-2 py-5 rounded-tr-xl">Status</th>
              <th className="bg-slate-100 px-2 py-5 rounded-tr-xl">#</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="text-center">
                <td
                  colSpan={10}
                  className="text-center py-5 text-xl font-semibold"
                >
                  Data Not Found
                </td>
              </tr>
            ) : (
              data &&
              data.map((list, index) => (
                <tr key={index} onClick={() => handleRowClick(list)}>
                  <td>{index + 1}</td>
                  <td>
                    {list.RefLocation && list.RefLocation.Name
                      ? list.RefLocation.Name
                      : "-"}
                  </td>
                  <td>{list.TransactionNo}</td>
                  <td>
                    {list.InTime
                      ? DateTime.fromISO(list.InTime).toFormat("ff")
                      : "-"}
                  </td>
                  <td>{list.VehiclePlateNo}</td>

                  <td>{list.ModifiedBy ? list.ModifiedBy : "-"}</td>
                  <td>{DateTime.fromISO(list.ModifiedOn).toFormat("ff")}</td>
                  <td>
                    <div className="flex flex-row justify-start items-center gap-3">
                      <div>
                        <div
                          className={`relative w-5 h-5 rounded-full ${
                            list.Status === "In Area"
                              ? "bg-green-100"
                              : list.Status === "No vehicle"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <div
                            className={`absolute top-[6px] left-[6px] w-2 h-2 rounded-full ${
                              list.Status === "In Area"
                                ? "bg-green-600"
                                : list.Status === "No vehicle"
                                ? "bg-red-600"
                                : "bg-blue-600"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <h1>{list.Status}</h1>
                    </div>
                  </td>
                  <td>
                    <button>
                      <TbEyeSearch />
                    </button>
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
              <span className="font-medium px-1">{countData}</span>
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
                  previousLabel={"Prev"}
                  nextLabel={"Next"}
                  pageCount={totalPages}
                  onPageChange={changePage}
                  containerClassName={
                    "isolate inline-flex -space-x-px rounded-md shadow-sm "
                  }
                  activeClassName={"bg-yellow-500 text-white focus:z-20"}
                  previousClassName={
                    "inline-flex items-center rounded-l-md px-4 py-1 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }
                  nextClassName={
                    "inline-flex items-center rounded-r-md px-4 py-1 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }
                  pageLinkClassName={
                    "inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 "
                  }
                  disabledLinkClassName={"text-gray-400"}
                />
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Upload Excel File
                      </Dialog.Title>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept=".xls, .xlsx"
                          onChange={handleFileChange}
                          className="border border-slate-300 px-3 py-2 rounded-xl text-sm"
                        />
                        {error && (
                          <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleSubmit}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <ScaleLoader size={150} color={"#333"} loading={true} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedRow && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Input OutTime and Remarks
            </h2>
            <div className="mb-3">
              <img
                src={
                  `http://localhost:3008${selectedRow.PathPhotoImage}` === " "
                    ? `/notAvailable.png`
                    : `http://localhost:3008${selectedRow.PathPhotoImage}`
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
                  <p className="text-slate-500">{selectedRow.LocationCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Transaction No
                  </label>
                  <p className="text-slate-500">{selectedRow.TransactionNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Vehicle Plate No
                  </label>
                  <p className="text-slate-500">{selectedRow.VehiclePlateNo}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  OutTime
                </label>
                <input
                  type="datetime-local"
                  className="border border-gray-300 p-2 w-full rounded"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Remarks
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 w-full rounded"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSave}
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
    </div>
  );
}
