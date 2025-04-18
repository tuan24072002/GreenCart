import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assets } from "@/assets/assets"
import District from "@/components/address/District";
import Province from "@/components/address/Province";
import Ward from "@/components/address/Ward";
import { InputField } from "@/components/InputField";
import { useAppContext } from "@/context/AppContext";
import { AddressModel } from "@/models/Address.model";
import { addItem, resetActionState } from "@/slice/address/Address.slice";
import { FormikErrors, useFormik } from "formik";
import { useEffect } from "react"
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";


const AddAddress = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const addressState = useAppSelector(state => state.address);
    const appState = useAppSelector(state => state.app);
    const { navigate } = useAppContext();

    const formikAddress = useFormik<AddressModel>({
        initialValues: AddressModel.initialize(),
        validate: (data) => {
            const errors: FormikErrors<AddressModel> = {};
            if (!data.firstName) {
                errors.firstName = "First Name is required";
            }
            if (!data.lastName) {
                errors.lastName = "Last Name is required";
            }
            if (!data.email) {
                errors.email = "Email is required";
            }
            if (!data.street) {
                errors.street = "Street is required";
            }
            if (!data.ward) {
                errors.ward = "Ward is required";
            }
            if (!data.district) {
                errors.district = "District is required";
            }
            if (!data.city) {
                errors.city = "City is required";
            }
            return errors;
        },
        onSubmit: (values) => {
            const payload = {
                address: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    street: values.street,
                    city: values.city,
                    ward: values.ward,
                    district: values.district,
                    phone: values.phone
                }
            }
            switch (addressState.action) {
                case "INS":
                    dispatch(addItem(payload));
                    break;

                default:
                    break;
            }
        },
    })

    useEffect(() => {
        switch (addressState.statusAction) {
            case "failed":
                toast.error(addressState.error ?? "");
                dispatch(resetActionState());
                break;
            case "loading":
                break;
            case "completed":
                toast.success(addressState.success ?? "");
                formikAddress.resetForm();
                navigate("/cart");
                dispatch(resetActionState());
                break;
        }
    }, [dispatch, addressState])

    useEffect(() => {
        formikAddress.setFieldValue("district", "");
        formikAddress.setFieldValue("ward", "");
    }, [formikAddress.values.city]);

    useEffect(() => {
        if (!appState.logined) {
            navigate("/cart");
        }
    }, [appState.logined, navigate])
    return (
        <div className="mt-16 pb-16 max-w-7xl mx-auto">
            <p className="text-2xl md:text-3xl text-accent-foreground">{t(`addAddress.title1`)} <span className="text-primary font-semibold">{t(`addAddress.title2`)}</span></p>
            <div className="flex flex-col-reverse lg:flex-row mt-10 items-center justify-between">
                <div className="flex-1 md:max-w-xl w-full">
                    <form onSubmit={formikAddress.handleSubmit} className="space-y-4 mt-6 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder={t(`addAddress.firstName`)}
                                onChange={(e) => formikAddress.setFieldValue("firstName", e.target.value)}
                                value={formikAddress.values.firstName}
                            />
                            <InputField
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder={t(`addAddress.lastName`)}
                                onChange={(e) => formikAddress.setFieldValue("lastName", e.target.value)}
                                value={formikAddress.values.lastName}
                            />
                        </div>
                        <InputField
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t(`addAddress.email`)}
                            onChange={(e) => formikAddress.setFieldValue("email", e.target.value)}
                            value={formikAddress.values.email}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Province
                                value={formikAddress.values.city}
                                onChange={(value) => formikAddress.setFieldValue("city", value)}
                                placeholder={t(`addAddress.city`)} />
                            <District
                                value={formikAddress.values.district}
                                onChange={(value) => formikAddress.setFieldValue("district", value)}
                                province={formikAddress.values.city}
                                placeholder={t(`addAddress.district`)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Ward
                                value={formikAddress.values.ward}
                                onChange={(value) => formikAddress.setFieldValue("ward", value)}
                                province={formikAddress.values.city}
                                district={formikAddress.values.district}
                                placeholder={t(`addAddress.ward`)}
                            />
                            <InputField
                                id="street"
                                name="street"
                                type="text"
                                placeholder={t(`addAddress.street`)}
                                onChange={(e) => formikAddress.setFieldValue("street", e.target.value)}
                                value={formikAddress.values.street}
                            />
                        </div>
                        <InputField
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder={t(`addAddress.phone`)}
                            onChange={(e) => formikAddress.setFieldValue("phone", e.target.value)}
                            value={formikAddress.values.phone}
                        />
                        <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded-md">
                            {t(`addAddress.button`)}
                        </button>
                    </form>
                </div>
                <img src={assets.add_address_iamge} alt="Add Address" className="md:mr-16 mb-16" />
            </div>
        </div>
    )
}

export default AddAddress