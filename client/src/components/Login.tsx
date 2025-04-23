import { useClickAway } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { FormikErrors, useFormik } from 'formik';
import { LoginModel } from "@/models/Login.model";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginCall, loginFacebook, loginGoogle, registerCall, resetStatus, resetStatusRegister, setShowEmailVerification, setShowUserLogin } from "@/slice/auth/Auth.slice";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from "./ui/label";
import { setLogined, setUser } from "@/slice/app/App.slice";
import toast from "react-hot-toast";
import { setCartItem } from "@/slice/cart/Cart.slice";
import { assets } from "@/assets/assets";
import { Tooltip } from "react-tooltip";
import { useGoogleLogin } from "@react-oauth/google";
import { useLogin } from "react-facebook";

const Login = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
    const appState = useAppSelector(state => state.app);
    const { login, isLoading, error } = useLogin();
    const [state, setState] = useState<"login" | "register">("login");
    const [rememberChecked, setRememberChecked] = useState<CheckedState>(localStorage.getItem('remember_email') !== null)
    const ref: React.RefObject<HTMLFormElement> = useClickAway(() => {
        dispatch(setShowUserLogin(false));
    });
    const formikAuth = useFormik<AuthProps>({
        initialValues: {
            email: "",
            password: "",
            name: ""
        },
        validate: (data) => {
            const errors: FormikErrors<AuthProps> = {};
            if (!data.email) {
                errors.email = "Email is required";
            }
            if (!data.password) {
                errors.password = "Password is required";
            }
            if (state === "register" && !data.name) {
                errors.name = "Name is required";
            }
            return errors;
        },
        onSubmit: (data) => {
            switch (state) {
                case "login":
                    dispatch(loginCall(new LoginModel(data.email, data.password, Boolean(rememberChecked))));
                    break;
                case "register":
                    {
                        const payload = {
                            name: data.name,
                            email: data.email,
                            password: data.password
                        };
                        dispatch(registerCall(payload));
                    }
                    break;
            }
        }
    });
    const handleGithubLogin = async () => {
        alert("Github Login");
    }
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async credentialResponse => {
            try {
                await dispatch(loginGoogle({ accessToken: credentialResponse.access_token }));
            } catch (error: any) {
                toast.error(error.message);
            }
        },
        onError: () => {
            toast.error("Login Failed!");
        },
    })
    const handleFacebookLogin = async () => {
        try {
            const response = await login({
                scope: "email"
            })
            if (error) {
                return toast.error(error.message);
            }
            if (response.status === "connected") {
                dispatch(loginFacebook({
                    accessToken: response.authResponse.accessToken,
                    userID: response.authResponse.userID
                }))
            } else {
                return toast.error("Something went wrong!");
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        switch (authState.status) {
            case "completed":
                {
                    const localUser = localStorage.getItem('user');
                    const user = JSON.parse(localUser ?? '{}');
                    dispatch(setUser(user));
                    dispatch(setShowUserLogin(false));
                    dispatch(setLogined(true));
                    dispatch(setCartItem(user.cartItems));
                    if (!appState.user?.isVerified) {
                        dispatch(setShowEmailVerification(true));
                    }
                    toast.success(authState.success ?? "Login successful!")
                    dispatch(resetStatus());
                }
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatus());
                break
        }
    }, [appState.user?.isVerified, authState.error, authState.status, authState.success, dispatch]);

    useEffect(() => {
        switch (authState.statusRegister) {
            case "completed":
                {
                    const localUser = localStorage.getItem('user');
                    const user = JSON.parse(localUser ?? '{}');
                    dispatch(setUser(user));
                    dispatch(setShowUserLogin(false));
                    dispatch(setLogined(true));
                    if (appState.user?.isVerified) {
                        dispatch(setCartItem(user.cartItems));
                        toast.success(authState.success ?? "Login successful!")
                    } else {
                        dispatch(setShowEmailVerification(true));
                    }
                    dispatch(resetStatusRegister());
                }
                break
            case "failed":
                toast.dismiss();
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatusRegister());
                break
        }
    }, [appState.user?.isVerified, authState.error, authState.statusRegister, authState.success, dispatch]);

    useEffect(() => {
        if (state === "login") {
            formikAuth.setFieldValue("email", (localStorage.getItem('remember_email') ?? ""))
            formikAuth.setFieldValue("password", (localStorage.getItem('remember_password') ?? ""))
        } else {
            formikAuth.resetForm();
        }
    }, [state])
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center text-sm text-gray-600 bg-black/50">
            <form onSubmit={formikAuth.handleSubmit} ref={ref} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => formikAuth.setFieldValue("name", e.target.value)} value={formikAuth.values.name} placeholder="Enter your Name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input
                        onChange={(e) => formikAuth.setFieldValue("email", e.target.value)}
                        value={formikAuth.values.email}
                        placeholder="Enter your Email"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="email"
                        required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input
                        onChange={(e) => formikAuth.setFieldValue("password", e.target.value)}
                        value={formikAuth.values.password}
                        placeholder="Enter your Password"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                {state === "login" &&
                    <div className='space-y-2 w-fit flex items-center'>
                        <Checkbox id='remember' checked={rememberChecked} onCheckedChange={(checked) => setRememberChecked(checked ?? false)} className='data-[state=checked]:bg-primary' />
                        <Label htmlFor='remember' className='cursor-pointer text-text ml-1 pb-2'>Remember</Label>
                    </div>
                }
                <div className="grid grid-cols-1 w-full gap-4">
                    <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer active:scale-90">
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-full h-px bg-gray-300/90"></div>
                        <p className="flex-1 text-nowrap font-semibold uppercase text-gray-500/90">or</p>
                        <div className="w-full h-px bg-gray-300/90"></div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            disabled={authState.status === "loading"}
                            onClick={handleGithubLogin}
                            data-tooltip-id={"Github Login"}
                            type="button"
                            className="size-10 flex items-center justify-center bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 hover:shadow transition hover:-translate-y-1">
                            <img className="object-fill size-7" src={assets.github_icon} alt="Github Login" />
                        </button>
                        <Tooltip
                            id={"Github Login"}
                            place="bottom"
                            variant="dark"
                            content={"Github Login"}
                        />
                        <button
                            disabled={authState.status === "loading"}
                            onClick={() => handleGoogleLogin()}
                            data-tooltip-id={"Google Login"}
                            type="button"
                            className="size-10 flex items-center gap-2 justify-center bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 hover:shadow transition hover:-translate-y-1">
                            <img className="size-6" src={assets.google_icon} alt="Google Login" />
                        </button>
                        <Tooltip
                            id={"Google Login"}
                            place="bottom"
                            variant="dark"
                            content={"Google Login"}
                        />
                        <button
                            disabled={isLoading || authState.status === "loading"}
                            onClick={handleFacebookLogin}
                            data-tooltip-id={"Facebook Login"}
                            type="button"
                            className="size-10 flex items-center gap-2 justify-center bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 hover:shadow transition hover:-translate-y-1">
                            <img className="object-fill" src={assets.facebook_icon} alt="Facebook Login" />
                        </button>
                        <Tooltip
                            id={"Facebook Login"}
                            place="bottom"
                            variant="dark"
                            content={"Facebook Login"}
                        />

                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;