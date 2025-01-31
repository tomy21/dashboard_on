import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { apiUsers } from '../api/apiUsers';
import ReactPagination from 'react-paginate';
import Select from 'react-select';
import { ScaleLoader } from 'react-spinners';

export default function Users() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState('');
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [location, setLocation] = useState([]);
    const [error, setError] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        SetupRoleId: '',
        IpAddress: '',
        Name: '',
        Gender: '',
        Username: '',
        Email: '',
        Phone: '+62',
        MerchantId: 0,
        IsFirstpassword: 0,
        LocationCode: [],
    });

    const validate = () => {
        const newErrors = {};

        // Name validation (minimal 3 karakter)
        if (!formData.Name || formData.Name.length < 3) {
            newErrors.Name = 'Name must be at least 3 characters.';
        }

        // Username validation (tidak boleh ada spasi dan minimal 3 karakter)
        if (
            !formData.Username ||
            formData.Username.includes(' ') ||
            formData.Username.length < 3
        ) {
            newErrors.Username =
                'Username must be at least 3 characters and contain no spaces.';
        }

        // Email validation (harus email valid)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.Email || !emailRegex.test(formData.Email)) {
            newErrors.Email = 'Invalid email format.';
        }

        // Phone number validation (harus angka dan diawali +62, minimal 3 karakter)
        const phoneRegex = /^\+62\d{1,}$/;
        if (!formData.Phone || !phoneRegex.test(formData.Phone)) {
            newErrors.Phone =
                'Phone number must start with +62 and contain only numbers.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true jika tidak ada error
    };

    useEffect(() => {
        if (addModal && !formData.IpAddress) {
            const fetchIpAddress = async () => {
                try {
                    const response = await fetch(
                        'https://api.ipify.org?format=json'
                    );
                    const data = await response.json();
                    setFormData((prevData) => ({
                        ...prevData,
                        IpAddress: data.ip, // Set IP Address ke formData
                    }));
                } catch (error) {
                    console.error('Error fetching IP address:', error);
                }
            };

            fetchIpAddress();
        }
        if (formData.Phone === '') {
            setFormData((prevData) => ({
                ...prevData,
                Phone: '+62',
            }));
        }
    }, [addModal, formData.IpAddress, formData.Phone]);

    useEffect(() => {
        fetchData();
        fetchLocation();
    }, [pages, limit, search]);

    const fetchLocation = async () => {
        try {
            const locationResponse = await apiUsers.getListLocation();
            console.log(locationResponse);
            setLocation(locationResponse.user.UsersLocations);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
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

    const fetchData = async () => {
        try {
            const response = await apiUsers.getAllUserByLocation(
                pages,
                limit,
                search
            );
            setData(response.data);
            setCountData(response.pagination.totalItems);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditUser = async (user) => {
        setEditModal(true);
        try {
            console.log(user);
            const response = await apiUsers.getDetail(user);
            const dataResponse = response.data;
            console.log(dataResponse);
            setFormData({
                SetupRoleId: dataResponse.user.SetupRoleId,
                // IpAddress: user.IpAddress,
                Name: dataResponse.user.Name,
                Gender: dataResponse.user.Gender,
                Username: dataResponse.user.Username,
                Email: dataResponse.user.Email,
                Phone: dataResponse.user.Phone,
                // Gender: dataResponse.Gender,
                // IsFirstpassword: user.IsFirstpassword,
                LocationCode: dataResponse.location.map(
                    (loc) => loc.LocationCode
                ),
            });
        } catch (error) {
            console.log(error);
        }
        // setAddModal(true);
    };

    const options = location.map((loc) => ({
        value: loc.RefLocation.Code,
        label: loc.RefLocation.Name,
    }));

    const SetupRoleId = [
        { value: 14, label: 'Petugas' },
        { value: 15, label: 'Supervisor' },
    ];

    const Gender = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
    ];

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
                <ScaleLoader size={150} color={'#ffff'} loading={true} />
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Cegah input spasi pada Username
        if (name === 'Username' && value.includes(' ')) {
            return; // Hentikan perubahan jika ada spasi
        }

        // Validasi khusus untuk Phone
        if (name === 'Phone') {
            // Jika value kosong, pastikan tetap +62
            if (!value.startsWith('+62')) {
                setFormData((prevData) => ({
                    ...prevData,
                    Phone: '+62',
                }));
                return;
            }

            // Ambil hanya angka setelah +62 dan hapus karakter non-numerik
            const numericPart = value.slice(3).replace(/[^0-9]/g, '');

            // Batasi panjang total menjadi maksimal 18 karakter (termasuk +62)
            const limitedNumericPart = numericPart.slice(0, 15); // Maksimal 15 angka setelah +62

            // Update state Phone dengan +62 di depan
            setFormData((prevData) => ({
                ...prevData,
                Phone: `+62${limitedNumericPart}`,
            }));
            return;
        }

        // Untuk input lain, tetap proses seperti biasa
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validasi setelah input berubah
        validateField(name, value);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const newErrors = { ...errors };

        if (name === 'Name' && formData.Name.length < 3) {
            newErrors.Name = 'Name must be at least 3 characters.';
        } else if (
            name === 'Username' &&
            (formData.Username.includes(' ') || formData.Username.length < 3)
        ) {
            newErrors.Username =
                'Username must be at least 3 characters and contain no spaces.';
        } else if (
            name === 'Email' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)
        ) {
            newErrors.Email = 'Invalid email format.';
        } else if (name === 'Phone' && !/^\+62\d{1,}$/.test(formData.Phone)) {
            newErrors.Phone =
                'Phone number must start with +62 and contain only numbers.';
        }

        setErrors(newErrors);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Validasi berdasarkan nama field
        if (name === 'Name' && value.length < 3) {
            newErrors.Name = 'Name must be at least 3 characters.';
        } else if (
            name === 'Username' &&
            (value.includes(' ') || value.length < 3)
        ) {
            newErrors.Username =
                'Username must be at least 3 characters and contain no spaces.';
        } else if (
            name === 'Email' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            newErrors.Email = 'Invalid email format.';
        } else if (name === 'Phone' && !/^\+62\d{1,}$/.test(value)) {
            newErrors.Phone =
                'Phone number must start with +62 and contain only numbers.';
        } else {
            delete newErrors[name]; // Hapus error jika valid
        }

        setErrors(newErrors);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault(); // Prevent default form submission

        setIsLoading(true);
        if (validate()) {
            try {
                const response = await apiUsers.register(formData);
                if (response.statusCode === 200) {
                    // Reset form
                    setFormData({
                        SetupRoleId: '',
                        IpAddress: '',
                        Name: '',
                        Gender: '',
                        Username: '',
                        Email: '',
                        Phone: '',
                        MerchantId: 0,
                        IsFirstpassword: 0,
                        LocationCode: [],
                    });
                    setAddModal(false);
                    setMessage(response.msg);
                    setShowToast(true);
                    fetchData(); // Refresh data
                } else {
                    setError(true);
                    setMessage(response.data.message);
                }
            } catch (error) {
                setError(true);
                setMessage(error.message || 'Something went wrong.');
            } finally {
                setIsLoading(false);
                setTimeout(() => setShowToast(false), 2000);
            }
        } else {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.put(`/api/user/${formData.Id}`, formData);
            alert('User updated successfully!');
            setEditModal(false);
            // fetchUsers(); // Panggil ulang data user jika ada
        } catch (error) {
            console.error(error);
            alert('Failed to update user.');
        }
    };

    return (
        <>
            <div className="mx-auto h-[89vh] min-w-screen">
                <div className="flex justify-between mx-auto items-center ">
                    <div className="flex flex-col my-2 text-start">
                        <p className="text-base text-stone-500 font-medium">
                            Users
                        </p>
                        <h1 className="text-sm">
                            {DateTime.local().toFormat('EEEE, dd LLLL yyyy')}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between items-center mb-2 mt-3">
                    <div className="flex flex-wrap md:flex-row gap-3 z-10">
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
                            onClick={() => setAddModal(true)}
                        >
                            Add Users
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-md mx-auto w-full h-[76vh]">
                    <div className="overflow-x-auto max-h-[56vh] w-full mt-2">
                        <table className="table table-zebra table-xs table-pin-rows text-xs cursor-pointer">
                            <thead>
                                <tr className="font-semibold p-2 border-b-2 border-black ">
                                    <th className="bg-slate-100 px-2 py-5 rounded-tl-xl">
                                        No
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5">
                                        Account
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5">
                                        Profile
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5">
                                        Location
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5">
                                        Last Active
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5">
                                        Status
                                    </th>
                                    <th className="bg-slate-100 px-2 py-5 rounded-tr-xl"></th>
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
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="flex flex-col justify-start items-start">
                                                    <h1 className="text-sm font-semibild">
                                                        {list.username
                                                            ? list.username
                                                            : '-'}
                                                    </h1>
                                                    <p className="text-xs text-slate-400">
                                                        {list.userCode
                                                            ? list.userCode
                                                            : '-'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col justify-start items-start">
                                                    <h1 className="text-sm font-semibild">
                                                        {list.name
                                                            ? list.name
                                                            : '-'}
                                                    </h1>
                                                    <p className="text-xs text-slate-400">
                                                        {list.email
                                                            ? list.email
                                                            : '-'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                {list.location &&
                                                list.location.length > 0 ? (
                                                    <ul className="list-disc pl-5">
                                                        {list.location.map(
                                                            (loc, locIndex) => (
                                                                <li
                                                                    key={
                                                                        locIndex
                                                                    }
                                                                >
                                                                    {loc.refLocation &&
                                                                    loc
                                                                        .refLocation
                                                                        .Name
                                                                        ? loc
                                                                              .refLocation
                                                                              .Name
                                                                        : 'Unknown Location'}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                {list && list.lastActivity
                                                    ? DateTime.fromISO(
                                                          list.lastActivity,
                                                          {
                                                              zone: '+07:00',
                                                          }
                                                      ).toFormat(
                                                          'dd MMM yyyy, HH:mm:ss'
                                                      )
                                                    : '-'}
                                            </td>

                                            <td>
                                                <div className="flex flex-row justify-start items-center gap-3">
                                                    <div>
                                                        <div
                                                            className={`relative w-5 h-5 rounded-full ${
                                                                list.userStatus ===
                                                                1
                                                                    ? 'bg-green-100'
                                                                    : list.userStatus ===
                                                                      0
                                                                    ? 'bg-red-100'
                                                                    : 'bg-blue-100'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`absolute top-[6px] left-[6px] w-2 h-2 rounded-full ${
                                                                    list.userStatus ===
                                                                    1
                                                                        ? 'bg-green-600'
                                                                        : list.userStatus ===
                                                                          2
                                                                        ? 'bg-red-600'
                                                                        : 'bg-blue-600'
                                                                }`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <h1>
                                                        {list.userStatus === 1
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </h1>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-row justify-start items-center gap-3">
                                                    <button
                                                        className="text-xs text-slate-400 hover:text-black"
                                                        onClick={() =>
                                                            handleEditUser(
                                                                list.userId
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="text-xs text-slate-400 hover:text-black"
                                                        // onClick={() =>
                                                        //     handleDeleteUser(
                                                        //         list.user
                                                        //     )
                                                        // }
                                                    >
                                                        Delete
                                                    </button>
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
                                            disabledLinkClassName={
                                                'text-gray-400'
                                            }
                                        />
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(addModal || editModal) && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-5">
                        <h1 className="font-semibold text-lg mb-3">
                            {editModal ? 'Edit User' : 'Add User'}
                        </h1>
                        <div className="border-b border-gray-300 mb-4"></div>
                        <form
                            onSubmit={
                                editModal ? handleUpdateUser : handleSaveUser
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="Name"
                                        className={`border w-full p-2 rounded ${
                                            errors.Name
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        value={formData.Name}
                                        onChange={handleChange} // Menangani perubahan input
                                        onBlur={handleBlur} // Menangani validasi saat blur
                                        required
                                    />
                                    {errors.Name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.Name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="Username"
                                        className={`border w-full p-2 rounded ${
                                            errors.Username
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        value={formData.Username}
                                        onChange={handleChange} // Menangani perubahan input
                                        onBlur={handleBlur} // Menangani validasi saat blur
                                        required
                                    />
                                    {errors.Username && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.Username}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="Email" // Nama field
                                        className={`border w-full p-2 rounded ${
                                            errors.Email
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        value={formData.Email}
                                        onChange={handleChange} // Menangani perubahan input
                                        onBlur={handleBlur} // Menangani validasi saat blur
                                        required
                                    />
                                    {errors.Email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.Email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="Phone" // Nama field
                                        className={`border w-full p-2 rounded ${
                                            errors.Phone
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        value={formData.Phone}
                                        onChange={handleChange} // Menangani perubahan input
                                        onBlur={handleBlur} // Menangani validasi saat blur
                                        required
                                    />
                                    {errors.Phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.Phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Gender
                                    </label>
                                    <Select
                                        options={Gender}
                                        value={Gender.find(
                                            (option) =>
                                                option.value === formData.Gender
                                        )}
                                        onChange={(selectedOption) =>
                                            setFormData({
                                                ...formData,
                                                Gender: selectedOption.value,
                                            })
                                        }
                                        className="basic-select text-sm"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Setup Role ID
                                    </label>
                                    <Select
                                        options={SetupRoleId}
                                        value={SetupRoleId.find(
                                            (option) =>
                                                option.value ===
                                                formData.SetupRoleId
                                        )}
                                        onChange={(selectedOption) =>
                                            setFormData({
                                                ...formData,
                                                SetupRoleId:
                                                    selectedOption.value,
                                            })
                                        }
                                        className="basic-select text-sm"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Location Code{' '}
                                        {formData.SetupRoleId === 14
                                            ? '(Single Select)'
                                            : '(Multi Select)'}
                                    </label>
                                    <Select
                                        options={options}
                                        isMulti={formData.SetupRoleId === 15} // Enable multi-select only for Role 15
                                        value={options.filter((option) =>
                                            formData.LocationCode.includes(
                                                option.value
                                            )
                                        )}
                                        onChange={(selectedOptions) => {
                                            const selectedValues =
                                                Array.isArray(selectedOptions)
                                                    ? selectedOptions.map(
                                                          (option) =>
                                                              option.value
                                                      )
                                                    : selectedOptions
                                                    ? [selectedOptions.value]
                                                    : [];
                                            setFormData({
                                                ...formData,
                                                LocationCode: selectedValues,
                                            });
                                        }}
                                        className="basic-multi-select text-sm"
                                        classNamePrefix="select"
                                        isDisabled={!formData.SetupRoleId} // Disable if no SetupRoleId is selected
                                    />
                                </div>
                            </div>
                            <div className="border-t border-slate-300 w-full my-3"></div>
                            <div className="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded mr-3"
                                    onClick={() => {
                                        setAddModal(false);
                                        setEditModal(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {editModal ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
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
        </>
    );
}
