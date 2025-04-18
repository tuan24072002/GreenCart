import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const DashboardService = {
  async getSummary(data: any) {
    const res = await HttpService.doGetRequest(`dashboard/summary`, data);
    return parseCommonHttpResult(res);
  },
};
