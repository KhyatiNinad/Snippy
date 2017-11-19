import React from "react";
import { Col } from "./bootstrap";
import PropTypes from "prop-types";
import classnames from 'classnames';


export class Loader extends React.Component {


        state = { 
            
                displayVal: "none"};

show() {
    this.setState({
    displayVal : "block"
});
}

hide() {
    this.setState({
        displayVal : "none"
    });
}

  render() {
const style = {
    display: this.state.display
}
    return (
     <div className="cssload-loader-outer" id="loading"  aria-hidden="true" style={{display: `${ this.state.displayVal }`}}>
         <div className="windows8">
             <div className="wBall" id="wBall_1">
                 <div className="wInnerBall"></div>
             </div>
             <div className="wBall" id="wBall_2">
                 <div className="wInnerBall"></div>
             </div>
             <div className="wBall" id="wBall_3">
                 <div className="wInnerBall"></div>
             </div>
             <div className="wBall" id="wBall_4">
                 <div className="wInnerBall"></div>
             </div>
             <div className="wBall" id="wBall_5">
                 <div className="wInnerBall"></div>
             </div>
         </div>
     </div>

    );
    }

    }

