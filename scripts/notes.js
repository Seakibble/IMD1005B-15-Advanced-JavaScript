// First, we're getting references to any elements on the page we'll need, and saving them as variables. They're defined using const instead of let because we don't intend to change them later.
const $form = document.getElementById('form')
const $add = document.getElementById('add')
const $clear = document.getElementById('clear')
const $search = document.getElementById('search')
const $notes = document.getElementById('notes')

// We're making an array to contain all the notes we'll be working with.
// Arrays contain sets of information like this: [1, 5, 7]
// To start, we're accessing local storage to get any notes data saved there (on first page load, there won't be any, so don't worry about it).
let notesArray = localStorage.getItem('notes')

// If there's nothing in the notes array, there's no data in local storage, so we should set the value to a new array with []
if (notesArray == null) {
    notesArray = []
} else {
    // If there is something in notes array, then it's saved data from before. It'll be in JSON format, which is a complex data object, converted into a text string. As a string, it's useless to us, so we need to convert it back into an object with JSON.parse()
    notesArray = JSON.parse(notesArray)
    
    // Then we have notes, so we'll display them
    notesArray.forEach(note => {
        // Later on, we have defined a function that displays a given note
        displayNote(note)
    })
}


// Each note needs a unique id, so that we can find them. To generate this number, we start at 0, and increment by 1 each time we make a note. If we reload the page and have notes, we'll also neet to keep the id we're at, so we don't start making notes from 0 again. If we do that, we'll create duplicate ids.
let noteId = localStorage.getItem('id')

// If there's no saved id, then we can just start from 0
if (noteId == null) {
    noteId = 0
}

// We'll have a bunch of eventlisteners for our buttons. These will execute when the relevant button is clicked.
$add.addEventListener('click', (event) => {
    // $add and $clear are located in a form tag. By default, buttons in forms will attempt to submit the form, which will reload the page. To prevent this, we have to call preventDefault(), which stops the normal behaviour from happening.
    event.preventDefault()

    // Among other things, we want to save the date and time a note is created. We can get this information by creating a Date() object. By default, it will initialize with the current date and time, down to the millisecond.
    let now = new Date()
    
    // Date objects have a bunch of functions to get specific bits of information, such as what day of the month it is, which month, which year, etc. We'll save all these to variables.
    // One thing I missed in class is that getMonth() gives us an integer from 0 - 11, because reasons, apparently. Tsk tsk, silly programmers... So January 6th would be 6/0/2025. We we need to add 1 to the month to account for this.
    let date = now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear()
    let hours = now.getHours()
    let minutes = now.getMinutes()

    // If the hours or minutes are a single digit, then we need to add a leading 0 because these Date functions won't do that for us.
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    // Last thing is we combine the hours and minutes to get the time.
    let time = hours + ":" + minutes
    

    // Now, here we construct teh note object that will hold all the information about a note. This includes the id, timestamp, and the text and title. The struction of a javascript object is defined with curly braces {}. Each property inside it is basically its own variable. We initialize them with colons here, giving them each a key/name so we can refer to them. We can then access, say the id, by writing note.id.
    // We initialize the id with our global noteId, we set the title and text equal to the input values, and the timestamp will be constructed from our earlier Date related variables.
    let note = {
        id: noteId,
        title: $form.elements.title.value,
        text: $form.elements.text.value,
        timestamp: time + " - " + date
    }

    // Next we increment noteId, so the next note has a different ID. Then we save the new ID to local storage, so we can access it on later page loads.
    noteId++
    localStorage.setItem('id', noteId)

    // Next, we'll empty out the input fields, so that they can be filled again.
    $form.elements.title.value = ''
    $form.elements.text.value = ''
    
    // Now that we have our note object, we have to add it to the notesArray, which contains all the notes on the page.
    notesArray.push(note)

    // Then we'll save the updated notesArray to localStorage. This will allow us to get access to them again when we next load the page.
    // local storage can only handle simple data types like strings, booleans, or numbers. So we can't just dump the array in, it's too complex. To deal with this, if we're saving an array, or an object (or a combination, as is our case), then we need to convert it to JSON format. JSON is JavaScript Object Notation, and it allows us to store complex data types as a string. So we save our stringified array to localStorage under the key 'notes'. This is the name we'll use to access it later.
    localStorage.setItem("notes", JSON.stringify(notesArray))

    // The last thing to do is actually display the note on the page.
    displayNote(note)
})

// This button clears all notes from storage. 
$clear.addEventListener('click', (event) => {
    event.preventDefault()

    // To do this, we remove all the notes from the HTML...
    $notes.innerHTML = ''
    // ...then we reset the notesArray...
    notesArray = []
    // ...and finally we out the local storage, so the notes won't come back when we reload the page.
    localStorage.clear()
})

