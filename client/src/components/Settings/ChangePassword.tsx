import { FormEvent, useState } from "react"
import { InputField } from "../InputField"
import { Label } from "../ui/label"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { useAppDispatch } from "@/app/hooks"
import { changePassword } from "@/slice/user/User.slice"
import toast from "react-hot-toast"

const ChangePassword = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [data, setData] = useState({
        currPass: "",
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
        dispatch(changePassword({ password: data.currPass, newPassword: data.newPass }));
    }
    return (
        <div className="pt-4 pl-2">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-5xl mx-auto">
                <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="currPass" className="md:text-lg text-base">
                        {t(`settings.Change Password.currentPass`)}:
                    </Label>
                    <InputField
                        type="password"
                        id="currPass"
                        name="currPass"
                        onChange={handleChange}
                        value={data["currPass"]}
                    />
                </div>
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

export default ChangePassword