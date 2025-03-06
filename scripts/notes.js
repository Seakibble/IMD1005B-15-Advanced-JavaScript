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

    let now = new Date()
    
    let date = now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear()
    let hours = now.getHours()
    let minutes = now.getMinutes()

    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    let time = hours + ":" + minutes
    

    let note = {
        id: noteId,
        title: $form.elements.title.value,
        text: $form.elements.text.value,
        timestamp: time + " - " + date
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

let timer = null
$search.addEventListener('keydown', (event) => {
    if (timer != null) {
        clearTimeout(timer)
    }

    timer = setTimeout(search, 500)
})

function search() {
    let query = $search.value.toLowerCase()
    
    if (query == '') {
        $notes.innerHTML = ''
        notesArray.forEach(note => {
            displayNote(note)
        })
        return
    }

    let matches = []
    console.log('Test')
    for (let i = 0; i < notesArray.length; i++) {
        console.log('Test2')
        if (notesArray[i].title.toLowerCase().includes(query)) {
            matches.push(notesArray[i])
        } else if (notesArray[i].text.toLowerCase().includes(query)) {
            matches.push(notesArray[i])
        }
    }
    console.log(matches)
    
    $notes.innerHTML = `<p class='results'>Results: ${matches.length}</p>`
    matches.forEach(note => {
        displayNote(note, true)
    })
}


function displayNote(note, highlight = false) {
    let $noteDiv = document.createElement('div')
    $noteDiv.classList.add('note')

    if (highlight) {
        $noteDiv.classList.add('highlight')
    }

    $noteDiv.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.text}</p>
        <p class='time'>${note.timestamp}</p>
        <button data-id="${note.id}" >X</button>`
    
    $notes.append($noteDiv)
}