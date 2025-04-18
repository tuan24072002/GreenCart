const isFormFieldInvalid = (name: string, formik: any) => {
  const accessNestedField = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  };

  const error = accessNestedField(formik.errors, name);
  const touched = accessNestedField(formik.touched, name);
  return !!(touched && error);
};
const getFormErrorMessage = (name: string, formik: any) => {
  const accessNestedField = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  };

  const error = accessNestedField(formik.errors, name);
  return isFormFieldInvalid(name, formik) ? (
    <span className="text-red-600 text-xs">{error}</span>
  ) : null;
};

const getFormErrorMessageString = (name: string, formik: any) => {
  return isFormFieldInvalid(name, formik) ? formik.errors[name] : "";
};
export { isFormFieldInvalid, getFormErrorMessage, getFormErrorMessageString };
