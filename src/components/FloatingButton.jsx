import React from 'react';
import { Link } from "react-router-dom";
import classnames from 'classnames';

export class FloatingButton extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClick(e)
    {
        e.preventDefault();
        if(this.props.onMenuClick)
            this.props.onMenuClick();

    }
    render() {
        return (
<div className="menu pmd-floating-action"  role="navigation"> 
	<a className="pmd-floating-action-btn btn pmd-btn-fab pmd-btn-raised pmd-ripple-effect btn-success" 
	data-title={this.props.Text} href="javascript:void(0);" id={this.props.Id} onClick={this.handleClick.bind(this)}> 
		<span className="pmd-floating-hidden">Primary</span>
		<i className="material-icons pmd-sm">{this.props.Icon}</i> 
	</a> 
</div>

               );
    }
}
