

if (!localStorage.getItem('userName')) {
    showErrorMessage(`Oops... you'r not loged in.`);
}

function toggleLanguage(language) {
    if (language === 'english') {
        localStorage.setItem("language", "english")
        document.querySelectorAll('.english_content').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelectorAll('.flex_english_content').forEach(element => {
            element.style.display = 'flex';
        });
        document.querySelectorAll('.hebrew_content').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.flex_hebrew_content').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('[data-placeholder-english]').forEach(element => {
            element.setAttribute('placeholder', element.getAttribute('data-placeholder-english'));
        });


    } else if (language === 'hebrew') {
        localStorage.setItem("language", "hebrew")
        document.querySelectorAll('.english_content').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.flex_english_content').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.hebrew_content').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelectorAll('.flex_hebrew_content').forEach(element => {
            element.style.display = 'flex';
        });
        document.querySelectorAll('[data-placeholder-hebrew]').forEach(element => {
            element.setAttribute('placeholder', element.getAttribute('data-placeholder-hebrew'));
        });
    }
}
let language = localStorage.getItem("language")
toggleLanguage(language);

document.addEventListener("DOMContentLoaded", function() {

    let nameUser = localStorage.getItem("userName");
    console.log(nameUser); // Check the value retrieved
    document.getElementById('usernameId').innerHTML = nameUser;

});


function showErrorMessage(message, success = false) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.color = success ? 'green' : 'red';
    modal.style.display = 'flex';
    document.getElementById("error-modal-btn").style.display = success ? 'none' : 'flex'
}

async function realTimeSearch() {
    const inputText = document.getElementById("search").value;
    if (inputText.length >= 2) {
        const res = await fetch("http://localhost:3000/api/therapists/search?q=" + inputText);
        if (res.ok) {
            const data = await res.json(); 
            creatul(data);
        } else {
            console.log('Error: ', res.status);
        }
    }
}

async function craete_list_methods(){
    const res = await fetch("http://localhost:3000/api/therapists/method");
    const data = await res.json();
    console.log(data)
    const listMetods = document.getElementById("specialization");

    data.forEach(element => {
        const new_opsion = document.createElement('option');
        new_opsion.innerHTML = element
        listMetods.append(new_opsion)
    });
}

craete_list_methods()

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

craete_list_loctions()

async function search(){
    const Specialization = await document.getElementById("specialization").value
    const Location = await document.getElementById("location").value
    
    if (Specialization === '') {
        if (Location === '') {
            all_therapists()
        } else {
            all_therapists_in_location(Location)
        }

    } else {
        if (Location === ''){ 
            all_therapists_in_method(Specialization)
        } else {
            all_therapists_in_location_and_method(Location, Specialization)
        }
    }
   
}

function scrollDown() {
    window.scrollBy({
        top: window.innerHeight/4, 
        behavior: 'smooth' 
    });
}

async function all_therapists(){
    const res = await fetch("http://localhost:3000/api/therapists");
    const data = await res.json()
//    console.log(data)
    creatul(data);
}

async function all_therapists_in_method(method){
    const res = await fetch(`http://localhost:3000/api/therapists/method/${method}`);
    const data = await res.json()
//    console.log(data);
    creatul(data);
}


async function all_therapists_in_location(location){
    const res = await fetch(`http://localhost:3000/api/therapists/location/${location}`);
    const data = await res.json()
//    console.log(data);
    creatul(data);
}

async function all_therapists_in_location_and_method(location, method){
    const res = await fetch(`http://localhost:3000/api/therapists/location/${location}/method/${method}`);
    const data = await res.json()
//    console.log(data);
    creatul(data);
}


