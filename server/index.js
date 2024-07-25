

const express = require("express");
const app = express();
app.use(express.json());
const db = require('./db.js')
const cors = require("cors")
app.use(cors())





app.get('/api/users', async (req, res) => {
    try {
        const users = await db.getUsers()
        res.send(users);
    } catch (error) {
        res.status(500).send()
    }
});


app.get('/api/therapists', async (req, res) => {
    try {
        const therapists = await db.gettherapists()
        res.send(therapists);
    } catch (error) {
        res.status(500).send()
    }
});


// http://localhost:3000/api/appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await db.getAppointments()
        res.send(appointments);
    } catch (error) {
        res.status(500).send()
    }
});






app.get('/api/users/:id', async(req, res) => {
    try {
        const user = await db.getUserById(req.params.id)
        if (!user) return res.status(404).send();
        res.send(user);
    } catch (error) {
        res.status(500).send()
    }
});
//#########################3

// http://localhost:3000/api/users/324073097/5050
app.get('/api/users/:id/:password', async(req, res) => {
    try {
        const user = await db.getUserByIdAndPass(req.params.id, req.params.password)
        if (!user) return res.status(404).send();
        res.send(user);
    } catch (error) {
        res.status(500).send()
    }
});




app.get('/api/users_appointments/:user_id', async(req, res) => {
    try {
        const users_appointments = await db.get_Appointments_to_user(req.params.user_id)

        if (!users_appointments) return res.status(404).send();
        res.send(users_appointments);
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
});



app.get('/api/therapists/method', async(req, res) => {
    try {
        const method = await db.getTherapistMethod()
        if (!method) return res.status(404).send();
        res.send(method);
    } catch (error) {
        res.status(500).send()
    }
});


app.get('/api/therapists/location', async(req, res) => {
    try {
        const location = await db.getTherapistLocation()
        if (!location) return res.status(404).send();
        res.send(location);
    } catch (error) {
        res.status(500).send()
    }
});


app.get('/api/therapists/location/:location', async(req, res) => {
    try {
        const Therapist = await db.getTherapistByLoc(req.params.location)
        if (!Therapist) return res.status(404).send();
        res.send(Therapist);
    } catch (error) {
        res.status(500).send()
    }
});

app.get('/api/therapists/method/:method', async(req, res) => {
    try {
        const Therapist = await db.getTherapistByMethod(req.params.method)
        if (!Therapist) return res.status(404).send();
        res.send(Therapist);
    res.send(Therapist);
    } catch (error) {
        res.status(500).send()
    }
});
 

app.get('/api/therapists/location/:location/method/:method', async (req, res) => {
    try {
        
        const selectedTherapists = await db.getTherapistByLocAndMethod(req.params.location, req.params.method)
        res.send(selectedTherapists);
    } catch (error) {
        res.status(500).send()
    }
});


app.get('/api/therapists/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const results = await db.getTherapistInRealTime(searchTerm);
        
        if (results.length === 0) {
            res.json(results);
        } else {
                res.json(results);
        }

    } catch (error) {
        res.status(500).send()
    }
});


// app.get('/api/therapists/search', async (req, res) => {
//     try {
//         const searchTerm = req.query.q;
//         console.log('Search Term:', searchTerm); // Log the search term
//         const results = await getTherapistInRealTime(searchTerm);
//         console.log('Results:', results); // Log the results from the database
//         res.json(results.length ? results : { message: 'No therapists found for this search' });
//     } catch (error) {
//         console.error('Error:', error); // Log any errors that occur
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });



app.post('/api/users', async (req, res) => {
    try {
        const user = await db.addUser(req.body);
        res.status(201).send({ success: true, user });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});



// post to add new Appointment (אובייקט של תור חדש)
app.post('/api/appointments', async (req, res) => {
    try {
        const appointment = await db.addAppointment(req.body);
        res.status(201).send({ success: true, appointment });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});



// get the all days that spasipic Therapists work in the week
// ימים של מטפל
// http://localhost:3000/api/therapists/work_days/2
app.get('/api/therapists/work_days/:id', async (req, res) => {
    try {
        const therapists = await db.getTherapistsDays(req.params.id)
        var keys = [];
        for (var key in therapists[0].work_days) {
            keys.push(key);
        }
        res.send(keys);
    } catch (error) {
        res.status(500).send()
    }
});



// http://localhost:3000/api/therapists/work_hour/2/7
// שעות של מטפל מסוים ליום מסוים
app.get('/api/therapists/work_hour/:therapist_id/:day', async (req, res) => {
    try {
        const therapists = await db.getTherapist_Hours_with_id_and_day(req.params.therapist_id)
        res.send(therapists[0].work_days[req.params.day]);
    } catch (error) {
        res.status(500).send()
    }
        
});


// שעות תפוסות למטפל מסוים ביום מסוים
// http://localhost:3000/api/appointments/2/["21","08","2024"]
app.get('/api/appointments/:therapist_id/:list_date', async (req, res) => {
    try {
        const list_date_to_parse = JSON.parse(req.params.list_date)
        const busy_hours = await db.Get_busy_hours_by_day(req.params.therapist_id, list_date_to_parse)
        console.log("🚀 ~ app.get ~ busy_hours:", busy_hours)
        res.send(busy_hours);
    } catch (error) {
        res.status(500).send()
    }
        
});

// http://localhost:3000/api/appointments/4/213468424
app.delete('/api/appointments/:appointment_id', async(req, res) => {
    try {
        const result = await db.deleteAppointment(req.params.appointment_id)
        if (!result) return res.status(404).send();
        res.status(204).send();
    } catch(error) {
        console.log(error);
        res.status(500).send()
    }
});



app.delete('/api/users/:user_id', async(req, res) => {
    try {
        const result = await db.deleteUser(req.params.user_id)
        if (!result) return res.status(404).send();
        res.status(204).send();
    } catch(error) {
        console.log(error);
        res.status(500).send()
    }
});


// app.listen(3000, () => console.log("you listen to port 3000")); 



app.listen(3000, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:3000`);
});
