// const Display = ({ counter }) => <div>{counter}</div>;

// const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

// const App = () => {
//   const [counter, setCounter] = useState(0);
//   console.log('rendering with counter value', counter);

//   // const handleCLick = () => {
//   //   console.log('clicked');
//   // };

//   const increaseByOne = () => {
//     console.log('increasing, value before', counter);
//     setCounter(counter + 1);
//   };
//   const decreaseByOne = () => {
//     console.log('decreasing, value before', counter);
//     setCounter(counter - 1);
//   };
//   const setToZero = () => {
//     console.log('resetting to zero, value before', counter);
//     setCounter(0);
//   };

//   return (
//     <div>
//       <Display counter={counter} />
//       <Button onClick={increaseByOne} text="plus" />
//       <Button onClick={setToZero} text="zero" />
//       <Button onClick={decreaseByOne} text="minus" />
//     </div>
//   );
// };

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return <div>the app is used by pressing the buttons</div>;
//   }
//   return <div>button press history: {props.allClicks.join(' ')}</div>;
// };

// const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
// <button>abcd</button>;

// const App = () => {
//   const [left, setLeft] = useState(0);
//   const [right, setRight] = useState(0);
//   const [allClicks, setAll] = useState([]);
//   const [total, setTotal] = useState(0);

//   // const [clicks, setClicks] = useState({
//   //   left: 0,
//   //   right: 0,
//   // });

//   // const handleLeftClick = () => setClicks({ ...clicks, left: clicks.left + 1 });

//   // const handleRightClick = () =>
//   //   setClicks({ ...clicks, right: clicks.right + 1 });

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'));
//     const updatedLeft = left + 1;
//     setLeft(updatedLeft);
//     setTotal(updatedLeft + right);
//   };
//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'));
//     const updatedRight = right + 1;
//     setRight(updatedRight);
//     setTotal(left + updatedRight);
//   };

//   return (
//     <div>
//       {left}
//       <Button onClick={handleLeftClick} text="left" />
//       <Button onClick={handleRightClick} text="right" />
//       {right}
//       <History allClicks={allClicks} />
//     </div>
//   );
// };

// const Display = (props) => <div>{props.value}</div>;

// const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

// const App = () => {
//   const [value, setValue] = useState(10);

//   const setToValue = (newValue) => {
//     console.log('value now', newValue);
//     setValue(newValue);
//   };

//   return (
//     <div>
//       <Display value={value} />
//       <Button onClick={() => setToValue(1000)} text="thousand" />
//       <Button onClick={() => setToValue(0)} text="reset" />
//       <Button onClick={() => setToValue(value + 1)} text="increment" />
//     </div>
//   );
// };

import { useState, useEffect } from 'react';

import Note from './components/Note';
import noteService from './services/notes';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2025
      </em>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // const hook = () => {
  //   console.log('effect');
  //   axios.get('http://localhost:3001/notes').then((response) => {
  //     console.log('promise fulfilled');
  //     setNotes(response.data);
  //   });
  // };

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      return setNotes(initialNotes);
    });

    // axios
    //   .get('http://localhost:3001/notes')
    //   .then((response) => {
    //     console.log('response 1', response.data);
    //     return response.data;
    //   })
    //   .then((responseData) => {
    //     console.log('response 2', responseData);
    //     return responseData;
    //   })
    //   .then((thirdResponse) => {
    //     console.log('third response', thirdResponse);
    //     return setNotes(thirdResponse);
    //   });
  }, []);

  // useEffect(hook, []);
  // console.log('render', notes.length, 'notes');

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });
  };

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      {console.log('notesToShow', notesToShow)}
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
