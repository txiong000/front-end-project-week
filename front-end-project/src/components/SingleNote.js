import React from "react"
import './component.css'
import DeleteModal from "./DeleteModal";


class SingleNote extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showModal: false,
        }
    }

    handleShowMessageClick = () => this.setState({showModal: true})
    handleCloseModal = () => this.setState({showModal: false})

    render() {
        return (
            <div className="single-note">
                <div className="delete-edit">
                    <h1 className="edit-btn" onClick={(ev)=> {this.props.goToEditForm(ev, this.props.note.id)
                    this.props.history.push(`/edit-Note/${this.props.note.id}`)}}>Edit</h1>
                    <h1 className="delete-btn" onClick={this.handleShowMessageClick
                    }>Delete</h1>
                </div>
                <h1 onClick={(ev)=> {this.props.goToEditForm(ev, this.props.note.id)
                    this.props.history.push(`/edit-Note/${this.props.note.id}`)}} className="single-title">
                    { this.props.note.title}
                </h1>
                <p onClick={(ev)=> {this.props.goToEditForm(ev, this.props.note.id)
                    this.props.history.push(`/edit-Note/${this.props.note.id}`)}} className="single-para">
                    { this.props.note.content}
                </p>
                {this.state.showModal ? (
                <DeleteModal onClose={this.handleCloseModal} note={this.props.note} deleteNote={this.props.deleteNote}>
                    <p className="modal-text">Are you sure you want to delete this?</p>
                </DeleteModal>
          ) : null}
            </div>
        )
    }

}

export default SingleNote;



