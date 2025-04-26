import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";

export const AuthService = {
  async login(data: any) {
    if (data.remember) {
      localStorage.setItem("remember_email", data.email);
      localStorage.setItem("remember_password", data.password);
    } else {
      localStorage.removeItem("remember_email");
      localStorage.removeItem("remember_password");
    }
    const res = await HttpService.doPostRequest(`/user/login`, data);
    return parseCommonHttpResult(res);
  },
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    HttpService.setToken("");
    localStorage.removeItem("refreshToken");
    HttpService.setLocalRefToken("");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartItems");
  },
  getCurrentUser() {
    const userString = localStorage.getItem("user");
    if (userString) return JSON.parse(userString);
    return null;
  },
  async register(data: any) {
    const res = await HttpService.doPostRequest(`/user/register`, data);
    return parseCommonHttpResult(res);
  },
  async changePassword(data: any) {
    const res = await HttpService.doPutRequest(`/user/change-password`, data);
    return parseCommonHttpResult(res);
  },
  async loginGoogle(data: any) {
    const res = await HttpService.doPostRequest(`user/login-google`, data);
    return parseCommonHttpResult(res);
  },
  async loginFacebook(data: any) {
    const res = await HttpService.doPostRequest(`user/login-facebook`, data);
    return parseCommonHttpResult(res);
  },
  async verifyEmail(data: any) {
    const res = await HttpService.doPostRequest(`user/verify-email`, data);
    return parseCommonHttpResult(res);
  },
  async resendVerifyEmail(data: any) {
    const res = await HttpService.doPostRequest(
      `user/resend-verify-email`,
      data
    );
    return parseCommonHttpResult(res);
  },
  async sendCodeChangePass(data: any) {
    const res = await HttpService.doPostRequest(
      `user/send-code-change-password`,
      data
    );
    return parseCommonHttpResult(res);
  },
  async forgotPassword(data: any) {
    const res = await HttpService.doPostRequest(`user/forgot-password`, data);
    return parseCommonHttpResult(res);
  },
  async resetPassword(data: any) {
    const res = await HttpService.doPostRequest(
      `user/reset-password/${data.token}`,
      data.data
    );
    return parseCommonHttpResult(res);
  },
};
