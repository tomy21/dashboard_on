import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { DashboardService } from '../../api/apiTransaction';
import PropTypes from 'prop-types';

const BarChart = ({ month }) => {
    const selectedMonth =
        month && month.trim() ? month : new Date().toISOString().slice(0, 7);
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '70%',
                            },
                        },
                    },
                },
            ],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: [], // Akan diisi dengan tanggal transaksi
            },
            yaxis: {
                title: {
                    text: 'Total Transaksi',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val} transaksi`,
                },
            },
            title: {
                text: 'Statistik Transaksi Bulanan',
                align: 'center',
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DashboardService.getDataChartBar(
                    selectedMonth
                );
                if (response.statusCode === 200) {
                    const data = response.data;

                    // Ambil daftar tanggal
                    const categories = data.map((item) => item.date);

                    // Ambil data inap & overnight
                    const inapData = data.map((item) => item.inap);
                    const overNightData = data.map((item) => item.overNight);

                    // Update state chartData
                    setChartData((prevState) => ({
                        ...prevState,
                        series: [
                            { name: 'Inap', data: inapData },
                            { name: 'OverNight', data: overNightData },
                        ],
                        options: {
                            ...prevState.options,
                            xaxis: { categories },
                        },
                    }));
                } else {
                    console.error('Gagal mengambil data:', response);
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, [month]);

    return (
        <div className="w-full">
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default BarChart;

BarChart.propTypes = {
    month: PropTypes.number.isRequired,
};
