import './style.css'
import { getNotes } from './noteAPI';
import { saveNote } from './noteAPI';
import { deleteNote } from './noteAPI';


const notesContainer = document.getElementById("savedNotes");
const titleInputField = document.getElementById("noteTitle");
const contentInputField = document.getElementById("noteContent");
const saveBtnEl = document.getElementById("saveBtn");
const createNewNoteBtnEl = document.querySelector(".add_new");
const deleteBtnEl = document.getElementById('deleteBtn');

const escapeHtml = unsafe => {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

saveBtnEl.addEventListener("click", clickSaveButton);
createNewNoteBtnEl.addEventListener('click', newNote);
deleteBtnEl.addEventListener('click', deleteBtnClick);

displayNotesList();
applyListeners();

function applyListeners() {
  const noteCardsEls = document.querySelectorAll('.note_card');
  noteCardsEls.forEach(noteCard => noteCard.addEventListener('click', () => selectNote(noteCard.getAttribute('data_id')))); 
}

function displayNotesList() {
  const notes = getNotes();
  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastUpdated - noteA.lastUpdated
  );
  let html = "";
  
  sortedNotes.forEach((note) => {
    let safeTitle = escapeHtml(note.title);
    let safeContent = escapeHtml(note.content);
    html += `
        <div class="note_card" data_id="${note.id}">
        <span class="note_title">${safeTitle}</span>
        <span class="note_content">${safeContent}</span>
        <span class="created_at">${new Date(note.lastUpdated).toLocaleString(
          "de-DE"
        )}</span>
        <img src="${note.qrDataUrl}" alt="QR-Code zur Notiz">
        </div>
        `;
        
  });
  notesContainer.innerHTML = html;
}

async function clickSaveButton() {
    const title = titleInputField.value;
    const content = contentInputField.value;
    
    if(!title || !content) {
        alert('Bitte Titel und Inhalt eingeben.');
        return;
    }

    let currentId = undefined;
    let qrImageId = undefined;
    let techSaying = undefined;
    let qrDataUrl = undefined;
    const currentlySelectedNoteEl = document.querySelector('.note_selected');
    if(currentlySelectedNoteEl) {
      currentId = currentlySelectedNoteEl.getAttribute("data_id");
      qrImageId = getCurrentNote(currentId).qrImageId;
      techSaying = getCurrentNote(currentId).techSaying;
      qrDataUrl = getCurrentNote(currentId).qrDataUrl;
    }
    await saveNote(title, content, Number(currentId), qrImageId, techSaying, qrDataUrl);
    titleInputField.value = '';
    contentInputField.value = '';
    displayNotesList();
    applyListeners();
}

function selectNote(id) {
  const selectedNoteEl = document.querySelector(`.note_card[data_id="${id}"]`);
  if(selectedNoteEl.classList.contains(".note_selected")) return;
  removeSelectedFromAll();
  
  const notes = getNotes();
  const selectedNote = notes.find(note => note.id.toString() === id);
  if(!selectedNote) return;
  titleInputField.value = selectedNote.title;
  contentInputField.value = selectedNote.content;
  selectedNoteEl.classList.add("note_selected");
}

function newNote() {
  if(titleInputField.value === '' && contentInputField.value === '') return;
  else {
    titleInputField.value = '';
    contentInputField.value = '';
    removeSelectedFromAll();
  }
}

function removeSelectedFromAll() {
    const noteCardsEls = document.querySelectorAll('.note_card');
    noteCardsEls.forEach(noteCard => noteCard.classList.remove("note_selected"));
}

function deleteBtnClick() {
  const selectedNote = document.querySelector('.note_selected');
  if(!selectedNote) return;
  const selectedNoteId = selectedNote.getAttribute("data_id");
  selectedNote.remove();
  deleteNote(selectedNoteId);
  titleInputField.value = '';
  contentInputField.value = '';
}

function getCurrentNote(givenId) {
  const notes = getNotes();
  const searchedNote = notes.find(note => note.id.toString() === givenId);
  return searchedNote;
}