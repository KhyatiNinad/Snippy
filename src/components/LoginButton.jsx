import React from 'react';
import { Link } from "react-router-dom";
import classnames from 'classnames';

export class LoginButton extends React.Component {
    propTypes: {
            clickHandler: PropTypes.func.Required
    }
    componentDidMount() {
    }
    myclickHandler(e)
    {
        debugger;
        e.preventDefault();
        if(this.props.clickHandler)
            this.props.clickHandler();
    }
    render() {
        return (
<button className="btn btn-block btn-social btn-facebook" onClick={this.myclickHandler.bind(this)}>
<span className="fa fa-facebook"></span> Sign in with Facebook
                    </button>
               );
    }
}
