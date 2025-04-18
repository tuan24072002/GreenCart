import { t } from "i18next";

export const errorMessage = (error: any) => {
  //console.log(error)
  let message = "Lỗi kết nối. Vui lòng thử lại!";
  if (error.message !== undefined) {
    if (error.message.content !== undefined) {
      message = error.message.content;
    } else {
      message = error.message;
      if (error.error && error.error.message) {
        message += ". " + error.error.message;
      }
    }
  } else {
    if (error.code !== undefined) {
      message = t("response." + error.code);
    } else {
      message = t("response.UNDEFINED");
    }
  }
  return message;
};
export const urlToFile = async (url: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const originalFileName = pathname.substring(pathname.lastIndexOf("/") + 1);
  return new File([blob], originalFileName, { type: blob.type });
};
export const includeTax = (price: number): string => {
  return (price + price * 0.02)?.toLocaleString();
};
