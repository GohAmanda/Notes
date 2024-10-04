// State management

// Retrieves saved notes from localStorage or initializes an empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// ID of the note being edited
let currentId = null;


// DOM Elements
const titleInput = document.getElementById('noteTitle');
const contentInput = document.getElementById('noteContent');
const submitButton = document.getElementById('submitNote');
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkMode');

// Initialize
function init() {
    renderNotes();
    applyDarkMode();
}

// Toggles dark mode on or off, and saves the preference in localStorage
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode); // Save dark mode preference
}

// Checks and applies dark mode if it was previously enabled
function applyDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Handles the form submission for creating or updating a note
function handleSubmit() {

    // Get the note title and the content of the note
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

     // Check if both fields are filled
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }

    // Check if editing an existing note or adding a new one
    if (currentId) {

        // Update the existing note
        updateNote(currentId, title, content);
    } else {

        // Add a new note
        addNote(title, content);
    }

    // Reset the form fields after submission
    resetForm();

    // Re-render notes to reflect the changes
    renderNotes();
}

// Filters and renders notes based on the search term
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    // Re-render notes based on search input
    renderNotes(searchTerm);
}


// Adds a new note to the notes array and saves it in localStorage
function addNote(title, content) {
    const note = {

        // Generate a unique ID based on the current timestamp
        id: Date.now(),
        title,
        content,

        // Record creation and last edited time
        createdAt: new Date().toLocaleString(),
        lastEdited: new Date().toLocaleString(),
    };

    // Add and save the new note to the start of the array and local storage
    notes.unshift(note);
    saveToLocalStorage();
}

// Updates an existing note with new title and content
function updateNote(id, title, content) {
    notes = notes.map(note => {
        if (note.id === id) {
            return {
                ...note,

                // Updated note title and contents
                title, 
                content,

                // Update the last edited timestamp
                lastEdited: new Date().toLocaleString(),
            };
        }

        // Return unchanged note if ID doesn't match
        return note;
    });

    // Save updated notes to localStorage and clear the current ID after updating
    saveToLocalStorage();
    currentId = null;
    submitButton.textContent = 'Add Note';
}

// Deletes a note after confirming with the user
function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {

        // Remove the note from the array
        notes = notes.filter(note => note.id !== id);

        // Save the updated notes to localStorage and re-render the notes to reflect the deletion
        saveToLocalStorage();
        renderNotes();
    }
}

// Loads the selected note into the input fields for editing
function editNote(id) {

    // Find the note by its ID
    const note = notes.find(note => note.id === id);

    // Fill in the note title, content, the current note ID for updating
    if (note) {
        titleInput.value = note.title;
        contentInput.value = note.content;
        currentId = id;

        // Change button text to 'Update Note'
        submitButton.textContent = 'Update Note';

        // Focus the title input for quick editing
        titleInput.focus();
    }
}


// Rendering and state management
function renderNotes(searchTerm = '') {
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );

    // Display the filtered notes in the grid
    notesGrid.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <h3>${escapeHtml(note.title)}</h3>
            <div class="timestamp">
                Created: ${note.createdAt}
                ${note.lastEdited !== note.createdAt ? `<br>Last edited: ${note.lastEdited}` : ''}
            </div>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-actions">
                <button class="btn btn-edit" onclick="editNoteHandler(${note.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteNoteHandler(${note.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Resets the form inputs and returns the form to its initial state
function resetForm() {

    // Clear the title and content input field
    titleInput.value = '';
    contentInput.value = '';

    // Reset the current ID (no note is being edited)
    currentId = null;

    // Set button text back to 'Add Note'
    submitButton.textContent = 'Add Note';
}

// Saves the current notes array to localStorage
function saveToLocalStorage() {

    // Save notes as a JSON string
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Escapes special HTML characters to prevent XSS attacks
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Event listeners
// Listen for submit button, search input and dark mode toggle click
submitButton.addEventListener('click', handleSubmit);
searchInput.addEventListener('input', handleSearch);
darkModeToggle.addEventListener('click', toggleDarkMode);


// Handlers for edit/delete operations
function editNoteHandler(id) {

    // Load note into the form for editing
    editNote(id);
}


function deleteNoteHandler(id) {

    // Delete the selected note
    deleteNote(id);
}


// Initialize app
init();