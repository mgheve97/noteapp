export default function Sidebar(props){

    const noteElements = props.notes.map((note,index) => (
        <div key={note.id}>
            <div
                className={`title ${
                    note.id === props.currentNote.id ? "selected-id": ""
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">Note {index + 1}</h4>
                <button 
                    className="delete-btn"
                    onClick={() => props.deleteNote(note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return(
        <section className="pane sidebar">
            <div className="sidebar-header">
                <h3>Notes</h3>
                <button className="new-Notes" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}