async function creatul(data) {
    document.getElementById("h4_id").innerText = ""
    
    const list_all = document.getElementById('list');
    list_all.innerHTML = '';
    
    data.forEach(element => {
        const new_li = document.createElement('li');
        
        new_li.innerHTML = `
            <div class="card">
                <span class="card-header">Dr. ${element.name}, </span>
                <span class="card-title">${element.title}. </span>
                <div class="card-body">
                    <h5 class="card-method">${element.method}</h5>
                    <p class="card-text">${element.location}</p>
                    <div class="button-container">
                        <button class="btn-primary" onclick="localStorageAndLocation(${element.ID}, '${element.name}')">לקביעת תור</button>                    
                    </div> 
                </div>
            </div>
        `;
        
        list_all.appendChild(new_li);
    });
    
    if (data.length != 0){
        document.getElementById("showId").style.display = 'flex';
        scrollDown(); 
    }
     else {
        document.getElementById("showId").style.display = 'none';
        if (localStorage.getItem("language") === 'english') {
            document.getElementById("h4_id").innerText = `we're sorry, there are no results... Try something else.`
        } else {
            document.getElementById("h4_id").innerText = `אין תוצאות... נסה משהו אחר`

        }
    }
} 

function localStorageAndLocation(TherapistID, TherapistName) {
    localStorage.setItem("TherapistID", TherapistID);
    localStorage.setItem("TherapistName", TherapistName);
    window.location.href = 'MakeAppointment.html'
}

async function all_users_appointments(user_id){
    const res = await fetch(`http://localhost:3000/api/users_appointments/${user_id}`);
    const data = await res.json()
    creatAppointments(data);
    console.log(data);
}

all_users_appointments(localStorage.getItem("userId"));

//const date = [{"name" : "aa", "title": "titaa", "location": "locaa"}, {"name" : "aa", "title": "titaa", "location": "locaa"}, {"name" : "bb", "title": "titb", "location": "locbb"}]
//console.log(date);
async function creatAppointments(date) {
    
    const list_all = document.getElementById('list-appointments');
    list_all.innerHTML = '';
    
    date.forEach(element => {
        const new_li = document.createElement('li');
        console.log(element)
        new_li.innerHTML = `
            <div class="card" id="${element._id}">
                <span class="card-header">Dr. ${element.therapistName}, </span>
                <span class="card-title">${element.date[0]}/${element.date[1]}/${element.date[2]} </span>
                <div class="card-body">
                    <p class="card-text">${element.hh}:00</p>
                    <button class="english_content" id="del_app_id" onclick="deleteAppointment('${element._id}')">Delete</button>
                    <button class="hebrew_content" id="del_app_id" onclick="deleteAppointment('${element._id}')">לביטול תור</button>
                    
                </div>
            `;
        list_all.appendChild(new_li);
    });
    toggleLanguage(localStorage.getItem('language'))

    
    if (date.length != 0){
        document.getElementById("header2_id").style.display = 'flex';
        document.getElementById("appointmentsID").style.display = 'flex';
        
    }
}


async function deleteAppointment(appointment_id) {
    try {
        const res = await fetch(`http://localhost:3000/api/appointments/${appointment_id}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            throw new Error('Failed to delete appointment');
        };
        if (localStorage.getItem("language") == 'english') {
            showSuccessMessage('Appointment deleted successfully');
        } else {
            showSuccessMessage("הפגישה נמחקה")
        }
        document.addEventListener('click', clickOutsideHandler);
    } catch (error) {
        console.error('Error deleting appointment:', error);
    }
    setTimeout(() => {location.href = 'main.html'}, 3000)

}

function clickOutsideHandler(event) {
    const hoursDiv = document.querySelector('.modal-content');
    if (!hoursDiv.contains(event.target)) {
        hoursDiv.style.display = 'none';
        document.removeEventListener('click',clickOutsideHandler)
        location.reload();
    }
}

function showSuccessMessage(message) {
    const modal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    modal.style.display = 'flex';
}



async function deleteUser(userId) {
    let chek;
    if (localStorage.getItem("language") == 'english') {
        chek = window.confirm('Are you sure you want to delete the account?')
    } else {
        chek = window.confirm('אתה בטוח שברצונך למחוק את החשבון?')
    };
    if(chek){
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            console.log('Deleted user:', data);
            location.reload(); 
        } catch (error) {
            console.error(error);
        };
        window.location.replace('login.html')
    }

}

// deleteUser("316406818")
