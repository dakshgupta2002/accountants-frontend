import mongoose from 'mongoose';
const { Schema } = mongoose;

const userVerifySchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    otp:{
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }

},
    {timestamps: true}
);

const UserVerify = mongoose.model('UserVerify', userVerifySchema);
export default UserVerify;
