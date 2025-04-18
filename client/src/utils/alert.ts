import Swal from "sweetalert2";

const failed = (text?: string) => {
  if (text !== "Unauthorized") {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: text ?? "Lỗi chưa xác định",
      timer: 15000,
      customClass: {
        popup: "",
        confirmButton: "bg-main text-white py-2 px-4 rounded hover:bg-blue-600",
      },
    });
  }
};
const completed = (text?: string) => {
  Swal.fire({
    icon: "success",
    showConfirmButton: false,
    title: "Thành công!",
    text: text,
    timer: 2000,
  });
};
const processing = (text?: string, isTimer: boolean = true) => {
  Swal.fire({
    title: text ? text : "Đang tải...",
    timer: isTimer ? 500 : undefined,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
const confirm = (text: string, onConfirm: () => void) => {
  Swal.fire({
    title: "Xác nhận",
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
    customClass: {
      confirmButton: "bg-main text-white py-2 px-4 rounded hover:bg-blue-600",
      cancelButton:
        "bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm?.();
    }
  });
};
interface warningAlertProps {
  title: string;
  text: string;
}
const warning = (props: warningAlertProps) => {
  Swal.fire({
    icon: "warning",
    title: props.title ?? "Tính năng không thể thay đổi!",
    // text: props.text ?? "",
    html: props.text ?? "",
    showConfirmButton: false,
  });
};
export { failed, completed, processing, confirm, warning };
