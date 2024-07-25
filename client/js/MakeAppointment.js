


async function add_Appointment() {
    const therapistName = localStorage.getItem("TherapistName")
    const therapistID =  localStorage.getItem("TherapistID")
    const patientID = localStorage.getItem("userId")

    const date = ["21", "08", "2024"]
    const hh = "13"

    try {
        const response = await fetch("http://localhost:3000/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ therapistName, therapistID, patientID, date, hh }),
        });
        
        const res = await response.json();
        if (res.success) {
            showSuccessMessage(`We got it! An appointment was scheduled for Dr ${therapistName}, on ${date} at ${hh}` );
        } else {
            showErrorMessage("Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        showErrorMessage("An error occurred while trying to register. Please try again later.");
    }
}



//==========================//


let nav = 0;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
const deleteEventModal = document.getElementById('deleteEventModal');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


async function load() {
    
    const days = await getTherapistsDays(localStorage.getItem("TherapistID")) // מתקבל מן השרת ימים (צריך לשנות לטייפ נמבר)
    const day_of_doc = days.map(Number)
    console.log(day_of_doc)
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-GB', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement("div");
        daySquare.classList.add("day");

        const dayOfMonth = i - paddingDays;
        const dayString = `${dayOfMonth}/${month + 1}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = dayOfMonth;

            const eventForDay = events.find(e => e.date === dayString);

            if (dayOfMonth === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            const current = new Date (year, month, dayOfMonth)
            const dayOfWeek = new Date(year, month, dayOfMonth).getDay();
            const toDay = formatDateToYYYYMMDD(current)
            if (day_of_doc.includes(dayOfWeek) && isFutureDate(toDay)) { // !!!
                daySquare.addEventListener('click', () => openModal(dayString, dayOfWeek));
                daySquare.classList.add('clickable'); // Optionally style clickable dates
            } else {
                daySquare.classList.add('disabled'); // Optionally style non-clickable dates
            }
        } else {
            daySquare.classList.add("padding");
        }
        calendar.appendChild(daySquare);
    }
}

const newHoursModal = document.getElementById('hours');

async function openModal(date, dayOfWeek) {

    const arr = await getTherapistHoursForDay(localStorage.getItem("TherapistID"), dayOfWeek, date.split('/'));
    
    localStorage.setItem("dayOfWeek", dayOfWeek);
    localStorage.setItem("date", date);

    if (!arr.length == 0) {    //creat il in ul by event
        document.querySelector('.hours').innerHTML = `
        ${localStorage.getItem("date")}<br>
        Dr. ${localStorage.getItem("TherapistName")}<br><br>
        <label for="hours"></label>please Choose an Hour<br><br>
      <select id="hours" name="hours">
          <option value="">Choose an Hour:</option>
      </select>
          
          <button id="setUpBtnId" onclick="setUpAppointment()">Set up</button>`
    } 
    craete_list_hours(arr);
    document.querySelector('.hours').style.display = 'block'
    document.addEventListener('click', clickOutsideHandler);

    closeModal();
}


function clickOutsideHandler(event) {
    const hoursDiv = document.querySelector('.hours');
    if (!hoursDiv.contains(event.target)) {
        hoursDiv.style.display = 'none';
        document.removeEventListener('click',clickOutsideHandler)
    }
}


async function craete_list_hours(arr){
   
    const hoursDiv = document.querySelector('.hours'); // Select the <div> with class 'hours'
    const selectHours = hoursDiv.querySelector('#hours'); // Select the <select> inside the 'hours' div

    if (arr.length == 0) {
        hoursDiv.innerHTML = "There are no free hours left";
        document.removeEventListener('click',clickOutsideHandler)
        return;
    }

   // Clear any existing options

    selectHours.innerHTML = '';
    const newOption = document.createElement('option');
    newOption.textContent = "Choose an Hour:";
    selectHours.appendChild(newOption);

    arr.forEach(element => {
        const newOption = document.createElement('option');
        newOption.textContent = element; // Use textContent to set the option's text

        selectHours.appendChild(newOption);
    });

    hoursDiv.style.display = 'block';

    document.getElementById("hours").addEventListener('click', () => {
        hours_value = document.getElementById("hours").value

        localStorage.setItem("hour", hours_value)
    })
}

function saveEvent(arr, value) {
    arr = (arr, value) => arr.filter(item => item !== value);
    closeModal();
    return arr
}


function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    deleteEventModal.style.display = 'none';
    load();
}



function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        saveEvent();
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('deleteButton').addEventListener('click', () => {
        deleteEvent();
    });

}

async function craete_list_loctions(){
    const date_= {}
    console.log(data)
    const listLocations = document.getElementById("location");
    data.forEach(element => {
        const new_opsion = document.createElement('option');
        new_opsion.innerHTML = element
        listLocations.append(new_opsion)
    });
}

initButtons();
load();



async function craete_list_loctions(){
    const res = await fetch("http://localhost:3000/api/therapists/location");
    const data = await res.json();
    console.log(data)
    const listLocations = document.getElementById("location");
    data.forEach(element => {
        const new_opsion = document.createElement('option');
        new_opsion.innerHTML = element
        listLocations.append(new_opsion)
    });
}



async function getTherapistsDays(therapist_id) {
    const res = await fetch(`http://localhost:3000/api/therapists/work_days/${therapist_id}`);
    const data = await res.json()
    console.log(data);
    return data
}


async function getTherapistHoursForDay(therapist_id, day, data_list) {
    const res = await fetch(`http://localhost:3000/api/therapists/work_hour/${therapist_id}/${day}`);
    const allHours = await res.json();
    data_list = `["${data_list[0]}","${data_list[1]}","${data_list[2]}"]`
    const appointmentsRes = await fetch(`http://localhost:3000/api/appointments/${therapist_id}/${data_list}`);
    console.log(appointmentsRes)
    const bookedHours = await appointmentsRes.json();

    const availableHours = allHours.filter(hour => !bookedHours.includes(hour));
    console.log(availableHours);
    return availableHours;
}


async function setUpAppointment() {
    const patientID = localStorage.getItem("userId")
    const therapistID = localStorage.getItem("TherapistID")
    const date = localStorage.getItem("date").split('/')
    const hh = localStorage.getItem("hour")
    const therapistName = localStorage.getItem("TherapistName")
    console.log(date)

    if (isNaN(hh)) {
        showErrorMessage('you didnt peek an hour') 
        return;      
    }

    try {
        const response = await fetch("http://localhost:3000/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({therapistName, therapistID, patientID, date, hh }),
        });
        
        const res = await response.json();
        if (res.success) {
            showErrorMessage('we got it! waiting for you...',success = true);
            localStorage.setItem("hour", "?") 
            setTimeout(() => {location.href = 'main.html'}, 3000)
        } else {
            showErrorMessage("oops.. something went wrong :( ");
        }
    } catch (error) {
        console.error("Error:", error);
        //showErrorMessage("An error occurred while trying to register. Please try again later.");
    }
}

function showErrorMessage(message, success = false) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.color = success ? 'green' : 'red';
    modal.style.display = 'flex';
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function isFutureDate(dateStr, dateFormat = 'YYYY-MM-DD') {
    // Parse the date string based on the provided format
    const parsedDate = parseDate(dateStr, dateFormat);
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates

    return parsedDate > today;
}

function parseDate(dateStr, dateFormat) {
    const dateParts = dateStr.split('-');
    let year, month, day;

    switch (dateFormat) {
        case 'YYYY-MM-DD':
            [year, month, day] = dateParts;
            break;
        case 'DD-MM-YYYY':
            [day, month, year] = dateParts;
            break;
        case 'MM-DD-YYYY':
            [month, day, year] = dateParts;
            break;
        default:
            throw new Error("Unsupported date format. Use 'YYYY-MM-DD', 'DD-MM-YYYY', or 'MM-DD-YYYY'.");
    }

    return new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
}

function formatDateToYYYYMMDD(date) {
    if (!(date instanceof Date)) {
        throw new Error("Input must be a Date object");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
