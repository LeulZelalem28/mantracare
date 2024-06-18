import React, { useEffect, useState } from 'react';
import { FaStickyNote, FaTrash, FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import './note.css';
import { toast, ToastContainer } from 'react-toastify';

const Note = ({ accessToken }) => {
  const { roomId } = useParams();
  const [note, setNote] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    fetchNotes();
  }, [roomId, note]);

  const fetchNotes = async () => {
    try {
      setIsNoteLoading(true);
      const url = `${baseUrl}/notes/session/${roomId}`;

      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, requestOptions);

      if (response.status === 200) {
        const data = await response.json();
        setNoteList(data);
      } else if (response.status === 204) {
        // Do nothing if no notes are found
      } else {
        const errorMessages = await response.json();
        toast.error('Failed to fetch notes', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setIsNoteLoading(false);
    } catch (error) {
      toast.error('Failed to fetch notes', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsNoteLoading(false);
    }
  };

  const sendNote = async () => {
    if (note !== '') {
      const noteData = {
        sessionId: roomId,
        note,
        timeStamp: new Date(),
      };

      try {
        const url = `${baseUrl}/notes`;
        const requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(noteData)
        };

        const response = await fetch(url, requestOptions);

        if (response.status !== 201) {
          const errorMessages = await response.json();
          
        }
      } catch (error) {
       
      }
      setNoteList((prevNoteList) => [...prevNoteList, noteData]);
      setNote('');
    }
  };

  const updateNote = async (noteId, noteContent) => {
    try {
      const url = `${baseUrl}/notes/${noteId}`;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note: noteContent })
      };

      const response = await fetch(url, requestOptions);

      if (response.status === 200) {
        setNoteList((prevNoteList) =>
          prevNoteList.map((note) =>
            note.noteId === noteId ? { ...note, note: noteContent } : note
          )
        );
        setEditNoteId(null);
        setEditNoteContent('');
        
      } else {
        const errorMessages = await response.json();
        
      }
    } catch (error) {
      
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const url = `${baseUrl}/notes/${noteId}`;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, requestOptions);
      console.log(response.status)
      if (response.status === 200) {
        // Remove the deleted note from the note list
        setNoteList((prevNoteList) => prevNoteList.filter((note) => note.noteId !== noteId));
        
      } else {
        const errorMessages = await response.json();
        
      }
    } catch (error) {
      
    }
  };

  return (
    <div className='note-container'>
      <ToastContainer />
      {isNoteLoading ? (
        <div className="loader-container">
          <ClipLoader color="#007AFF" size={50} />
        </div>
      ) : (
        <div className='note-body'>
          {noteList.map((note, index) => (
            <div className='note-item' key={index}>
              {editNoteId === note.noteId ? (
                <>
                  <input
                    type='text'
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                  />
                  <button onClick={() => updateNote(note.noteId, editNoteContent)}>
                    Save
                  </button>
                  <button onClick={() => setEditNoteId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <div className='note-content'>{note.note}</div>
                  <div className='note-meta'>
                    <div className='note-date'>
                      {new Date(note.timeStamp).toLocaleDateString()}
                    </div>
                    <div className='note-time'>
                      {new Date(note.timeStamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className='note-actions'>
                    <button onClick={() => {
                      setEditNoteId(note.noteId);
                      setEditNoteContent(note.note);
                    }}>
                      <FaEdit />
                    </button>
                    <button onClick={() => deleteNote(note.noteId)}>
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className='note-footer'>
        <input
          type='text'
          value={note}
          placeholder='Write a note...'
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendNote();
            }
          }}
        />
        <button onClick={sendNote}>
          <FaStickyNote />
        </button>
      </div>
    </div>
  );
};

export default Note;
