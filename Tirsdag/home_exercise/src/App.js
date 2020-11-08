import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import bookFacade from "./bookFacade";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useParams,
  useRouteMatch,
  useLocation,
  Prompt,
  Link,
  useHistory
} from "react-router-dom";



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();

  const setLoginStatus = status => {
    setIsLoggedIn(status);
    history.push("/");
  }


  
  return (
    <div>
  <Header />
  <ul className="header">
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
  <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
  {isLoggedIn && (<li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>)}
  {isLoggedIn && (<li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>)}
  <li><NavLink activeClassName="active" to="/login-out">Login</NavLink></li>
</ul>
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/products">
      <Products bookFacade={bookFacade}/>
    </Route>
    <Route path="/company">
      <Company />
    </Route>
    <Route path="/add-book">
      <Add_Book />
    </Route>
    <Route path="/find-book">
      <Find_Book />
    </Route>
    <Route path="/login-out">
      <Login loginMsg = {isLoggedIn ? "Logout" : "Login"} 
      isLoggedIn={isLoggedIn}
      setLoginStatus={setLoginStatus}
      />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </Switch>
</div>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

function Products() {
 
  let { topicId } = useParams();
  return (
    <div>
      <h3>{topicId} {bookFacade.getBooks().length} 
  {bookFacade.getBooks().map(book => <li key={book.toString()}>{book.title}</li>)}
  <p>"Book details for selected book will go here"</p>
      </h3>
    </div>
  );
}

function Company() {

  let { topicId } = useParams();

  return (
    <div>
      <h3>{topicId}</h3>
    </div>
  );
}

function Add_Book() {
  let [isBlocking, setIsBlocking] = useState(false);
  const emptyBook = {id: "", title: "", info:""};
  const [book,addBook] = useState(emptyBook);
  
  const handleChange = event => {
    setIsBlocking(event.target.value.length > 0);
    const target = event.target;
    const id = target.id;
    const value = target.value;
    addBook({ ...book, [id]: value });
  };
  
  const handleSubmit = event => {
    event.preventDefault();
        event.target.reset();
        setIsBlocking(false);
    bookFacade.addBook(book);
    alert("The book you entered: " + book.info + " " + book.title);
    
  }


  return (
    <div>
      <Prompt
        when={isBlocking}
        message={location =>
          `Are you sure you want to go to ${location.pathname}`
        }
      />
      <h3> Add book </h3>
      <form onSubmit = {handleSubmit}>
        <input
          id="title"
          value ={book.title}
          placeholder="add title"
          type="text"
          onChange={handleChange}
        />
        <br />
        <input
          id="info"
          value ={book.info}
          placeholder="add info"
          type="text"
          onChange={handleChange}
        />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}

function Login({isLoggedIn, loginMsg, setLoginStatus}){
  const handleBtnClick = () => {
    setLoginStatus(!isLoggedIn);
  };
  return(
  <div>
    <h2>{loginMsg}</h2>
    <em>Okay lang tekst her.</em>
  <button onClick ={handleBtnClick}>{loginMsg}</button>
  </div>
  );
}

function Home() {

  let { topicId } = useParams();

  return (
    <div>
      <h3>Matched{topicId}</h3>
    </div>
  );
}
function Header() {

  let { topicId } = useParams();

  return (
    <div>
      <h3>{topicId}</h3>
    </div>
  );
}

function Find_Book() {

  const [book,setBook] = useState(0);
  
  const handleChange = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setBook({id: value});
  };
  
  const handleSubmit = event => {
    event.preventDefault();
    setBook(bookFacade.findBook(book.id));    
  }

  const handleDelete = event => {
    event.preventDefault();
    bookFacade.deleteBook(book.id);    
  }

  return (
    <div>
      <form onSubmit = {handleSubmit}>
      <input
          id="id"
          value = {book.id}
          placeholder="Enter book Id"
          type="number"
          onChange = {handleChange}
        />
        <button>Find book</button>
  <p>Book id: {book.id}</p>
  <p>Book title: {book.title}</p>
  <p>Book info: {book.info}</p>
  <p>Delete book here</p>
  <button onClick = {handleDelete}>Delete with id</button>
  </form>
    </div>
  );
}


export default App;
