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

let noteId = localStorage.getItem('id')
if (noteId == null) {
    noteId = 0
}

$add.addEventListener('click', (event) => {
    event.preventDefault()

    let note = {
        id: noteId,
        title: $form.elements.title.value,
        text: $form.elements.text.value
    }
    noteId++
    localStorage.setItem('id', noteId)
    $form.elements.title.value = ''
    $form.elements.text.value = ''
    
    notesArray.push(note)
    
    displayNote(note)

    localStorage.setItem("notes", JSON.stringify(notesArray))
})

$clear.addEventListener('click', (event) => {
    event.preventDefault()
    $notes.innerHTML = ''
    notesArray = []
    localStorage.clear()
})

$notes.addEventListener('click', (event) => {
    let $btn = event.target
    if ($btn.tagName == 'BUTTON') {
        let id = $btn.dataset.id
        let index = notesArray.findIndex((note) => {
            return note.id == id
        })
        notesArray.splice(index, 1)
        localStorage.setItem("notes", JSON.stringify(notesArray))

        $btn.parentElement.remove()
    }
})


function displayNote(note) {
    let $noteDiv = document.createElement('div')
    $noteDiv.classList.add('note')

    $noteDiv.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.text}</p>
        <button data-id="${note.id}" >X</button>`
    
    $notes.append($noteDiv)
}