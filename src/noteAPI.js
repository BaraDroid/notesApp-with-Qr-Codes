const LOCAL_STORAGE_KEY = 'notizapp-notes';

export function getNotes() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

export async function saveNote(title, content, id = undefined) {
    await getRandomTechSaying();
    const notes = getNotes();
    if(!id) {
        notes.push({
        title,
        content,
        lastUpdated: new Date().getTime(),
        id: getNextId(),
        canvasId: getCanvasId(),
        techSaying: await getRandomTechSaying(),
    });
    } else {
        const indexOfNoteWithId = notes.findIndex(note => note.id === id);
        if(indexOfNoteWithId !== -1) {
            notes[indexOfNoteWithId] = {
                title,
                content,
                lastUpdated: new Date().getTime(),
                id,
                canvasId: canvasIdValue,
                matchedMeme,
            }
        }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

function getNextId() {
    const notes = getNotes();
    const sortedNotes = notes.sort((noteA, noteB) => noteA.id - noteB.id);
    let nextId = 1;
    for(let note of sortedNotes) {
        if(nextId < note.id) break;
        nextId = note.id + 1;
    }
    return nextId;
}

function getCanvasId() {
  return 'canvas_' + Math.random().toString(36).substring(2, 9);
}

export function deleteNote(idToDelete) {
    const notes = getNotes();
    let filteredNotes = notes.filter(note => note.id.toString() !== idToDelete);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredNotes));
}

async function getRandomTechSaying() {
  let firstResponse = `https://techy-api.vercel.app/api/text`;
    let response = await fetch(firstResponse);
    //let techySentence = await response.json();
    let techySentence = await response.text();
    return techySentence;
}

