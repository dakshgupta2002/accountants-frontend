import mongoose from "mongoose";
const { Schema } = mongoose;

const salarySchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    month: String,
    year: String,
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
    reimburse: String
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;