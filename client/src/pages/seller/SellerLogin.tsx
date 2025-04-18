import { Label } from "../../components/ui/label";
import { InputField } from "../../components/InputField";
import { FormikErrors, useFormik } from "formik";
import { useAppDispatch } from "@/app/hooks";
import { loginCall } from "@/slice/signin/Signin.slice";
import { LoginModel } from "@/models/Login.model";

const SellerLogin = () => {
    const dispatch = useAppDispatch();
    const formikAuth = useFormik<AuthProps>({
        initialValues: {
            email: "",
            password: "",
        },
        validate: (data) => {
            const errors: FormikErrors<AuthProps> = {};
            if (!data.email) {
                errors.email = "Email is required";
            }
            if (!data.password) {
                errors.password = "Password is required";
            }
            return errors;
        },
        onSubmit: (data) => {
            dispatch(loginCall(new LoginModel(data.email, data.password)));
        }
    });
    return (
        <form onSubmit={formikAuth.handleSubmit} className="min-h-screen flex items-center text-sm text-gray-600">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-accent">
                <p className="text-2xl font-medium m-auto"><span className="text-primary">Seller</span> Login</p>
                <div className="w-full space-y-1">
                    <Label htmlFor="email" className="lg:text-lg">Email</Label>
                    <InputField
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) => formikAuth.setFieldValue("email", e.target.value)}
                        value={formikAuth.values.email}
                        placeholder="john.doe@gmail.com"
                        required
                    />
                </div>
                <div className="w-full space-y-1">
                    <Label htmlFor="password" className="lg:text-lg">Password</Label>
                    <InputField
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => formikAuth.setFieldValue("password", e.target.value)}
                        value={formikAuth.values.password}
                        placeholder="******"
                        required
                    />
                </div>
                <button className="bg-primary hover:bg-primary-dull w-full text-white py-2 rounded-md">Login</button>
            </div>
        </form>
    )
}

export default SellerLogin