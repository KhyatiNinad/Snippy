import React from 'react';
import { Link } from "react-router-dom";
import classnames from 'classnames';

class SocialButton extends React.Component {

    render() {
        return (
<Link className="btn btn-block btn-social btn-facebook" to="">
<span className="fa fa-facebook"></span> Logout
                    </Link>
               );
    }
}

export default SocialButton;