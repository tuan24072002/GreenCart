import { LoginModel } from "@/models/Login.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";

interface Authen {
  authenticate(args: LoginModel): any;
}
class LocalAuthen implements Authen {
  async authenticate(arg: LoginModel) {
    const response = await HttpService.doPostRequest(
      "/user/login",
      {
        email: arg.email,
        password: arg.password,
      },
      false
    );
    if (response.status == 200) {
      const data = response.data.data;

      if (arg.remember) {
        localStorage.setItem("remember_email", arg.email);
        localStorage.setItem("remember_password", arg.password);
      } else {
        localStorage.removeItem("remember_email");
        localStorage.removeItem("remember_password");
      }
      localStorage.setItem("accessToken", data.tokens.accessToken);
      HttpService.setToken(data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      HttpService.setLocalRefToken(data.tokens.refreshToken);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("cartItems", JSON.stringify(data.user.cartItems));
      return data.profile;
    }
    return { code: response.status, message: response.statusText };
  }
}
class AuthenManager {
  executeAuthenticate(arg: LoginModel) {
    if (arg instanceof LoginModel) {
      return new LocalAuthen().authenticate(arg);
    }
  }
}
class AuthenEventHandler {
  constructor(public authenManager: AuthenManager) {}
  handleAuthen(arg: LoginModel) {
    return this.authenManager.executeAuthenticate(arg);
  }
}
class AuthService {
  login(arg: LoginModel, authenManager: AuthenManager) {
    const authenHandler = new AuthenEventHandler(authenManager);
    return authenHandler.handleAuthen(arg);
  }
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    HttpService.setToken("");
    localStorage.removeItem("refreshToken");
    HttpService.setLocalRefToken("");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartItems");
  }
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  }
  async changePassword(data: any) {
    const res = await HttpService.doPatchRequest(`/auth/password/change`, data);
    return parseCommonHttpResult(res);
  }
  async resetPassword(data: any) {
    const res = await HttpService.doPatchRequest(`/auth/password/reset`, data);
    return parseCommonHttpResult(res);
  }
}
export { AuthService, AuthenManager, LocalAuthen, AuthenEventHandler };
