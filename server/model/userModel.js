import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    admin: {
        type: Boolean,
        default: false 
    }
},
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;
