import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { DashboardService } from '../../api/apiTransaction';
import PropTypes from 'prop-types';

const DonutChart = ({ date }) => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'donut',
                height: 450,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 2500,
                    animateGradually: {
                        enabled: true,
                        delay: 300,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 500,
                    },
                },
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '22px',
                                fontWeight: 600,
                                color: '#333',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '16px',
                                fontWeight: 400,
                                color: '#666',
                                offsetY: 10,
                                formatter: (val) => `${val}%`,
                            },
                        },
                    },
                },
            },
            labels: [],
            legend: {
                show: true,
                position: 'bottom',
            },
            responsive: [
                {
                    breakpoint: 680,
                    options: {
                        chart: {
                            width: 300,
                        },
                    },
                },
            ],
            title: {
                text: 'Status Transaction',
                align: 'start',
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
        },
    });
    console.log(date);
    useEffect(() => {
        const fetchData = async () => {
            const data = await DashboardService.getDataChartDonut(date);
            if (data && data.statusCode === 200) {
                // Format data sesuai dengan chart yang diinginkan
                const series = data.data.statuses.map((status) =>
                    parseFloat(status.percentage)
                );
                const labels = data.data.statuses.map(
                    (status) => status.status
                );

                // Update chart data
                setChartData((prevData) => ({
                    ...prevData,
                    series: series,
                    options: {
                        ...prevData.options,
                        labels: labels,
                    },
                }));
            }
        };

        fetchData();
    }, [date]);
    console.log(chartData.series.length > 0);
    return (
        <div className="w-full">
            {chartData.series.length > 0 ? (
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height={365}
                />
            ) : (
                <div className="flex flex-col justify-center items-center min-h-[365px]">
                    <img src={'/no-data.png'} width={100} alt="" />
                    <h1 className="text-gray-400">No data</h1>
                </div>
            )}
        </div>
    );
};

export default DonutChart;

DonutChart.propTypes = {
    date: PropTypes.number.isRequired,
};
