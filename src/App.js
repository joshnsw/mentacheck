import React, { useState, useEffect } from "react";
import './App.css';



import {
  BrowserRouter as Router,
  Routes, Route, Link,  useNavigate, useParams
} from 'react-router-dom'



import './css/styles.css'


import {Line} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend
} from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend
)



const url = "http://mentacheck.onrender.com"

// const url = "http://localhost:3001"



// const main = "http://mentacheck.onrender.com"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleSubmit = (event) => {


    event.preventDefault();
    // handle form submission logic here

    fetch(`${url}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid email or password");
        }
        return response.json();
      })
      .then((data) => {
        navigate(`/dashboard/${data.userId}`);
      })
      .catch((error) => {
        console.log(error.message);
      });
    }



    // fetch("http://localhost:3001/api/users")
    // .then(res => res.json())
    // .then(data => {
    //   const user = data.find(user => user.email === email && user.password === password);
    //   if (user) {
    //     navigate(`/dashboard/${user._id}`);
    //   } else {
    //     console.log('Invalid email or password');
    //   }
    // })
    // .catch(error => console.log(error));



  return (
    <div className ="container-login-outer">
    <div className ="container-login">
      <h1>Menta Check</h1>
      <p>Understand yourself better with Menta Check, the app that enables you to monitor your mental health.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
        <button type="submit">Submit</button>
        <Link to="/signup">
        <button type="button">Sign Up</button>
        </Link>
        </div>
      </form>
    </div>
    </div>
  );
};


const DailyMoodForm = ({ onFormSubmit }) => {
  const [mood, setMood] = useState('');
  const [meditated, setMeditated] = useState(false);
  const [exercise, setExercise] = useState(false);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit({ mood, meditated, exercise, notes, date });
  };

  return (

    <form onSubmit={handleSubmit} className ="container-dailylog">
       <label htmlFor="date">Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <label htmlFor="mood">Mood (0-10):</label>
      <input
        id="mood"
        type="number"
        min="0"
        max="10"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        required
      />

      <label htmlFor="meditated">Meditated today?</label>
      <input
        id="meditated"
        type="checkbox"
        checked={meditated}
        onChange={(e) => setMeditated(e.target.checked)}
      />

      <label htmlFor="exercise">Did you exercise today?</label>
      <input
        id="exercise"
        type="checkbox"
        checked={exercise}
        onChange={(e) => setExercise(e.target.checked)}

      />

      <label htmlFor="notes">Notes:</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

const Dashboard = () => {
  const { id } = useParams();
  // handle form submission logic here
  const [userData, setuserData] = useState({});
  const [showForm, setShowForm] = useState(false);

  let moods = userData.moods || [];

  const last30Moods = moods.slice(0, 30);
  const numMoods = last30Moods.length;

  const sumMoods = last30Moods.reduce((total, mood) => total + mood.mood, 0);

  const averageMood = isNaN(sumMoods / numMoods) ? 0 : (sumMoods / numMoods).toFixed(1);

  const numMeditated = last30Moods.filter(mood => mood.meditated).length;

  const numExercise = last30Moods.filter(mood => mood.exercise).length;

  const moodsArray = last30Moods.map(mood => mood.mood)

  const datesArray = last30Moods.map(mood => mood.date.substring(0, 10))

  const data = {
    labels: datesArray,
    datasets: [{
      label:"Mood past 30 days",
      data: moodsArray,
      backgroundColor:'white',
      borderColor:'black',
      pointBorderColor:'aqua',
      fill:true,
      tension:0.4
    }]
  }

  const options = {
    plugins: {
      legend:true
    },
    scales : {
       y:{
        // min:3,
        // max:9
       }
    },
    maintainAspectRatio: false
  }



  const handleFormSubmit = (data) => {
    console.log(data); // do something with the form data, e.g. save it to the database
    // const date = data.date ? new Date(data.date) : new Date();

    // setMood(data.mood)
    // setMeditated(data.meditated)
    // setExercise(data.exercise)
    // setNotes(data.notes)
    // setDate(data.date)

    const mood = data.mood
    const meditated = data.meditated
    const exercise = data.exercise
    const notes = data.notes
    const date = data.date

    fetch(`${url}/dashboard/${id}/dailymood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({mood,
        meditated,
        exercise,
        notes,
        date })
    })
      .then(response => response.json())
      .then(dailyMood => {
        console.log('Daily mood saved:', dailyMood);
        setShowForm(false);
      })
      .catch(error => {
        console.error('Error saving daily mood:', error);
      });
  };





  useEffect(() => {
    // Update the document title using the browser API
    fetch(`${url}/dashboard/${id}`).then(res => res.json()).then(
      (data) => {
        console.log(data)
        setuserData(data);

      }

    )
  },[id]);



return (
  <div className="container-fluid w-100 .bg-light">
     <div className="row">
          <div className="col-3  container-dashboard-first-column  min-vh-100  ">


        <div className="container-dashboard-mood ">
          <p>How's your mood today?</p>

          {showForm ? (
            <DailyMoodForm onFormSubmit={handleFormSubmit} />
          ) : (
            <button className="btn-dashboard" onClick={() => setShowForm(true)}>Enter Mood</button>
          )}
        </div>


      </div>

  <div className="col-9 bg-light container-dashboard-contentfill">
  <div className="row d-flex align-items-center justify-content-between bg-white p-2   mb-4  container-header-fill">
        <div className="col-9"><h4>Welcome, {userData.firstName}</h4></div>
        <div className="col">
      <Link to="/">
            <button className="btn-logout" type="button">Logout</button>
          </Link>
          </div>
          </div>
      <div className="container-fluid mt-2 p-3 bg-white border border-1 shadow-sm p-3 mb-5 bg-body rounded">


      <div className="row d-flex justify-content-around mt-4 mb-4 ">
            <div className="pcard bg-info">
              <p>Average Mood:</p>
              <p>{averageMood}</p>
            </div>
            <div className="pcard bg-info">
            <p>Times Meditate: </p>
            <p> {numMeditated}</p>
            </div>
            <div className="pcard bg-info">
            <p> Times Exercise:</p>
            <p> {numExercise}</p>
            </div>
      </div>
      <div className="row mt-3">
                <div>
                <Line data= {data} options = {options} height="300px"></Line>
                </div>
        </div>
      </div>

  </div>
  </div>
  </div>

);
};




const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission logic here
    //user data does not pass into json stringfy
    // const userData = {
    //   firstName,
    //   lastName,
    //   email,
    //   password
    // };

    fetch(`${url}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({firstName,
        lastName,
        email,
        password })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // handle successful response here
      navigate("/");
    })
    .catch((error) => {
      console.error('Error:', error);

      // handle error response here
    });

  };

  return (
    <div className = "container-signup-outer">
      <div className = "container-signup">
      <h1>Sign Up for Menta Check</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      </div>
    </div>
  );
};






function App() {
  return (
    <>
   <Router>


      <Routes>

        <Route path="/" element={<>
        <Login/>

      </>} />

      <Route path="/signup" element={<>
        <SignUp/>
        </>} />

      <Route path="/dashboard/:id" element={<>
        <Dashboard/>
        </>} />

      </Routes>


      </Router>
   </>
  );
}

export default App;
