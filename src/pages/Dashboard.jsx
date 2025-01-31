import React, { useEffect, useState } from 'react';
import CardTop from '../components/CardTop';
import { DashboardService } from '../api/apiTransaction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from '../components/CustomeInput';
import { DateTime } from 'luxon';
import BarChart from '../components/Chart/BarChart';
import DonutChart from '../components/Chart/DonutChart';
import TopLocation from '../components/DashboardTable/TopLocation';
import TopStatus from '../components/DashboardTable/TopStatus';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [dataSummary, setDataSummary] = useState([]);
    const [dataTopLocation, setTopLocation] = useState([]);
    const [dataTopStatus, setTopStatus] = useState([]);

    const dateTime = DateTime.fromJSDate(startDate, { zone: 'Asia/Jakarta' });
    const formattedDate = dateTime.toFormat('yyyy-MM-dd');

    useEffect(() => {
        fetchSummary();
        fetchTopLocation();
        fetchTopStatus();
    }, [startDate]);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const response = await DashboardService.getValue(formattedDate);
            setDataSummary(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopLocation = async () => {
        setLoading(true);
        try {
            const response = await DashboardService.getTopLocation(
                formattedDate
            );
            setTopLocation(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopStatus = async () => {
        setLoading(true);
        try {
            const response = await DashboardService.getTopStatus(formattedDate);
            setTopStatus(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mx-auto h-[89vh] min-w-screen">
                <div className="flex justify-between mx-auto items-center ">
                    <div className="flex flex-col my-2 text-start">
                        <p className="text-base text-stone-500 font-medium">
                            Dashboard
                        </p>
                        <h1 className="text-sm">
                            {DateTime.local().toFormat('EEEE, dd LLLL yyyy')}
                        </h1>
                    </div>
                </div>
                <div className="bg-white rounded-md mx-auto mt-2 w-full">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd-MMMM-yyyy"
                        popperPlacement="bottom-start"
                        className="custom-date-picker"
                        customInput={<CustomInput />}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        <CardTop
                            title="Transaksi POST"
                            value={dataSummary?.transaksiPOST ?? 0}
                        />
                        <CardTop
                            title="Ceklist Kendaraan"
                            value={dataSummary?.totalChecklist ?? 0}
                        />
                        <CardTop
                            title="Inap"
                            value={dataSummary?.totalInap ?? 0}
                        />
                        <CardTop
                            title="Lost Ticket"
                            value={dataSummary?.totalLostTicket ?? 0}
                        />
                        <CardTop title="IT" value={dataSummary?.totalIT ?? 0} />
                        <CardTop
                            title="Tidak Teridentifikasi"
                            value={dataSummary?.totalTidakTeridentifikasi ?? 0}
                        />
                        <CardTop
                            title="Lain-lain"
                            value={dataSummary?.totalLainLain ?? 0}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap justify-between items-center max-w-full mt-3 gap-2">
                    <div className="flex-[2] bg-white rounded-md p-2 shadow-lg border border-slate-100">
                        <BarChart />
                    </div>
                    <div className="flex-[1] bg-white rounded-md p-2 shadow-lg border border-slate-100">
                        <DonutChart date={formattedDate} />
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap justify-between items-start max-w-full mt-3 gap-2 mb-10">
                    <div className="flex-[2] bg-white rounded shadow-lg min-h-[50vh]">
                        <div className="flex justify-between items-center px-3 py-2">
                            <h1 className="text-lg px-2 py-1 font-semibold mb-3">
                                Top Location Transaksi Over Night
                            </h1>
                        </div>
                        <TopLocation
                            isLoading={loading}
                            data={dataTopLocation}
                        />
                    </div>
                    <div className="flex-[1] bg-white rounded shadow-lg min-h-[50vh]">
                        <div className="flex justify-between items-center px-3 py-2 mb-3">
                            <h1 className="text-lg px-2 py-1 font-semibold">
                                Top Status Transaksi Over Night
                            </h1>
                        </div>
                        <TopStatus
                            isLoading={loading}
                            dataStatus={dataTopStatus}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
