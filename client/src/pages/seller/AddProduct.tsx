import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assets, categories, dummyProducts } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductModel } from "@/models/Product.model";
import { addItem, resetActionState } from "@/slice/product/Product.slice";
import { urlToFile } from "@/utils/util";
import { FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddProduct = () => {
    const dispatch = useAppDispatch();
    const productState = useAppSelector(state => state.product);
    const [files, setFiles] = useState<File[]>([]);
    const formikProduct = useFormik<ProductType>({
        initialValues: ProductModel.initialize(),
        validate: (data) => {
            const errors: FormikErrors<ProductType> = {};
            if (!data.name) {
                errors.name = "Name is required!";
            }
            if (!data.description) {
                errors.description = "Description is required!";
            }
            if (!data.category) {
                errors.category = "Category is required!";
            }
            if (!data.price) {
                errors.price = "Price is required!";
            }
            if (!data.offerPrice) {
                errors.offerPrice = "Offer Price is required!";
            }
            return errors;
        },
        onSubmit: async (data) => {
            const productData = {
                name: data.name,
                description: typeof data.description === "string" ? data.description.split("/n") : data.description,
                category: data.category,
                price: data.price,
                offerPrice: data.offerPrice,
                inStock: true
            }
            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }
            switch (productState.action) {
                case "INS":
                    await dispatch(addItem({ data: formData }));
                    break;
            }
        }
    })
    const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
    const handleSeedData = async () => {
        for (const product of dummyProducts) {
            try {
                const productData = {
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    offerPrice: product.offerPrice,
                    weight: product.weight,
                    inStock: true
                }
                const formData = new FormData();
                formData.append("productData", JSON.stringify(productData));
                if (product.image && Array.isArray(product.image)) {
                    for (const imgUrl of product.image) {
                        const fullUrl = new URL(imgUrl, window.location.origin).href;
                        const file = await urlToFile(fullUrl);
                        formData.append('images', file);
                    }
                }
                await dispatch(addItem({ data: formData }));
                await delay(1000);
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        switch (productState.statusAction) {
            case "failed":
                toast.error(productState.error ?? "");
                dispatch(resetActionState());
                break;
            case "loading":
                break;
            case "completed":
                toast.success(productState.success ?? "");
                formikProduct.resetForm();
                setFiles([]);
                dispatch(resetActionState());

                break;
        }
    }, [dispatch, productState])

    return (
        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
            <form onSubmit={formikProduct.handleSubmit} className="md:p-10 p-4 space-y-5 max-w-4xl">
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
                        value={formikProduct.values.name}
                        onChange={(e) => formikProduct.setFieldValue("name", e.target.value)}
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
                        value={formikProduct.values.description}
                        onChange={(e) => formikProduct.setFieldValue("description", e.target.value)}
                    ></Textarea>
                </div>
                <div className="flex flex-col gap-1">
                    <Label
                        className="text-base font-medium"
                        htmlFor="weight">
                        Weight
                    </Label>
                    <Input
                        id="weight"
                        name="weight"
                        type="text"
                        placeholder="Ex: 500g"
                        className="outline-none py-5 px-3 rounded border border-gray-500/40"
                        value={formikProduct.values.weight}
                        onChange={(e) => formikProduct.setFieldValue("weight", e.target.value)}
                        required />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <Label className="text-base font-medium" htmlFor="category">Category</Label>
                    <select
                        id="category"
                        name="category"
                        value={formikProduct.values.category}
                        onChange={(e) => formikProduct.setFieldValue("category", e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 bg-accent">
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
                            value={formikProduct.values.price}
                            onChange={(e) => formikProduct.setFieldValue("price", e.target.value)}
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
                            value={formikProduct.values.offerPrice}
                            onChange={(e) => formikProduct.setFieldValue("offerPrice", e.target.value)}
                            className="outline-none py-5 px-3 rounded border border-gray-500/40"
                            required />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-medium rounded cursor-pointer">
                        ADD
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSeedData}
                        variant="destructive"
                        className="px-8 py-2.5 text-white font-medium rounded cursor-pointer">
                        Seed Data
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;