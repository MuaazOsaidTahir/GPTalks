const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_NAME}:${encodeURIComponent(process.env.MONGO_DB_PASSOWRD)}@cluster0.jlkezec.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('db connected')
})