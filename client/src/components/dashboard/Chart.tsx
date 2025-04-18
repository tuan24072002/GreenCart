import { useAppSelector } from "@/app/hooks";
import { ApexChart } from "@/components/ApexChart";
import { ApexOptions } from "apexcharts";
const Chart = ({ selectedChart, selectedFilterChart }: { selectedChart: ChartType, selectedFilterChart: filterChartType }) => {
    const dashboardState = useAppSelector(state => state.dashboard);
    const options: ApexOptions = {
        chart: {
            id: "basic-bar",
        },
        xaxis: {
            categories: dashboardState.item.graphData.categories,
            title: {
                text: selectedFilterChart.charAt(0).toUpperCase() + selectedFilterChart.slice(1)
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return Number(value).toLocaleString();
                }
            },
            title: {
                text: "VNĐ"
            },
        },
        colors: ["#44ae7c"],
        tooltip: {
            enabled: true,
        },
    };
    const series = [
        {
            name: "Revenue",
            data: dashboardState.item.graphData.series
        },
    ];

    return (
        <ApexChart
            options={options}
            series={series}
            type={selectedChart}
            height="85%"
        />
    )
}

export default Chart