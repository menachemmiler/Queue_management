localStorage.clear(); //צריך לנקות רק משהו ספציפי

localStorage.setItem("language", "english")
document.querySelectorAll('.hebrew_content').forEach(element => {
    element.style.display = 'none';
});
document.querySelectorAll('.flex_hebrew_content').forEach(element => {
    element.style.display = 'none';
});
document.querySelectorAll('[data-placeholder-english]').forEach(element => {
    element.setAttribute('placeholder', element.getAttribute('data-placeholder-english'));
});


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


document.getElementById('loginid').addEventListener('input', validateIDLength);

function validateIDLength() {
    const id = document.getElementById('loginid').value;
    const idMessage = document.getElementById('id-message');
    
    if (id.length < 9) {
        if (localStorage.getItem("language") == 'english') {
            idMessage.textContent = 'The length of the ID is too short';
        } else {
            idMessage.textContent = 'תעודת זהות קצרה מדי';
        }
    } else if (id.length == 9){
        if (!isValidID(id)){
            if (localStorage.getItem("language") == 'english') {
                idMessage.textContent = 'The ID is illegal';
            } else {
                idMessage.textContent = 'תעודת זהות לא תקינה';
            }
        } else {
            idMessage.textContent = '';
        }
    }
}

function isValidID(id) {
    const sum = idVerification(id);
    const bikoret = parseInt(id.charAt(8), 10);
    return (sum + bikoret) % 10 === 0;
}

function idVerification(id) {
    let sum = 0;

    for (let i = 0; i < 8; i++) {
        let num = parseInt(id.charAt(i), 10);

        if (i % 2 === 0) {
            sum += num;
        } else {
            num *= 2;
            if (num > 9) {
                sum += Math.floor(num / 10) + (num % 10);
            } else {
                sum += num;
            }
        }
    }
    return sum;
}

async function logIn() {
    const user_id = document.getElementById("loginid").value;
    const user_pass = document.getElementById("passid").value;
    console.log(user_id, user_pass);

    if (!isValidID(user_id)) {
        if (localStorage.getItem("language") == 'english') {
            showErrorMessage("The ID is invalid. Please enter a valid 9-digit ID.");
        } else {
            showErrorMessage("תעודת זהות אינה תקינה, נא הכנס מספר ת.ז. בן 9 ספרות")
        }
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/users/${user_id}/${user_pass}`);
        console.log(res);
        if (!res.ok) {
            if (localStorage.getItem("language") == 'english') {
                showErrorMessage("The user name or password is incorrect");
            } else {
                showErrorMessage("אופס... לפחות אחד מהפרטים שגויים")
            }
            return;

        }
        const data = await res.json();
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userId", data.ID);
        console.log(data);
        Welcome(data.name);
    }
    catch (error) {
        console.error(error);
        if (localStorage.getItem("language") == 'english') {
            showErrorMessage("An error occurred while trying to log in. Please try again later.");
        } else {
            showErrorMessage("משהו לא מסתדר בצד שלנו, אנא נסא שוב מאוחר יותר")
        }
    }
}

function showErrorMessage(message, success = false) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.color = success ? 'green' : 'red';
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('error-modal');
    modal.style.display = 'none';
    document.getElementById('loginid').value = '';
    document.getElementById('loginid').value = '';
}

function Welcome(name) {
    if (localStorage.getItem("language") == 'english') {
        showSuccessMessage(`Welcom ${name}!`);
    } else {
        showSuccessMessage(`שלום ${name}`)
    }
    setTimeout(() => {location.href = 'main.html'}, 3000);
}

async function register() {
    const name = document.getElementById("newUserName").value;
    const ID = document.getElementById("newUserId").value;
    const password = document.getElementById("newUserPassword").value;
    console.log(name, ID, password);

    if ((name == '')||(ID == '')||(password == '')) {
        if (localStorage.getItem("language") == 'english') {
            showErrorMessage("The input is invalid. Please fill in all text fields");
        } else {
            showErrorMessage("חובה למלאות את כל השדות")
        }
        return;
    } else if (!isValidID(ID)) {
        if (localStorage.getItem("language") == 'english') {
            showErrorMessage("The ID is invalid. Please enter a valid 9-digit ID.");
        } else {
            showErrorMessage("תעודת זהות אינה תקינה, נא הכנס מספר ת.ז. בן 9 ספרות")
        }
        return;
    }
    //user exist
    try {
        const res = await fetch(`http://localhost:3000/api/users/${ID}`);
        console.log(res);
        if (res.ok) {
            if (localStorage.getItem("language") == 'english') {
                showSuccessMessage("The user is exist!");
            } else {
                showSuccessMessage("היי, אתה כבר רשום... פשוט תיכנס")
            }
            setTimeout(() => {location.href = 'login.html'}, 2000)

            return;
            
        }
    }
    catch (error) {
        console.error(error);
        showErrorMessage("An error occurred while trying to log in. Please try again later.");
    }

    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, ID, password }),
        });
        
        const res = await response.json();
        if (res.success) {
            if (localStorage.getItem("language") == 'english') {
                showSuccessMessage('Registration successful!');
            } else {
                showSuccessMessage("!נרשמת בהצלחה")
            }
            setTimeout(() => {location.href = 'login.html'}, 2000)
        } else {
            if (localStorage.getItem("language") == 'english') {
                showErrorMessage("Registration failed. Please try again.");
            } else {
                showErrorMessage("ההרשמה נכשלה, אנא נסה שוב")
            }
        }
    } catch (error) {
        console.error("Error:", error);
        if (localStorage.getItem("language") == 'english') {
            showErrorMessage("An error occurred while trying to register. Please try again later.");
        } else {
            showErrorMessage("משהו לא מסתדר בצד שלנו, אנא נסא שוב מאוחר יותר");
        }
    }
}

function showSuccessMessage(message) {
    const modal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    location.reload();
}
