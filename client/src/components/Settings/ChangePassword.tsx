import { useState } from "react"
import { InputField } from "../InputField"
import { Label } from "../ui/label"

const ChangePassword = () => {
    const [data, setData] = useState({
        currPass: "",
        newPass: "",
        confirmNewPass: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }
    return (
        <div className="pt-4 pl-2">
            <div className="space-y-4 w-full max-w-5xl mx-auto">
                <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="currPass" className="md:text-lg text-base">
                        Current Password:
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
                        New Password:
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
                        Confirm New Password:
                    </Label>
                    <InputField
                        id="confirmNewPass"
                        name="confirmNewPass"
                        type="password"
                        onChange={handleChange}
                        value={data["confirmNewPass"]}
                    />
                </div>
            </div>
        </div>

    )
}

export default ChangePassword