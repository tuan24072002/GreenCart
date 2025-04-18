import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Chart from "@/components/dashboard/Chart";
import Summary from "@/components/dashboard/Summary";
import EmptyList from "@/components/EmptyList";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getSummary } from "@/slice/dashboard/Dashboard.slice";
import { Skeleton } from "@/components/ui/skeleton";
import DatePick from "@/components/DatePicker";

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const dashboardState = useAppSelector(state => state.dashboard);
    const [selectedChart, setSelectedChart] = useState<ChartType>('line');
    const [selectedFilterChart, setSelectedFilterChart] = useState<filterChartType>('month');
    const [fromDate, setFromDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
    const [toDate, setToDate] = useState<Date>(new Date());
    useEffect(() => {
        if ((fromDate && toDate) || selectedFilterChart) {
            dispatch(getSummary({ groupBy: selectedFilterChart, fromDate: fromDate, toDate: toDate }));
        }
    }, [fromDate, toDate, dispatch, selectedFilterChart]);

    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto flex-1 p-4">
            <Summary />
            {
                dashboardState.status === "loading" ?
                    <div className="bg-accent p-4 rounded-md shadow-md w-full h-[calc(100vh-230.89px)]">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-56" />
                            <div className="flex md:flex-row flex-col items-center gap-2">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </div>
                        <div className="space-y-4 mt-16">
                            {
                                Array.from({ length: 8 }).map((_, index) => (
                                    <Skeleton key={index} className="h-10 w-full" />
                                ))
                            }
                        </div>
                    </div> :
                    <div className="flex flex-col bg-accent p-4 rounded-md shadow-md w-full gap-10 h-[calc(100vh-230.89px)]">
                        <div className="flex justify-between items-center">
                            <h4 className="text-gray-600 text-xl font-bold">Chart by Revenue:</h4>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
                                <Select
                                    value={selectedChart}
                                    onValueChange={(value) => setSelectedChart(value as ChartType)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Line" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="line">Line</SelectItem>
                                        <SelectItem value="area">Area</SelectItem>
                                        <SelectItem value="bar">Bar</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedFilterChart}
                                    onValueChange={(value) => setSelectedFilterChart(value as filterChartType)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="year">Year</SelectItem>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="hour">Hour</SelectItem>
                                        <SelectItem value="minute">Minute</SelectItem>
                                        <SelectItem value="second">Second</SelectItem>
                                    </SelectContent>
                                </Select>
                                <DatePick
                                    className="w-[120px]"
                                    label="From date"
                                    date={fromDate}
                                    setDate={setFromDate}
                                />
                                <DatePick
                                    className="w-[120px]"
                                    label="To date"
                                    date={toDate}
                                    setDate={setToDate}
                                />
                            </div>
                        </div>
                        {
                            (dashboardState.item.graphData.categories.length === 0 || dashboardState.item.graphData.series.length === 0) ?
                                <EmptyList /> :
                                <Chart selectedChart={selectedChart} selectedFilterChart={selectedFilterChart} />
                        }
                    </div>
            }
        </div>
    )
}

export default Dashboard