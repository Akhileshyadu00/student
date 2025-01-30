// DOM elements

const studentForm = document.getElementById("studentForm"); //HTML data
const studentTableBody = document.querySelector("studentTable tbody"); //Data store here

let editIndex = -1; // Track index for editing

//store data on local storage

function saveToLocalStorage(data) {
    localStorage.setItem("student", JSON.stringify(data)); //data into string
}

//fetch data form local storage 

function getFromLocalStorage(data) {
    return JSON.parse(localStorage.getItem("student")) || [];
}

// adjust scrollbar 

function adjustScroll() {
    const recordsSection = document.querySelector(".table-container");
    const studentRows = document.querySelectorAll("#studentTable tbody tr");

    if (studentRows.length > 4) { // show scrollbar if more than 4 students
        recordsSection.style.overflowY = "scroll";
    } else {
        recordsSection.style.overflowY = "hidden";
    }
}


//render student records 

function renderStudents() {
    const students = getFromLocalStorage();
    studentTableBody.innerHTML = ""; // Clear table before rendering

    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button  class="edit-btn" onclick="editStudent(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });

    adjustScroll(); // Adjust scrollbar dynamically
}

// Add or update a student
studentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentID").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contactNo").value.trim();

    // Validate inputs
    if (!name || !id || !email || !contact) {
        alert("All fields are required.");
        return;
    }

    if (!/^[a-zA-Z ]+$/.test(name)) {
        alert("Student name must contain only letters.");
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Invalid email format!");
        return;
    }

    if (!/^[0-9]+$/.test(id)) {
        alert("Student ID must be a number.");
        return;
    }

    if (!/^[0-9]{10}$/.test(contact)) {
        alert("Contact number must be a 10-digit number.");
        return;
    }

    let students = getFromLocalStorage();

    // Check for duplicate Student ID (only for new entries)
    if (editIndex === -1 && students.some((student) => student.id === id)) {
        alert("Student ID already exists!");
        return;
    }

    // If editing, update the existing student
    if (editIndex !== -1) {
        students[editIndex] = { name, id, email, contact };
        editIndex = -1; // Reset edit index
    } else {
        students.push({ name, id, email, contact });
    }

    saveToLocalStorage(students);
    studentForm.reset();
    renderStudents();

    // Scroll smoothly to the newly added row
    setTimeout(() => {
        studentTableBody.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }, 200);
});

// edit a student
function editStudent(index) {
    const students = getFromLocalStorage();
    const student = students[index];

    document.getElementById("studentName").value = student.name;
    document.getElementById("studentID").value = student.id;
    document.getElementById("email").value = student.email;
    document.getElementById("contactNo").value = student.contact;

    editIndex = index; // Set index for updating
}

// delete a student
function deleteStudent(index) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const students = getFromLocalStorage();
    students.splice(index, 1);
    saveToLocalStorage(students);
    renderStudents();
}

// Initial render
renderStudents();