// This code handles the X buttons on the notes, which deletes them individually.
// We're putting this event listenr on $notes, which is the div that contains all notes on the page. 
$notes.addEventListener('click', (event) => {
    // event.target is the element directly under the cursor when we click.
    let $btn = event.target
    // Because we could be clicking anywhere in the containing div, we need to check if we're actually clicking on a button. The only buttons in the div are the delete buttons, so this works out quite conveniently for us. This approach is much better than setting up event listeners on each button individually, because we only have to do it once, when the page loads.
    if ($btn.tagName == 'BUTTON') {
        // When we put the note on the page, we're setting the id as a data attribute. This allows us to get that information here, in Javascript land. Data attributes can be accessed through dataset.
        let id = $btn.dataset.id

        // Next, we need to get the index (the place in the array) of the note we've selected. To do this, we call findIndex on notesArray. This function runs a check on each note until it finds one that returns true. The check is just comparing the id of the note with the data-id of the button. findIndex then returns the index of the array for the matching element.
        let index = notesArray.findIndex((note) => {
            return note.id == id
        })

        // Then we remove the relevant note at the index we found. We use Array.splice() for this, which takes the index (where in the array to start the splice), and how many items from that point should be removed. The function is splice() with a p, not to be confused with slice().
        notesArray.splice(index, 1)

        // Then we update localStorage
        localStorage.setItem("notes", JSON.stringify(notesArray))

        // Finally, we remove the note from the page, by deleting the parentElement, which is the div which contains the note.
        $btn.parentElement.remove()
    }
})

// This code handles the search input. We'll have the search bar automatically search notes as we type text into it. To to this, we'll have a short delay on it to account for multiple keystrokes in quick succession.
// We start by defining a referernce to a timer. It's empty to start with.
let timer = null
// Then we have an event listener for keypresses while the searchbar is focused.
$search.addEventListener('keydown', (event) => {
    // If the timer is active, timer will not be null.
    if (timer != null) {
        // If timer isn't null, we need to reset the timer, so we have to clear it first. If we don't, the search will trigger multiple times.
        clearTimeout(timer)
    }

    // Finally, we'll actually set the timer. This will call the search() function we define below, after 500 milliseconds pass. setTimeout returns an id which is a number we can use to reference this timeout if we need to clear it, which is what the above code handles. So we set timer to be this value.
    timer = setTimeout(search, 500)
})

// This code handles the search algorithm
function search() {
    // First, we get the text we want to look for. We're setting it to lowercase because we want the search to be case insensitive - i.e. 'Hello' should find 'Hello', 'hello', and 'HELLO'.
    let query = $search.value.toLowerCase()
    
    // If the search bar is empty, we want to reset the notes to their default presentation (showing all notes), then end the function.
    if (query == '') {
        $notes.innerHTML = ''
        notesArray.forEach(note => {
            displayNote(note)
        })
        return
    }

    // We need an array to hold the matches.
    let matches = []
    
    // We'll loop through the notesArray...
    for (let i = 0; i < notesArray.length; i++) {
        // If, in a given note we find that the title or the text includes the query string, then we'll add this note to the matches array. includes() is a function that checks to see if one string is inside another - if query can be found within title or text.
        if (notesArray[i].title.toLowerCase().includes(query)) {
            matches.push(notesArray[i])
        } else if (notesArray[i].text.toLowerCase().includes(query)) {
            matches.push(notesArray[i])
        }
    }
    
    // Then, we output the number of results, followed by the matched notes.
    $notes.innerHTML = `<p class='results'>Results: ${matches.length}</p>`
    matches.forEach(note => {
        // For these notes, we want to highlight them, so we also provide true as the second parameter.
        displayNote(note, true)
    })
}

// Lastly, we have our code for displaying a given note.
// It takes note object, and an optional boolean to toggle on highlighting.
function displayNote(note, highlight = false) {
    // First, we construct a div to hold our note. This only exists in javascript land until we put it on the page somewhere
    let $noteDiv = document.createElement('div')
    // Next, we add the class 'note' so it gets styled nicely.
    $noteDiv.classList.add('note')

    // If the note is highlighted, we'll add highlighting styles.
    if (highlight) {
        $noteDiv.classList.add('highlight')
    }

    // Then we add the content that will be in the div. We're defining this using backticks (`) because these allow us to write big chucks of HTML across multiple lines without worrying about escaping quotes or double quotes. We can also use the ${} placeholder syntax, which lets us insert snippets of javascript seamlessly. That means we can just dump our note data in as needed.
    $noteDiv.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.text}</p>
        <p class='time'>${note.timestamp}</p>
        <button data-id="${note.id}" >X</button>`
    
    // Finally, we append the note div and its content to the $notes container.
    $notes.append($noteDiv)
}