//this component is responsible for fetching from database and rendering items
import React from 'react';
//importing Meteor to allow for subscription to links
import { Meteor } from 'meteor/meteor';

import { Tracker } from 'meteor/tracker';
//To run sessions, we are importing the named export session
import { Session } from 'meteor/session';

import { Links } from '../api/links';
import LinkListItem from './LinksListItem'

import FlipMove from 'react-flip-move';

export default class LinkList extends React.Component {
    //setting up a state for LinkList
    //this will be an array which will hold the links to be rendered
    constructor(props) {
        //to maintain the react component functionality
        //we use the super below
        // Super calls the parent's constructor function
        //Super allows us to access the parent's class
        //This means that we don't need to redefine the parent default functions 
        //So the component has access to the parent's constructor
        super(props);
        this.state = {
            //an array of empty links
            //
            links: []
        }
    }

    //THis is a component lifecycle method
    //this compnent is shown right after render -below is shown to the screen
    componentDidMount(){
        console.log('componentDidMount LinkList');
        //Storing the return value from tracker auto run
        //Storing the return value so that we can use it down the line
        this.linksTracker = Tracker.autorun(() => {
            //TO allow for subscrition to publications
            Meteor.subscribe('links'); /*the argument matches the argument provided
            in the publish in the api/links.js file*/

            //fetch all links using find method. The fetch method must be
            //called on the find link
            const links = Links.find({
                //rember that session is reactive
                //if showVisible is true we are going to show visible links
                //if showVisible is false we are going to show jsut the hidden links
                visible: Session.get('showVisible')

            }).fetch();
            /*We are going use a checkbox to show or hide hidden and unhidden links
            to achieve this, we are going to use meteor session package
            it is kind of like local storage that allows us to set storage
            it is a client side management resource. 
            see the documentation for more details here:
             https://docs.meteor.com/api/session.html#Session-set */


            //print links to console using console.log
            //console.log(links);
            //changing this state to whatever the links variable equals
            this.setState({ links });
          })
    }
    //another lifecycle method
    //occurs right before a component goes away/when a component is removed
    //lifecycle method get called automatically
    //Running the componentWillUnmount method, allows for resources to be conserved
    componentWillUnmount() {
        console.log('componentWillUnmount LinkList');
        //We need to stop the tracker autorun call in componentWillUnmount
        //referenceing this.linksTracker. To stop tracker.autorun function use 
        //the stop method from being run again
        this.linksTracker.stop();
    }
    //we must define render
    renderLinksListItems() {
        //if statement - if there are no links in links array
        if(this.state.links.length === 0){
            return (
                <div className="item">
                    <p className="item__status-message">No Links Found</p>
                </div>
            );
        }
        //return some static jsx
        //div p NO links found

        // To render a list of links from the collection
        return this.state.links.map((link) => {
            //LinkListItem will be rendered here
            /*Lets provide the absolute url to this
            component
            */
           //we will pass as an argument the id that we 
           //want to pass to the url
           //THis is the absolute Url
           const shortUrl = Meteor.absoluteUrl(link._id);
            /*Because the following line 
            //return <p key ={link._id}>{link.url}</p>
            is not scalable
            we are going to create a link list item and 
            link list item components. In it we are going to pass
            the link id as a prop. Additionally we are going
            to pass everything on the link argument above. There 
            are two ways to achieve this
            The first is to pass link list as an object 
            with the properties and values or you can pass
            all the individual props. We are going to use the 
            latter method
            To do this we are going to use the spread operator
            {...link}. THis is going to take very key value pair
            on the link object and sending them as props. In this
            case, 3 properties will be passed to the _id, the url
            and the user id*/ 
            //We also pass the shortUrl variable as a prop to the component
            return <LinkListItem key={link._id} shortUrl={shortUrl} {...link}/>
        })
        
        
        // You will need to use map to render links
        //you will add the url property inside here
        
    }
    render() {
        //returning jsx
        return (
            <div>
                {/* getting the array of links onto the screen */}
                <div>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderLinksListItems()}
                </FlipMove>
                    
                </div>
            </div>
        )
    }
}