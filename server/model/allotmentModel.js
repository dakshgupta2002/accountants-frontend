import mongoose from 'mongoose';
import paymentSchema from './paymentSchema.js';
const { Schema } = mongoose;

const allotmentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    username: String,
    allotmentDate: String,
    amountPrice: String,
    downPayment: String,
    rateInterest: String,
    penalInterest: String,
    installmentsNumber: String,
    plot: String,
    payments:{
        type: [paymentSchema]
    }
})

const Allotment = mongoose.model('Allotment', allotmentSchema);
export default Allotment;