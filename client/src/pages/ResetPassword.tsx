import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resetPassword, resetStatusResetPassword } from "@/slice/auth/Auth.slice";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { token } = useParams();
    const navigate = useNavigate();
    const authState = useAppSelector(state => state.auth);
    const [data, setData] = useState({
        newPass: "",
        confirmNewPass: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (data["newPass"] !== data["confirmNewPass"]) {
            return toast.error("Passwords do not match!");
        }
        const payload = {
            token,
            data: {
                password: data.newPass,
                confirmPassword: data.confirmNewPass
            }
        }
        dispatch(resetPassword(payload));
    }
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate])
    useEffect(() => {
        switch (authState.statusResetPassword) {
            case "completed":
                toast.success(authState.success ?? "Email sent successfully!");
                navigate("/");
                dispatch(resetStatusResetPassword());
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatusResetPassword());
                break
        }
    }, [authState.error, authState.statusResetPassword, authState.success, dispatch, navigate]);

    return (
        <div className="size-full flex items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl h-fit">
                <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="newPass" className="md:text-lg text-base">
                        {t(`settings.Change Password.newPass`)}:
                    </Label>
                    <InputField
                        id="newPass"
                        name="newPass"
                        type="password"
                        onChange={handleChange}
                        value={data["newPass"]}
                    />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="confirmNewPass" className="md:text-lg text-base">
                        {t(`settings.Change Password.confirmPass`)}:
                    </Label>
                    <InputField
                        id="confirmNewPass"
                        name="confirmNewPass"
                        type="password"
                        onChange={handleChange}
                        value={data["confirmNewPass"]}
                    />
                </div>
                <div className="w-full flex items-center justify-end">
                    <Button type="submit" className="">{t(`settings.Change Password.button`)}</Button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword