//This file shows the filtered lists
import React from 'react';

//importing Session so as to change session.get
import { Session } from 'meteor/session';

//to use tracker, we must import tracker
import { Tracker } from 'meteor/tracker';

/* We will need to use lifecycle methods so we will be
switching from an arrow function (in the commented out) 
code below to an ES6 class component  */
export default class LinkListFilters extends React.Component {
    //needed because we will be maintaining a state
    constructor(props) {
        super(props);
        this.state = {
            showVisible: true
        };

    }
    componentWillMount() {
        //set up a tracker autorun call to watch for changes to show visible
        //when show visible changes we want to change the state
        console.log('componentDidMount LinkListFilter');
        this.tracker = Tracker.autorun(() => {
            this.setState({
                showVisible: Session.get('showVisible')
            })
        });
    }
    componentWillUnmount() {
        //down here we will cancel the tracker autorun call
        console.log('componentWillUnmount LinkListFilter');
        this.tracker.stop();

    }
    render() {
        return (
            <div>
                <label className="checkbox">
                    {/* We next the checkbox in the label so as
                    enable the label to be clicked as well as the checkbox */}
                    {/* the onchange allows us to do something when the value changes */}
                    {/* e refers to the event */}
                    {/* We will use checked and set it to !this.state.showVisible 
                    if show visible is true we don't want to check the box*/}
                    <input className="checkbox__box" type="checkbox" checked={!this.state.showVisible} onChange={(e) => {
                        //this returns a boolean as to 
                        //true if it is checked 
                        //false if it isn't checked.
                        //console.log(e.target.checked);
                        /*need to import session
                        need to use session.set to set the value
                        of showVisible
                        when the box is checked we want to show
                        the invisible link*/
                       Session.set('showVisible', !e.target.checked);
    
    
                    
    
                    }}/>
                    show hidden links
                </label>
            </div>
        );

    }

}

/* We are using a stateless component 
commenting this out in preference for the code above*/
// export default () => {
//     return (
//         <div>
//             <label>
//                 {/* We next the checkbox in the label so as
//                 enable the label to be clicked as well as the checkbox */}
//                 {/* the onchange allows us to do something when the value changes */}
//                 {/* e refers to the event */}
//                 <input type="checkbox" onChange={(e) => {
//                     //this returns a boolean as to 
//                     //true if it is checked 
//                     //false if it isn't checked.
//                     //console.log(e.target.checked);
//                     /*need to import session
//                     need to use session.set to set the value
//                     of showVisible
//                     when the box is checked we want to show
//                     the invisible link*/
//                    Session.set('showVisible', !e.target.checked);


                

//                 }}/>
//                 show hidden links
//             </label>
//         </div>
//     );
// };