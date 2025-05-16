import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://SeanRise:11042020@cluster0.euxgtn0.mongodb.net/Dento').then(()=>console.log("DB Connected"));
}