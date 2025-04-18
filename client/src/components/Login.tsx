import { useClickAway } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { FormikErrors, useFormik } from 'formik';
import { LoginModel } from "@/models/Login.model";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginCall, resetStatus, setShowUserLogin } from "@/slice/signin/Signin.slice";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from "./ui/label";
import { setLogined, setUser } from "@/slice/app/App.slice";
import toast from "react-hot-toast";
import { setCartItem } from "@/slice/cart/Cart.slice";

const Login = () => {
    const dispatch = useAppDispatch();
    const signinState = useAppSelector(state => state.signin);
    const [state, setState] = useState<"login" | "register">("login");
    const [rememberChecked, setRememberChecked] = useState<CheckedState>(localStorage.getItem('remember_email') !== null)
    const ref: React.RefObject<HTMLFormElement> = useClickAway(() => {
        dispatch(setShowUserLogin(false));
    });
    const formikAuth = useFormik<AuthProps>({
        initialValues: {
            email: state === "login" ? (localStorage.getItem('remember_email') ?? "") : "",
            password: state === "login" ? (localStorage.getItem('remember_password') ?? "") : "",
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
            dispatch(loginCall(new LoginModel(data.email, data.password, Boolean(rememberChecked))));
        }
    });
    useEffect(() => {
        switch (signinState.status) {
            case "completed":
                {
                    const localUser = localStorage.getItem('user');
                    const user = JSON.parse(localUser ?? '{}');
                    dispatch(setLogined(true));
                    dispatch(setUser(user));
                    dispatch(setShowUserLogin(false));
                    dispatch(setCartItem(user.cartItems));
                    toast.success(signinState.success ?? "Login successful!")
                    dispatch(resetStatus());
                }
                break
            case "failed":
                toast.error(signinState.error ?? "Something went wrong !");
                dispatch(resetStatus());
                break
        }
    }, [dispatch, signinState]);

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
                <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;