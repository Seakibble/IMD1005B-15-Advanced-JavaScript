const $form = document.getElementById('form')
const $add = document.getElementById('add')
const $clear = document.getElementById('clear')
const $search = document.getElementById('search')
const $notes = document.getElementById('notes')

let notesArray = localStorage.getItem('notes')

if (notesArray == null) {
    notesArray = []
} else {
    notesArray = JSON.parse(notesArray)
    
    notesArray.forEach(note => {
        displayNote(note)
    })
}


$add.addEventListener('click', (event) => {
    event.preventDefault()

    let note = {
        title: $form.elements.title.value,
        text: $form.elements.text.value
    }
    notesArray.push(note)
    
    displayNote(note)

    localStorage.setItem("notes", JSON.stringify(notesArray))
})

function displayNote(note) {
    let $noteDiv = document.createElement('div')
    $noteDiv.classList.add('note')

    $noteDiv.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.text}</p>`
    
    $notes.append($noteDiv)
}