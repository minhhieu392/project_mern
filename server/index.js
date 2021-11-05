require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth')
const postRouter = require('./routers/post')
const connectDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://hieu:12345@cluster0.eogj6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {

            useNewUrlParser: true,
            useUnifiedTopology: true


        })
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        precess.exit(1)
    }
}
connectDB();
const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
const PORT = 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))