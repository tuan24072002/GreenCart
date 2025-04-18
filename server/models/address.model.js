import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const Address = mongoose.model.address || mongoose.model("Address", addressSchema);

export default Address;