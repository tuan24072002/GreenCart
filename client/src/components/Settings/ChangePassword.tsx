import { FormEvent, useEffect, useState } from "react"
import { InputField } from "../InputField"
import { Label } from "../ui/label"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { changePassword } from "@/slice/user/User.slice"
import toast from "react-hot-toast"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Mail, RectangleEllipsis, Send } from "lucide-react"
import { resetStatusSendCodeChangPass, sendCodeChangePass } from "@/slice/auth/Auth.slice"
import { useCountdown } from "@/hooks/useCountDown"
import { cn } from "@/lib/utils"

const ChangePassword = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const appState = useAppSelector(state => state.app);
    const [counter, sendCode] = useCountdown('changePassword', 30);
    const [code, setCode] = useState("");
    const [state, setState] = useState("password");
    const [data, setData] = useState({
        currPass: "",
        newPass: "",
        confirmNewPass: ""
    })
    const handleSendCodeChangePass = async () => {
        await dispatch(sendCodeChangePass({ email: appState.user?.email }));
        sendCode();
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        toast.dismiss();
        if (data["newPass"] !== data["confirmNewPass"]) {
            return toast.error("Passwords do not match!");
        }
        switch (state) {
            case "password":
                dispatch(changePassword({ password: data.currPass, newPassword: data.newPass }));
                break;
            case "email":
                dispatch(changePassword({ code, newPassword: data.newPass }));
                break;
        }
    }
    useEffect(() => {
        switch (authState.statusSendCodeChangePass) {
            case "completed":
                toast.success(authState.success ?? "Success");
                dispatch(resetStatusSendCodeChangPass());
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatusSendCodeChangPass());
                break
        }
    }, [authState.error, authState.statusSendCodeChangePass, authState.success, dispatch]);

    return (
        <div className="pt-4 pl-2">
            <Tabs value={state} onValueChange={setState} defaultValue="password" className="w-full max-w-3xl mx-auto">
                <TabsList className="flex mb-4">
                    <TabsTrigger value="password" className="w-[120px]">
                        <RectangleEllipsis className="text-primary size-5" /> Password
                    </TabsTrigger>
                    <TabsTrigger value="email" className="w-[120px]">
                        <Mail className="text-primary size-5" /> Email
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="password" asChild>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                </TabsContent>
                <TabsContent value="email">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4 w-full">
                            <Label htmlFor="code" className="flex items-center gap-2">
                                <p className="md:text-lg text-base">
                                    {t(`settings.Change Password.code`)}:
                                </p>

                            </Label>
                            <div className="w-fit">
                                <InputOTP value={code} onChange={(e) => setCode(e)} maxLength={6} id="code" containerClassName="gap-1">
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={1} />
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4} />
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <Button
                                disabled={counter > 0 || authState.statusSendCodeChangePass === "loading"}
                                onClick={handleSendCodeChangePass}
                                size="icon"
                                type="button"
                                className={cn("bg-primary/10 border border-primary/40 group active:scale-90 text-primary hover:text-white", (counter > 0 || authState.statusSendCodeChangePass === "loading") && "bg-gray-200 !text-gray-400")}>
                                <Send />
                            </Button>
                            {
                                counter > 0 &&
                                <p className="text-sm text-muted-foreground">
                                    {counter}s
                                </p>
                            }
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
                            <Button type="submit" className="active:scale-90">{t(`settings.Change Password.button`)}</Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs >

        </div >

    )
}

export default ChangePassword