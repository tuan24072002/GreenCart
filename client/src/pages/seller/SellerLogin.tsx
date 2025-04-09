import { useAppContext } from "@/context/AppContext"
import { FormEvent, useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { InputField } from "../../components/InputField";

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate } = useAppContext();
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSeller(true);
    }
    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller, navigate])
    return !isSeller && (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center text-sm text-gray-600">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                <p className="text-2xl font-medium m-auto"><span className="text-primary">Seller</span> Login</p>
                <div className="w-full">
                    <Label htmlFor="email">Email</Label>
                    <InputField
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={data["email"]}
                        placeholder="john.doe@gmail.com"
                        required
                    />
                </div>
                <div className="w-full">
                    <Label htmlFor="password">Password</Label>
                    <InputField
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        value={data["password"]}
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