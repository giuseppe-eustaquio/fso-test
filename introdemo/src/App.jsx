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

import { useState, useEffect, useRef } from 'react';

import Note from './components/Note';
import noteService from './services/notes';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';

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
  const [loginVisible, setLoginVisible] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  // useEffect(hook, []);
  // console.log('render', notes.length, 'notes');

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));

      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const noteFormRef = useRef();

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
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

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const noteForm = () => {
    return (
      <Togglable buttonLabel="new note" ref={noteFormRef}>
        <NoteForm createNote={addNote} />
      </Togglable>
    );
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? loginForm() : noteForm()}

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

      <Footer />
    </div>
  );
};

export default App;
