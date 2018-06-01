
/*This file is to display a link list item */
//importing Meteor so as to use Meteor.call 
import { Meteor } from 'meteor/meteor';
//import React - needed to run jsx
import React from 'react';
//Because we have to provide a proptype, we are including proptype
import PropTypes from 'prop-types';
//including the clipboard library so as to be 
//able to copy links - copying from the clipboard module just installed
//This clipboard library can be used with 
import Clipboard from 'clipboard';
import moment from 'moment';



//This is called an ES6 component
export default class LinksListItem extends React.Component {
    /*The constructor function is a special function
    that gets called behind the scenes. It is called with all of the arugments
    passed into the instance of the class that is created
    constructor(props)
    */
   constructor(props){
       super(props);
       //add a piece of state to the linkedlistitem component
       this.state = {
           //create a boolean state called justCOpied. Default to false
           justCopied: false

       }
   }

   /* change state of justCopied to true */
   switchJustCopiedToTrue(){
       this.setState({
           justCopied: true
       });
   };
   /* change state of justCopied to false */
   switchJustCopiedToFalse(){
       this.setState({
           justCopied: false
       });
   };
   
   //Dynamically render the button text. When justCopied is true render "Copied" 
   // when it is false render "Copy"
   renderButtonText(){
       //if justCopied is false render button as Copy else render button as true
       if(this.state.justCopied === false){
        return "Copy";
       } else {
        return "Copied";
       }
   }

    /*A lifecycle method will be setup here
    when the component mounts which will 
    allows us to startup the clipboard library
    inside of each individual component.
    componenetDidMount() is a lifecycle method 
    that gets fired when the 
    component first gets rendered*/
    componentDidMount() {
        //here we will initialize clipboard 
        //making sure the copy button click
        //actually does copy the url
        //initializing the clipboard library and 
        //having it reference the ref property in the 
        //button below
        /* storing the new clipboard instance in 
        the variable allows us to attach event listeners */
        /* Prior we used the following line but to clean up 
        the event listener we have to use this.clipboard so 
        we use changed the instance to this.clipboard */
        //const clipboard = new Clipboard(this.refs.copy);
        this.clipboard = new Clipboard(this.refs.copy);

        //attaching the event listener
        /*Takes two arguments - the string 
        event name that you want to listen for
        and what you want to do after the event occurs*/
        
        this.clipboard.on('success', () => {
            //alert('It worked!');
            //on success switch justcopied to true
            this.switchJustCopiedToTrue();
            //console.log(this.state.justCopied);
            //wait a second. via settimeout - Switch justCopied to false
            setTimeout(() => this.switchJustCopiedToFalse(), 1000);
            //console.log(this.state.justCopied);
        }).on('error', () => {
            alert('Unable to copy. Please manually copy the link.');
        })
        /* The line immdeiately above attaches 'on'
        and states that In the case of an error we will
        will alert a message to the screen letting them know 
        that a copy wasn't made*/

    }

    /* componentWillUnmount gets fired before 
    the component gets removed from the screen and 
    is also a good place to clean up - which means 
    to remove the event listener and the 
    clipboard instance so as to freeup resources */
    componentWillUnmount() {
        /*This destroys the clipboard instance */
        this.clipboard.destroy();

    }
    renderStats()
    {
        //to render visit or visits 
        const visitMessage = this.props.visitedCount === 1 ? 'visit' : 'visits';
        //variable to render 'visited 2 hours ago'
        let visitedMessage = null; 

        //condition to update visitedMessage 
        //last visited could be a truthy value and still not be 
        //be accepted by. For example it could be 0
        //hence we use typeof to check that the value is a number which includes zero
        if (typeof this.props.lastVisitedAt === 'number'){
            let momentNow = moment(this.props.lastVisitedAt)
            //console.log(momentNow.fromNow());
            visitedMessage = `(visited ${momentNow.fromNow()})`;
        }
        return <p className="item__message">{this.props.visitedCount} {visitMessage} {visitedMessage}</p>
    }


    render() {
        return(
            //In an ES6 component, render props as follows
            <div className="item">
                <h2>{this.props.url}</h2>
                <p className="item__message">{this.props.shortUrl}</p>
                {/* <p>{this.props.visible.toString()}</p> */}
                {/* dumping the values tot he screen */}
                {/* <p>{this.props.visitedCount} - {this.props.lastVisitedAt}</p> */}
                {/* This is to render the time stat values immediately above */}
                {this.renderStats()}
                {/* opens the link in a new tab */}
                <a className="button button--pill button--link" href={this.props.shortUrl} target="_blank">
                    Visit 
                </a>
                {/* The copy button- we will use
                ref to get the value inside 
                the clipboard library. Also we will provide
                the data-clipboard-text attribute - which is the 
                text we will copy to the clipboard - which is essentially the shorturl*/}
                <button className="button button--pill" ref="copy" data-clipboard-text={this.props.shortUrl}>
                {/* Instead of the this.renderButtonText the line immediately
                below could have been used */}
                {/* {this.state.justCopied ? 'Copied' : 'Copy'} */}
                {this.renderButtonText()}</button>
                {/* if this.props.visible is true, render button text as hide 
                otherwise render button text as unhide */}
                <button className="button button--pill" onClick={() => {
                    /*on clicking the button set the link with
                    the set id to a visibility value. 
                    links.setVisibility takes two arguments */
                    //id of the links to set visibility for - this.props._id 
                    //value to set visibility to this.props.visible(which is flipped with the '!')
                    Meteor.call('links.setVisibility', this.props._id, !this.props.visible)
                }}>
                    {this.props.visible ? 'Hide' : 'Unhide'}
                </button>
                
            </div>

            //In a stateless component, render props like this
            // <div>
            // <h3>{props.url}</h3>
            // <p>{props.shortUrl}</p>
            // </div>
        )

    }
}




LinksListItem.propTypes = {
    //Specifying that it should be a proptype of string 
    //get more information here: https://reactjs.org/docs/typechecking-with-proptypes.html
    _id: PropTypes.string.isRequired, 
    url: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    //specify the newly added visible proptype
    visible: PropTypes.bool.isRequired,
    shortUrl: PropTypes.string.isRequired,
    //proptypes for visitedCount
    visitedCount: PropTypes.number,
    //check lecture 88 for more details 
    lastVisitedAt: PropTypes.number
   

    
};


