import React from 'react';
import ReactDOM from 'react-dom';
import classNames from "classnames";
import { Link, Redirect } from "react-router-dom";
import { Container, Row, Col } from "./bootstrap";
import { Snippet } from "./Snippet";

export class SnippetList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { list : []};
    }

    UpdateList(l)
    {
        this.setState({list: l});
    }

    componentDidMount() {
    };

    componentWillUnmount() {
    };
    
    DeleteSnippet(e){
        if (this.props.DeleteSnippet) { this.props.DeleteSnippet(e); }
    };
    EditSnippet(e){
        if (this.props.EditSnippet) { this.props.EditSnippet(e); }
    };

    render() {
        
        return (
<div>

        {this.props.list.map(function(l, i){
            return <Snippet key={i} 
            id={l.id}
            text={l.text}
            title={l.title}
            lesson={l.lesson}
            user={l.user}
            date={l.date}
            tags={l.tags}
            EditSnippet={this.EditSnippet.bind(this)}
            DeleteSnippet={this.DeleteSnippet.bind(this)}
            allowDelete={this.props.allowDelete}
                > 
                </Snippet>;
        }.bind(this))}
    </div>
    );
}
}

