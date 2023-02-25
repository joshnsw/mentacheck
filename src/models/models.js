const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const url = process.env.MONGODB_URI

const ur = "mongodb+srv://josh:qfLCH8MU6TNM8Ncz@cluster0.ij8ytsz.mongodb.net/MentaApp?retryWrites=true&w=majority"
console.log('connecting to', ur)


mongoose.connect(ur)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })




const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  moods: [{
    type: Schema.Types.ObjectId,
    ref: 'DailyMood'
  }]
});

// Data to store mental data
const dailyMoodSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date
  },
  mood: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  meditated: {
    type: Boolean
  },
  notes: {
    type: String
  },
  exercise: {
    type: Boolean
  }
});



module.exports = {
  User: mongoose.model("User", UserSchema),
  DailyMood: mongoose.model('DailyMood', dailyMoodSchema)
};
