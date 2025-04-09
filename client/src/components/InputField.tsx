import { EyeClosed } from "lucide-react"
import { Input } from "./ui/input"
import { useState } from "react"

interface InputProps {
    id?: string,
    name?: string,
    type: string,
    placeholder?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: any
    required?: boolean
}
export const InputField = ({ name, id, type, placeholder, onChange, value, required }: InputProps) => {
    const [showPass, setShowPass] = useState(false);
    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                className="w-full px-2 py-5 border border-input rounded outline-none text-accent-foreground focus:border-primary transition lg:text-lg"
                type={type === "password" && showPass ? "text" : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
            {
                type === "password" && (
                    <EyeClosed
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer size-5"
                        onMouseDown={() => setShowPass(true)}
                        onMouseUp={() => setShowPass(false)}
                        onMouseLeave={() => setShowPass(false)}
                    />
                )
            }
        </div>
    )
}
