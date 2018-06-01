//need to import react because of the react component
import React from 'react';
//importing modal - a default export 
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';

export default class AddLink extends React.Component {
      //to convert from an uncontrolled to the controlled 
        //input we are going to be setting up state
        //to set up state, we will need to provide a contructor function
        constructor(props) {
            super(props);
            /*The sole reason why we are setting up this
            constructor is so we can set this.state */
            this.state = {
                //we are just keeping track of the url
                //the value the user has typed into the field
                url: '',
                //state to maintain whether the modal should be opened or closed
                isOpen: false,
                //setting up an error state - the goal is to display errors
                //by default the error state will be empty
                error: ''
            }
        }


    
    onSubmit(e) {
        
        //we are saving the url submitted into const url
        // const url = this.refs.url.value.trim()
        /*We will no longer set the url off the DOM because 
        it is sitting in the state so we  will save the state into variable 
        and comment out const url = this.refs.url.value.trim() */
        //this line: const url = this.state.url; is the same
        // as the line below which is based on ES6 formating
        const { url } = this.state;

        e.preventDefault();
        //to prevent a fullpage refresh

        //to make sure there is a value in the url
        //if (url) { - removed in lecture 91 - we will let the method 
        //take care of the error state and display the error
            //insert the links/url into the database 
            //and also we associate the userID with the submitted link
            //we want to be able to show the user who is logged in, only
            //the links they have submitted.
            //because the following insert takes place in a react component
            //it is unsafe since the client has access to the databases
            //thus we insert links using methods in the links.js found in the api
            //prior insert code was: Links.insert({ url, userId: Meteor.userId() });
            //clearing the value that was in text field
            //

            /*  Prior we would wipe this.refs.url.value once we had inserted the link to 
            the database but we are going to wipe the value only if there is no error.
            To achieve this, 
            We will add a third argument, a callback function that is called 
            when an insert is call is made. The call back will return
            a response or an err */
            Meteor.call('links.insert', url, (err, res) => {
                /* in the case of of no error
                set the url input to an empty string  */
                if (!err) {
                    //empties the string and sets isOpen to false 
                    //so that the modal box closes and the input box is cleared
                    //we also clean out the error
                    this.handleModalClose();

                } else {
                    //if there is an error and show it to the screen
                    //by changing the state 
                    this.setState({ error: err.reason });
                }

            });
            //this.refs.url.value = '';

            //we will have to change the component updating the error state
            //with a reason.
        
    }
    /* the e argument is our event 
    and we will be able to access the value of the input below using
    e.targer.value*/
    onChange(e) {
        this.setState({
            //trim removes all spaces from the value
            url: e.target.value
        })
    }
    handleModalClose(){
        this.setState({
            isOpen: false, 
            url: '', 
            error: ''
        });

    }

    render() {
        return (
            <div>
                {/* a click handler to toggle the modal */}
                <button className="button" onClick={() => this.setState({isOpen: true})}>+ Add Link</button>
                {/* added modal to render a modal
                modal requires properties 
                the first is isOpen to say if it
                the modal should be opened or close
                the next is content label - which is a string
                for description purposes */}
               <Modal 
               isOpen={this.state.isOpen} 
               contentLabel="Add link"
            //    let you provide a function which gets called after the modal is opened
            //lets us focus on a url
                onAfterOpen={() => this.refs.url.focus()}
                // lets us provide a function and the function gets called when w
                //the modal componenet is requesting that the modal be closed
                onRequestClose={this.handleModalClose.bind(this)}
                className="boxed-view__box"
                overlayClassName="boxed-view boxed-view--modal">
               <h1>Add Link</h1>
               {/* render error if there is an error */}
               {this.state.error ? <p>{this.state.error}</p> : undefined}
                {/* form to get the links from user */}
                <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                {/* The line below is a classic uncontrolled because
                we are not manually setting the value. 
                There is no value prop here telling the input what 
                value shoiuld be put in*/}
                    {/* <input type="text" ref="url" placeholder="URL"/> */}
                {/* The code immediately above doesn't have a value key
            value is used for a text based input. Below is the same code above 
            with a value key 
            As is, because there is no onChange, teh value of the input will
            be read only. Meaning that the user can not change the value of 
            input */}
            {/* <input 
            type="text" 
            ref="url" 
            placeholder="URL" 
            value={this.state.url}
            /> */}
            <input 
            type="text" 
            /* since we are no longer using 
            //this.refs.url.value = ''; we 
            will comment out the ref   */
            //ref="url" 
            placeholder="URL"
            ref="url" 
            value={this.state.url}
            //onChange will take the value that the user typed
            //and then set that to the state
            onChange={this.onChange.bind(this)}
            />
                    <button className="button">Add Link</button>
                <button type="button" className="button button--secondary" onClick={this.handleModalClose.bind(this)}>Cancel</button>
                    
                </form>
                {/* button to close modal */}
               </Modal>
            </div>

        )
    }

}