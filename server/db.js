
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://all:1234@listbuy.tj5gmug.mongodb.net/MentalHealth");

const usersSchema = new mongoose.Schema({
    name: String,
    ID: String,
    password: String
});


const therapistsSchema = new mongoose.Schema({
    name: String,
    title: String,
    ID: Number,
    location: String,
    method: String,
    work_days: Object,
});

const appointmentsSchema = new mongoose.Schema({

    therapistName:String,
    therapistID: Number,
    patientID: String,
    date: Array,
    hh: String
});

const Users = mongoose.model("users", usersSchema);
const therapists = mongoose.model("therapists", therapistsSchema);
const Appointments = mongoose.model("appointments", appointmentsSchema);


async function addAppointment(newAppointment) {
    const result = await Appointments.create(newAppointment)
    return result
}


async function getTherapistsDays(ID) {
    const result = await therapists.find({ID: ID}, {_id:false, work_days: true});
    return result
}



async function gettherapists() {
    const result = await therapists.find()
    return result
}

async function getAppointments() {
    const result = await Appointments.find()
    return result
}


async function getUsers() {
    const result = await Users.find()
    return result
}


async function getUserById(userId) {
    const result = await Users.findOne({ID: String(userId)})
    return result
}

async function getUserByIdAndPass(userId, userPassword) {
    const result = await Users.findOne({ID: String(userId), password: String(userPassword)})
    return result
}

async function getTherapistById(TherapistId) {
    const result = await therapists.findOne({ID: Number(TherapistId)})
    console.log(result)
    return result
}


async function addUser(newUser) {
    const result = await Users.create(newUser)
    return result
}


async function getTherapistByLoc(location) {
    const result = await therapists.find( {location: location})
    console.log(result)
    return result
}


async function getTherapistByMethod(method) {
    const result = await therapists.find({method: method})
    console.log(result)
    return result
}


async function getTherapistMethod(){
    const result = await therapists.distinct("method");
    console.log(result)
    return result
}


async function getTherapistLocation(){
    const result = await therapists.distinct("location");
    console.log(result)
    return result
}


async function getTherapistByLocAndMethod(location, method) {
    const result = await therapists.find( {location: location, method:method})
    console.log(result)
    return result
}


async function getTherapistInRealTime(searchTerm) {
    const result = await therapists.find({ name: { $regex: new RegExp(searchTerm, 'i') } }).limit(3);
    console.log(result)
    return result
}

async function getTherapist_Hours_with_id_and_day(therapist_id) {
    const result = await therapists.find( {ID: therapist_id}, {_id:false, work_days: true})
    console.log(result)
    return result
}


// פונקצייה שמקבלת ת"ז של מטפל ו-תאריך מסוג רשימה 
//  ומחזירה את השעות שבהם הוא תפוס
// Get_busy_hours_by_day(2, ["21", "08", "2024"])
async function Get_busy_hours_by_day(therapist_id, date) {
    const result = await Appointments.find({therapistID:therapist_id, date: date}, {_id:false, hh:true})
    const empty = [];
    for(let i of result){
        console.log(i.hh);
        empty.push(i.hh)
    }
    console.log(empty);
    return empty
}


// get all appointments to a user
async function get_Appointments_to_user(userId) {
    const result = await Appointments.find({patientID:userId})
    console.log(result);
    return result
}



async function deleteAppointment(appointment_id) {
    const result = await Appointments.deleteOne({_id: appointment_id});
    return result.deletedCount === 1;
}


//get_Appointments_to_user("207346982");


async function deleteUser(userId) {
    const result = await Users.deleteOne({ID: userId});
    return result.deletedCount === 1;
}


module.exports = {
    addUser,
    getUsers,
    getUserById,
    gettherapists,
    getTherapistById,
    deleteAppointment,
    getTherapistByLoc,
    getUserByIdAndPass,
    getTherapistMethod,
    getTherapistByMethod,
    getTherapistLocation,
    getTherapistInRealTime,
    getTherapistByLocAndMethod,
    addAppointment,
    getTherapistsDays,
    getAppointments,
    getTherapist_Hours_with_id_and_day,
    Get_busy_hours_by_day,
    get_Appointments_to_user,
    deleteUser
}





