//import the named export mongo
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema  from 'simpl-schema';
//importing short id so as to shorten the _ids of the links in the database
import shortid from 'shortid';

//creating the new collection
//to access the return result, we make the new collection 
//a const
export const Links = new Mongo.Collection('links');

//Creating a subscription - 
//creating a publication requires Meteor.publish and as a result we need to import meteor
 //while this file runs on the the client and server
// Meteor.publish method is only runs on the server so to ensure that it runs only on the server
//thus we use Meteor.isServer
if (Meteor.isServer) {
    //if the code is running in the server create a publication
    //Meteor.publish takes two arguments - a string name and a function - the function determines
    //what data the client should have access to
    //'links' here doesn't refer to the links publication
    //creates a subset of the link's collection. Creates publication
    //we are not using an arrow function here
    // because we need access to the this binding which is not available in arrow functions
    //publish allows us to read data
    Meteor.publish('links', function () { 
        //to access the currently logged in user in a publish function
        //will be set to undefined if the current user is not logged in
        //allow the user to see links created by any other user
        //we must first query for the data to be shown using Links.find
        //to expose the data we use return
        return Links.find({userId: this.userId});
        
    }); 
}

//Methods allow us to create, update and destroy data
//To define methods, we use Meteor.methods - which takes one argument
Meteor.methods({
    //below are sample methods greetUser and addNumbers
    //the methods are called in the main.js files on the client and server
    //the key is the method name and it has to be unique
    //we are using the es5 because we need access to the this binding
    //taking advantage of the es6 object syntax
    //Meteor methods also takes arguments as in the name argument below
    //User was the fallback or default value
    // greetUser(name) {
    //     console.log('greetUser is running');
    //     //data inserted would have to be ascertained to be valid
    //     //to throw up an error if the data inserted is not valid
    //     //The error by the way shows up in the console. 
    //     //Below is an error that will be thrown up if no name 
    //     //provided
    //     if (!name) {
    //         //throw a new error
    //         //takes two arguments - the error code and the reason
    //         //the error is thrown on both the client and the server
    //         throw new Meteor.Error('invalid-arguments', 'Name is required');
    //     };
        

    //     return `Hello ${name}!`;
    // },
    
    // addNumbers(num1, num2){
    //     console.log('addNumbers is running')
    //     if((typeof num1 === 'number') && (typeof num2 === 'number') ){
    //         return num1 + num2;
    //     }
    //     else {
    //         throw new Meteor.Error('invalid-number', 'Number is required');
    //     }
    // }


    /* There is a naming convention for methods
    it is 'resource.action' - where resource is the resource and action
    is the action to be carried out on the resource
    for example to archive emails the following would follow the naming
    convention
    emails.archive
    links.insert*/
    //The dot property is not usually allowed on an objects property name
    //to bypass that, we wrapping the property name inside of quotes
    //as follows 'links.insert'
    //insert a link into the database
    'links.insert'(url) {
        //make sure that a user is logged in
        if (!this.userId){
            throw new Meteor.Error('not-authorized');
        }

        //it is always important to validate data passed to the database
        //so before inserting the links to the database
        //we are going to validate the link
        //validating using Simpl-schema 
        //it is thus necessary to import
        //https://github.com/aldeed/simple-schema-js
       
        new SimpleSchema({
            url: {
                type: String,
                /*Problem: the error returned if the link is not valid
                sits as Url must be valid Url. It is possible to change the 
                first Url portion by creating a 'label' property*/
                label: 'Your link',
                regEx: SimpleSchema.RegEx.Url
            }
        }).validate({ url })
        
        //insert the links
        Links.insert({
            //we are going to provide an id. When ids are provided, meteor doesn't override them
            //this uses the shortid package
            _id: shortid.generate(), 
            //using the es6 property shorthand
            url, //insert the url
            userId: this.userId, //insert the userId
            /*adding the new visible property
            giving new links the visible property by default */
            visible: true,
            visitedCount: 0,
            lastVisitedAt: null
        });
    },
    /*links.setVisibility sets the visibiolity of the link
    it takes 2 variables _id and visible */
    'links.setVisibility'(_id, visible) {
        //check if user is logged in. Throw an error if not.
        //refer to !this.userId above
        if(!this.userId){
            throw new Meteor.Error('not-authorized');
        }

        //validate that _id is a string with a length greater than 1
        new SimpleSchema({
            _id: {
                 type: String,
                 min: 1
            },
             //validate that visible is a boolean - check out Simplschema documentation
            visible: {
                type: Boolean
            }
            //validate where _id equals the _id argument passed above and the visible arguement passed above
        }).validate({ _id, visible })
        //once you know that the user is logged in and have validated the data the
        //user is trying to plug in
        //Link.update - where _id and this.userId match the doc
        //make sure that you are updating a link where _id and userId match
        Links.update({
           // _id: _id,
           //we will use the ES6 property shorthand which achieves the same result as the line immediately above
           _id,
            userId: this.userId
        },
        {
             //set the visible property to the visible argument
            $set: {
                //using the ES6 shorthand
                visible }
        })
        
    },
    'links.trackVisit'(_id) {
        //validating the id using simpleSchema
        //validate that _id is a string with a length greater than 1
        new SimpleSchema({
            _id: {
                 type: String,
                 min: 1
            }
            //validate where _id equals the _id argument passed above 
        }).validate({ _id });

        //updating the links document ie the link that got visited
        //where _id, the argument equals the _id document - the id in the database
        
        //Links.update({_id: _id}, {})
        //using ES6 format
        Links.update({ _id }, {
            $set: {
                //using the new Date construction function
                //the method getTime returns a numeric time stamp
                //it will return the number of milliseconds -
                //values greater than zero take place after the unix epic
                //values less than zero take place before the unix epic
                lastVisitedAt: new Date().getTime()
            },
            //inc stands for increment and allows to change a numeric property
            //without knowing what the previous value was
            $inc: {
                //the value you want to increment and the amount you want to
                //increment it by
                //to decrement, use negative numbers
                visitedCount: 1
            }
        })
    }

})


//we use Meteor.
