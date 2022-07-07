import 'dotenv/config'
import mongoose from "mongoose";

mongoose.connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true }
).then(()=>{
    console.log("Mongo DB connected")
})
.catch(err => console.log(err));

