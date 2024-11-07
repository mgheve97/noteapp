import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Split from 'react-split'
import { addDoc, deleteDoc, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore'
import { db, notesCollection } from './Firebase/firebase'


export default function App() {
  const [notes, setNotes] = useState([])
  const [currentNoteId, setCurrentNoteId] = useState("")
  const [tempNoteText, settempNoteText] = useState("")

  const MAX_NOTES = 10;

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

  /* Creating a new Note */
  async function createNewNote(){
    const snapshot = await getDocs(notesCollection);
    const notesCount = snapshot.size;

    if(notesCount >= MAX_NOTES){
      alert(`You can only create up to ${MAX_NOTES} notes.`)
      return
    }
    const newNote = {
        body: "# Type your markdown note's title here",
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
    
  }

  /* Updating the Body Text*/
  async function UpdateNote(text){
    const docref = doc(db, "notes", currentNoteId)
    await setDoc(docref, {body: text, updatedAt: Date.now()}, {merge: true})
    
  }

  /* Delete a note function */
  async function deleteNote(noteId) {
    const docref = doc(db, "notes", noteId)
    await deleteDoc(docref)
  }

  useEffect(() =>{
    const unsubscribe = onSnapshot(notesCollection, function (snapshot){
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      const sortedNotes = notesArr.sort((a, b) => b.updatedAt - a.updatedAt)

      setNotes(sortedNotes)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if(!currentNoteId){
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  useEffect (() => {
    currentNote ? settempNoteText(currentNote?.body): ""

  }, [currentNote])

  useEffect(() =>{
    const timeoutId = setTimeout(()=>{
      tempNoteText !== currentNote.body ? UpdateNote(tempNoteText) : ""
    }, 500)
    return () => clearTimeout(timeoutId)
  },[tempNoteText])


  return (
    <div>
      <main>
        {
        notes.length > 0 ? 
        <Split
          sizes= {[30,70]}
          direction = "horizontal"
          className ="split"
        >
          <Sidebar
            notes = {notes}
            currentNote = {currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote = {createNewNote}
            deleteNote = {deleteNote}
          /> 
          <Editor 
              tempNoteText={tempNoteText}
              settempNoteText={settempNoteText}
          />
        </Split> : <div className="no-notes">
          <h1>You have no notes</h1>
          <button
            className='first-note'
            onClick={createNewNote}
          >Create New Note</button>
        </div>
      }
      </main>
    </div>
  )
}
