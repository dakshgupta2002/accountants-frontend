import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    month: String,
    year: String,
    id: String,
    name: String,
    designation: String,
    department: String,
    location: String,
    PFAccount: String,
    UAN: String,
    PAN: String,
    bank: String,
    ESI: String,
    basic: String,
    specialAllowance: String,
    providentFund: String,
    insurance: String,
});

export default mongoose.model("Salary", salarySchema);