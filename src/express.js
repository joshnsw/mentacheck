// import mongo Schema here to handle CRUD function

const mongoose = require('mongoose');
// const db = require('mongoose').connection;

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');


const express = require('express')
const app = express()

app.use(bodyParser.json());
const cors = require('cors')

  app.use(cors())


const { User, DailyMood } = require('./models/models')



// const path = require('path');

// // Serve static assets from the build directory
// app.use(express.static(path.join(__dirname, 'build')));

// // Serve the index.html file for all routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });



app.use(express.static('build'))


const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})





app.get('/api/users', async (request, response) => {
  await User.find({_id:"63f0836b9b4114ef7c8da603"}).populate("moods").then(users => {
    response.json(users)
  }).then(data => console.log(data))
})



app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});








app.get('/api/dailymoods', (request, response) => {

  const userId = "63eb5f95e6e630381de79728";
  const userIdObj = mongoose.Types.ObjectId(userId);

  DailyMood.find({ userId: userIdObj })
    .then(moods => {
      response.json(moods)
    }).then(data => console.log(data))
    .catch(error => {
      console.error(error)
      response.status(500).send('Internal Server Error')
    })
})

app.get('/dashboard/:id', (request, response) => {
  // User.findById(request.params.id).then(user => {
  //   if (user) {
  //     response.json(user)
  //   } else {
  //     response.status(404).json({ message: 'User not found' })
  //   }
  // }).catch(error => {
  //   response.status(500).json({ message: error.message })
  // })

  User.findById(request.params.id)
    .populate('moods')
    .exec((err, user) => {
      if (err) {
        response.status(500).json({ message: error.message });
      } else if (!user) {
        response.status(404).json({ message: 'User not found' });
      } else {
        response.json(user);
        console.log(user.moods)
      }
    });
})


app.post('/dashboard/:id/dailymood', (req, res) => {


  const userId = req.params.id;
  const { mood, meditated, exercise, notes , date} = req.body;
  console.log(req.body)





  const dailyMood = new DailyMood({
    userId: userId,
    mood: mood,
    meditated: meditated,
    exercise: exercise,
    notes: notes,
    date: date
  });


  dailyMood.save()
  .then((savedMood) => {
    User.findByIdAndUpdate(userId, { $push: { moods: savedMood._id } })
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
      });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Error saving daily mood' });
  });

  // dailyMood.save().then()
  //   .then(dailyMood => {
  //     res.json(dailyMood);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     res.status(500).json({ message: 'Error saving daily mood' });
  //   });
});


app.get('/dashboard/:id/dailymood', async (req, res) => {
  const userId = req.params.id;
  // DailyMood.find({}).then(users => {
  //   response.json(users)
  // })

  // try {
  //   const dailyMoods = await DailyMood.find({ userId});
  //   console.log(dailyMoods)
  //   res.status(200).json(dailyMoods);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
});




app.post('/api/users', (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  console.log(req.body)

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  console.log(hashedPassword);

  const user = new User({
    firstName,
    lastName,
    email,
    password:hashedPassword
  });


  user.save()
    .then(user => {
      res.json(user)
    })
    .catch((error) => {console.error(error)

     console.log(req.body);
    })
})
