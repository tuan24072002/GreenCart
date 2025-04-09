import { assets, categories } from "@/assets/assets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useState } from "react";

const AddProduct = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "",
        price: 0,
        offerPrice: 0
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    }
    return (
        <div className="flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-4xl">
                <div>
                    <Label className="text-base font-medium">Product Image</Label>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files![0];
                                        setFiles(updatedFiles);
                                    }}
                                    accept="image/*"
                                    type="file"
                                    id={`image${index}`}
                                    hidden />
                                <img className="max-w-24 max-h-14 object-cover bg-white cursor-pointer" src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-base font-medium"
                        htmlFor="name">
                        Product Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Type here"
                        className="outline-none py-5 px-3 rounded border border-gray-500/40"
                        value={data["name"]}
                        onChange={handleChange}
                        required />
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-base font-medium"
                        htmlFor="description">Product Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="outline-none py-2.5 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                        value={data["description"]}
                        onChange={handleChange}
                    ></Textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <Label className="text-base font-medium" htmlFor="category">Category</Label>
                    <select
                        id="category"
                        name="category"
                        value={data["category"]}
                        onChange={handleChange}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {
                            categories.map((category, index) => (
                                <option key={index} value={category.path}>{category.path}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <Label className="text-base font-medium" htmlFor="price">Product Price</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0"
                            className="outline-none py-5 px-3 rounded border border-gray-500/40"
                            required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <Label className="text-base font-medium" htmlFor="offerPrice">Offer Price</Label>
                        <Input
                            id="offerPrice"
                            name="offerPrice"
                            type="number"
                            placeholder="0"
                            className="outline-none py-5 px-3 rounded border border-gray-500/40"
                            required />
                    </div>
                </div>
                <button className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-medium rounded cursor-pointer">ADD</button>
            </form>
        </div>
    );
};

export default AddProduct;