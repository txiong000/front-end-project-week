import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import NoteListContainer from './components/NoteListContainer';
import NavSideBar from './components/NavSideBar';
import AddNote from './components/AddNote';
import SingleNote from './components/SingleNote';
import EditNote from './components/EditNote';
import { Route } from "react-router-dom";
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
const update = require('immutability-helper');




class App extends Component {
  constructor(){
    super()
    this.state = {
      notes:  [],
      filterNotes:[],
      title: "",
      content: "",
      searchInput:"",
      activeNote: "",
      editId: null,
    }
  }



  componentDidMount() {
    // axios.get("https://fe-notes.herokuapp.com/note/get/all")
    //      .then(response => {
    //        this.setState({ notes: response.data })
    //      })
    //      .catch(error => {
    //        console.log("error", error)
    //      })
    this.getNotes();
   
  }


  

  
  moveCard = (dragIndex, hoverIndex) => {
    const { notes } = this.state
    const dragCard = notes[dragIndex]

    this.setState(
      update(this.state, {
        notes: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    )
  }

  getNotes = () => {
    axios.get("http://localhost:8500/notes/")
    .then(response => {
      console.log("get",response.data)
      this.setState({ notes: response.data })
    })
    .catch(error => {
      console.log("error", error)
    })
  }

  searchNoteBar = event => {
    // const prevNotes = this.state.notes.slice();
    console.log("event",event)
    const notes = this.state.notes.filter(note => {
      if(note.title.toLowerCase().includes(event.target.value)){
        return note
      }
    });
    this.setState({
      filterNotes: notes
    })
    
  }

  changeHandler = ev => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  addNewNote = () => {
    const newNotes = {
      title: this.state.title,
      content: this.state.content
    }

    axios.post("http://localhost:8500/notes/add", newNotes )
          .then(response => {
            console.log("response", response.data.success)
           newNotes.id = response.data.success;
           console.log("this is a test",newNotes)
           this.setState({title: "",content:"", notes: [...this.state.notes, newNotes]})
          })
        // this.setState({title: "",textBody:"", notes: [...this.state.notes, newNotes]})
  }

  getNoteId = (item) => {
   console.log(item)
    axios
        .get(`http://localhost:8500/notes/${item.id}`)
        .then(res => {
          console.log("res", res.data)
          this.setState({ activeNote: res.data})
        })
  }

  deleteNote = (id) => {
    
    console.log("delete", id)
     axios.delete(`http://localhost:8500/notes/${id}`)
     .then(res => {
       console.log("delete this",res.data)
      //  this.setState({ notes: [...this.state.notes]})
      this.getNotes();
     })
     .catch(error => {
       console.log("error", error)
     })
  }

  sortAtoZ = e =>{
    console.log("note length",this.state.notes.length)
    e.preventDefault();
    const sortedNote = this.state.notes;
    sortedNote.sort(function(a, b){
      var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase();
      if (nameA < nameB) //sort string ascending
       return -1;
      if (nameA > nameB)
       return 1;
      return 0; //default return value (no sorting)
     });
    this.setState({
      notes: sortedNote
    })
  }


  // editNote = () => {
  //   console.log("this state id editnote", this.state.editId)

  //   axios.put(`https://fe-notes.herokuapp.com/note/edit/${this.state.editId}`,
  //        {title: this.state.title, textBody: this.state.textBody})
  //         .then(res => {
  //           console.log("edit", res.data)
  //           this.setState({ notes: [...this.state.notes], editId: null, title:"", textBody:"" })
  //         })
  // }

  goToEditForm = (ev, notes) => {
    ev.preventDefault();
    console.log("goeditform", notes)
    this.setState({
      title: this.state.title,
      content: this.state.content,
      editId: notes
    })
  }
       
  


  render() {
    return (
      <div className="App">
      <div className="nav-width"></div>
      <NavSideBar searchNoteBar={this.searchNoteBar} searchInput={this.state.searchInput} changeHandler={this.changeHandler}/>
      <Route exact path ="/note-list/:id" render={props => (
        <SingleNote {...props} deleteNote={this.deleteNote} note={this.state.activeNote} goToEditForm={this.goToEditForm} />
      )} />
      <Route exact path="/note-list/" render={props => (
        <NoteListContainer {...props}  moveCard={this.moveCard} sortAtoZ={this.sortAtoZ} notes={this.state.filterNotes.length > 0 ? this.state.filterNotes : this.state.notes} getNoteId={this.getNoteId} />
      )} />
      <Route exact path="/add-Note" render={props => (
        <AddNote 
        {...props} 
        changeHandler={this.changeHandler} 
        addNewNote={this.addNewNote} 
        addBody={this.state.content}
        addTitle={this.state.title} />
      )} />
      <Route exact path="/edit-Note/:id" render={props => (
        <EditNote 
        {...props}
        unEditView={this.unEditView}
        getNote={this.getNotes}
        // title={this.state.title}
        // textBody={this.state.textBody}
        // changeHandler={this.changeHandler} 
        // addBody={this.state.textBody}
        // addTitle={this.state.title}
        editNote={this.editNote}
        note={this.state.activeNote}
        // notes={this.state.notes}
         />
      )} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);