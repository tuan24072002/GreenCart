import { useAppSelector } from "@/app/hooks";
import { ApexChart } from "@/components/ApexChart";
import { useThemeContext } from "@/context/ThemeContext";
import { ApexOptions } from "apexcharts";
const Chart = ({ selectedChart, selectedFilterChart }: { selectedChart: ChartType, selectedFilterChart: filterChartType }) => {
    const { theme } = useThemeContext();
    const dashboardState = useAppSelector(state => state.dashboard);
    const options: ApexOptions = {
        chart: {
            id: "basic-bar",
        },
        xaxis: {
            categories: dashboardState.item.graphData.categories,
            title: {
                text: selectedFilterChart.charAt(0).toUpperCase() + selectedFilterChart.slice(1),
                style: {
                    color: "#44ae7c"
                }
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return Number(value).toLocaleString();
                }
            },
            title: {
                text: "VNĐ",
                style: {
                    color: "#44ae7c"
                }
            },
        },
        colors: ["#44ae7c"],
        tooltip: {
            enabled: true,
            theme: theme,
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