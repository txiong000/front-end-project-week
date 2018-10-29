import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import NoteListContainer from './components/NoteListContainer';
import NavSideBar from './components/NavSideBar';
import AddNote from './components/AddNote';
import { Route } from "react-router-dom"

class App extends Component {
  constructor(){
    super()
    this.state = {
      notes:  [],
      title: "",
      textBody: ""
    }
  }



  componentDidMount() {
    axios.get("https://killer-notes.herokuapp.com/note/get/all")
         .then(response => {
           this.setState({ notes: response.data })
         })
         .catch(error => {
           console.log("error", error)
         })
  }

  changeHandler = ev => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  addNewNote = () => {
    
    axios.post("https://killer-notes.herokuapp.com/note/create", {title: this.state.title, textBody: this.state.textBody} )
          .then(response => {
            console.log("response", response)
            this.setState({ notes: response.data})
          })
          .catch(error => {
            console.log("error", error)
          })
        this.setState({ addTitle: "", addBody: ""})
  }
       
  


  render() {
    return (
      <div className="App">
      <div className="nav-width"></div>
      <NavSideBar />
      <Route exact path="/noteList" render={props => (
        <NoteListContainer {...props} notes={this.state.notes} />
      )} />
      <Route exact path="/addNote" render={props => (
        <AddNote 
        {...props} 
        changeHandler={this.changeHandler} 
        addNewNote={this.addNewNote} 
        addBody={this.state.textBody}
        addTitle={this.state.title} />
      )} />
      </div>
    );
  }
}

export default App;
