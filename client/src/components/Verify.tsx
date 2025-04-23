import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AuthService } from "@/services/Auth.service";
import { selectItem, setList } from "@/slice/address/Address.slice";
import { setLogined, setUser } from "@/slice/app/App.slice";
import { resendVerifyEmail, resetStatusResendVerifyEmail, resetStatusVerifyEmail, setShowEmailVerification, verifyEmail } from "@/slice/auth/Auth.slice";
import { setCartItem } from "@/slice/cart/Cart.slice";
import { Loader2, RotateCcw } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast";

const Verify = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const appState = useAppSelector(state => state.app);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRef = useRef<(HTMLInputElement)[]>([]);

    const handleChange = (index: number, value: string) => {
        const newCode = structuredClone(code);
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < pastedCode.length; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            const lastFieldIndex = newCode.length - 1;
            const focusIndex = lastFieldIndex < 5 ? lastFieldIndex + 1 : lastFieldIndex;
            inputRef.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRef.current[index + 1].focus();
            }
        }
    }
    const setInputRef = useCallback((el: HTMLInputElement | null, index: number) => {
        if (el) {
            inputRef.current[index] = el;
        }
    }, []);
    const handleResendVerifyEmail = async () => {
        await dispatch(resendVerifyEmail({ email: appState.user?.email ?? "" }));
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }
    const submitCode = useCallback(async () => {
        const codeString = code.join('');
        await dispatch(verifyEmail({ code: codeString }));
    }, [code, dispatch])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitCode();
    }
    const handleLogout = () => {
        dispatch(setLogined(false));
        dispatch(setUser(null));
        AuthService.logout();
        dispatch(setCartItem({}));
        dispatch(setList([]));
        dispatch(selectItem({}));
        dispatch(setShowEmailVerification(false));
    }
    useEffect(() => {
        if (code.every(value => value !== "")) {
            submitCode();
        }
    }, [code, submitCode])

    useEffect(() => {
        switch (authState.statusVerifyEmail) {
            case "completed":
                {
                    toast.success(authState.success ?? "Verify successful!")
                    dispatch(resetStatusVerifyEmail());
                    dispatch(setShowEmailVerification(false));
                }
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatusVerifyEmail());
                break
        }
    }, [authState.error, authState.statusVerifyEmail, authState.success, dispatch]);
    useEffect(() => {
        switch (authState.statusResendVerifyEmail) {
            case "completed":
                {
                    toast.success(authState.success ?? "Resend verify successful!")
                    dispatch(resetStatusResendVerifyEmail());
                }
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatusResendVerifyEmail());
                break
        }
    }, [authState.error, authState.statusResendVerifyEmail, authState.success, dispatch]);
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center text-sm text-gray-600 bg-black/50">
            <div className="flex flex-col gap-4 m-auto items-center p-8 py-12 w-96 sm:w-lg rounded-lg shadow-xl border border-gray-200 bg-white">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                    Verify Your Email
                </h2>
                <p className='text-center text-muted-foreground mb-6'>Enter the 6-digit code sent to your email address.</p>
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="flex flex-wrap items-center justify-around">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => setInputRef(el, index)}
                                type='text'
                                maxLength={6}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-primary focus:outline-none'
                            />
                        ))}
                    </div>
                    <p className="hover:underline text-muted-foreground flex items-center gap-2 cursor-pointer w-fit" onClick={handleResendVerifyEmail}>Resend code <RotateCcw size={18} /></p>
                    <button
                        type="submit"
                        disabled={authState.statusVerifyEmail === "loading" || authState.statusResendVerifyEmail === "loading"}
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r  from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center">
                        {
                            (authState.statusVerifyEmail === "loading" || authState.statusResendVerifyEmail === "loading") ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Verify Email"
                        }
                    </button>
                    <button
                        disabled={authState.statusVerifyEmail === "loading" || authState.statusResendVerifyEmail === "loading"}
                        className="w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center"
                        type="button"
                        onClick={handleLogout}>
                        {
                            (authState.statusVerifyEmail === "loading" || authState.statusResendVerifyEmail === "loading") ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Logout"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Verify