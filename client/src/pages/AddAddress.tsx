import { assets } from "@/assets/assets"
import { InputField } from "@/components/InputField";
import { FormEvent, useState } from "react"


const AddAddress = () => {
    const [address, setAddress] = useState<AddressProps>({
        _id: '',
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    }
    return (
        <div className="mt-16 pb-16 max-w-5xl mx-auto">
            <p className="text-2xl md:text-3xl text-accent-foreground">Add Shipping <span className="text-primary font-semibold">Address</span></p>
            <div className="flex flex-col-reverse md:flex-row mt-10 justify-between">
                <div className="flex-1 md:max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                onChange={handleChange}
                                value={address["firstName"]}
                            />
                            <InputField
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                onChange={handleChange}
                                value={address["lastName"]}
                            />
                        </div>
                        <InputField
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            value={address["email"]}
                        />
                        <InputField
                            id="street"
                            name="street"
                            type="text"
                            placeholder="Street"
                            onChange={handleChange}
                            value={address["street"]}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="city"
                                name="city"
                                type="text"
                                placeholder="City"
                                onChange={handleChange}
                                value={address["city"]}
                            />
                            <InputField
                                id="country"
                                name="country"
                                type="text"
                                placeholder="Country"
                                onChange={handleChange}
                                value={address["country"]}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="zipcode"
                                name="zipcode"
                                type="text"
                                placeholder="Zip Code"
                                onChange={handleChange}
                                value={address["zipcode"]}
                            />
                            <InputField
                                id="state"
                                name="state"
                                type="text"
                                placeholder="State"
                                onChange={handleChange}
                                value={address["state"]}
                            />
                        </div>
                        <InputField
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="Phone"
                            onChange={handleChange}
                            value={address["phone"]}
                        />
                        <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded-md">
                            Save address
                        </button>
                    </form>
                </div>
                <img src={assets.add_address_iamge} alt="Add Address" className="md:mr-16 mb-16" />
            </div>
        </div>
    )
}

export default AddAddress