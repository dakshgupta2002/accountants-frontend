import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
    paymentDate: {
        type: String,
        required: true
    },
    paymentAmount: {
        type: Number,
        required: true
    }
})

export default paymentSchema;