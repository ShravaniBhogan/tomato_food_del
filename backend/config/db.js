import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Shravani31:helloShravani@cluster0.k2b26uj.mongodb.net/food-del')
        .then(() => console.log("DB Connected"))
        
}
