class DashboardModel {
  summary: {
    users: number;
    products: number;
    orders: number;
    revenue: number;
  };
  graphData: GraphDataProps;
  constructor(
    summary: {
      users: number;
      products: number;
      orders: number;
      revenue: number;
    },
    graphData: GraphDataProps
  ) {
    this.summary = summary;
    this.graphData = graphData;
  }
  static initialize() {
    return {
      summary: {
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0,
      },
      graphData: {
        categories: [],
        series: [],
      },
    };
  }
}
export { DashboardModel };
