import axios, { AxiosResponse } from "axios";

class HttpService {
  static instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
    timeout: 180000,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json",
    },
  });
  static isRefreshing = false;
  static refreshMethod: Promise<AxiosResponse<any, any>>;
  static getLocalToken() {
    return localStorage.getItem("accessToken");
  }
  static getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
  }
  static setToken(token: string) {
    HttpService.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  }
  static setLocalRefToken(token: string) {
    localStorage.setItem("refreshToken", token);
  }
  static initialize() {
    const token = HttpService.getLocalToken();
    if (token) {
      HttpService.setToken(token);
    }
    HttpService.instance.interceptors.request.use((request) => {
      return request;
    });
    const refreshToken = () => {
      if (HttpService.isRefreshing) {
        return HttpService.refreshMethod;
      }
      HttpService.isRefreshing = true;
      HttpService.refreshMethod = this.doPostRequest(
        "/user/refresh",
        {
          refreshToken: this.getLocalRefreshToken(),
        },
        false
      );
      return HttpService.refreshMethod;
    };
    HttpService.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const { data } = error.response;
        if (
          data.message === "Invalid access token!" &&
          data.error !== "Invalid refresh token!"
        ) {
          try {
            console.log("call Refresh");
            const rs = await refreshToken();
            if (rs.status === 200) {
              const { accessToken, refreshToken } = rs.data.data.tokens;
              if (HttpService.isRefreshing) {
                HttpService.setToken(accessToken);
                HttpService.setLocalRefToken(refreshToken);
                HttpService.isRefreshing = false;
              }
              const config = error.config;
              config.headers["Authorization"] = `Bearer ${accessToken}`;
              return await HttpService.instance.request(config);
            } else {
              return Promise.reject(rs);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
  static async doPrintRequest(url: string, data: any) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  }
  static async doUploadRequest(url: string, data: any) {
    delete HttpService.instance.defaults.headers["Content-Type"];
    delete HttpService.instance.defaults.headers["Accept"];
    return HttpService.instance.post(url, data, {
      headers: { "Content-Type": "multipart/form-data", Accept: "*/*" },
    });
  }
  static async doPostRequest(url: string, data: any, withAccessToken = true) {
    if (!withAccessToken) {
      delete HttpService.instance.defaults.headers["Authorization"];
      return HttpService.instance.post(url, data);
    } else {
      const params = { ...Object(data) };
      const response = HttpService.instance.post(url, params);
      return response;
    }
  }

  static async doGetRequest(url: string, data: any) {
    const params = { ...Object(data) };
    return HttpService.instance.get(url, { params: params });
  }

  static async doPatchRequest(url: string, data: any) {
    const params = { ...Object(data) };
    return HttpService.instance.patch(`${url}`, params);
  }

  static async doPutRequest(url: string, data: any) {
    const params = { ...Object(data) };
    return HttpService.instance.put(url, params);
  }

  static async doDeleteRequest(url: string, data: any) {
    const params = { ...Object(data) };
    return HttpService.instance.delete(`${url}`, { data: params });
  }
}
export { HttpService };
