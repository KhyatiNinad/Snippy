import React from "react";
import { Container, Row, Col } from "./bootstrap";
import {PropTypes} from "prop-types";
import Collapsible from 'react-collapsible';
import { WithContext as ReactTags } from 'react-tag-input';

import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import ClipboardButton from 'react-clipboard.js';
 
import 'brace/mode/java';
import 'brace/theme/tomorrow';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/markdown';
import 'brace/mode/csharp';

export class Snippet extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func,
    };

    
    constructor(props) {
        super(props);
        var tagArr = [];

        if(props.tags)
        {
            var tags = props.tags.split(",");
            for(var i = 0 ; i < tags.length ; i++)
                tagArr.push({ id: i, text: tags[i]});
            
        }
        this.state = { email: null, user: null , message: null, tags: tagArr};
    }

    

    handleChange = (e) => {
        this.setState({ [`${e.target.name}`]: e.target.value });
    };

    DeleteSnippet = (e) => {
        e.preventDefault();
        if (this.props.DeleteSnippet) { this.props.DeleteSnippet(this.props); }
    };
    EditSnippet = (e) => {
        e.preventDefault();
        if (this.props.EditSnippet) { this.props.EditSnippet(this.props); }
    };

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    };
 
    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    };
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
        this.setState({ tags: tags });
    };
    onClipSuccess(e)
    {
        var mess = e.trigger.parentNode.getElementsByClassName("message")[0];
        this.addClass(mess, 'copied');
        setTimeout(function () { this.removeClass(mess,'copied'); }.bind(this), 1500);
    }

    
    hasClass(el, className) {
        if(el) {
            if (el.classList)
                return el.classList.contains(className)
            else
                return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
        return false;
    };

    addClass(el, className) {
        if(el) {
            if (el.classList)
                el.classList.add(className)
            else if (!this.hasClass(el, className)) el.className += " " + className;
        }
    };
    toggleClass(el, className)
    {
        if(el) {
            if(this.hasClass(el, className))
                this.removeClass(el, className);
            else
                this.addClass(el, className);
        }
    }
    removeClass(el, className) {
        if(el) {
            if (el.classList)
                el.classList.remove(className)
            else if (this.hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
                el.className=el.className.replace(reg, ' ')
            }
        }
    };

    render() {

        let DeleteBtn = <div></div>;
        if(this.props.allowDelete) {
            DeleteBtn = 
            <div className="">
                <button className="btn btn-danger pull-right" onClick={this.DeleteSnippet.bind(this)}>Delete</button>
                <button id="contributeEdit" className="btn btn-success pull-right" onClick={this.EditSnippet.bind(this)} >Edit</button>
            </div>
        }
        return (
               <Collapsible  className="accordion-header" openedClassName ="accordion-header" trigger={this.props.title} >
              <Col className="form-group" size={["xs-12", "lg-12"]}>
              <div>
                <input id={"id" + this.props.id} name={"id" + this.props.id} className="id" type="hidden" value={this.props.id}/>
                  <input id={"title" + this.props.id} name={"title" + this.props.id} className="id" type="hidden" value={this.props.title}/>
                    <div className="group">
                      <div >
                        <label className="single">
                          <b>Code</b>
                        </label>
                        <div >
                          <div className="message" ></div>
<ClipboardButton data-clipboard-text={this.props.text} className="clipboardbtn btn btn-info pull-right"  onSuccess={this.onClipSuccess.bind(this)}>
        Copy To Clipboard
      </ClipboardButton>
        </div>
                      </div>
                      <div className="editorparent">
                        <div id={"editor" + this.props.id} className="editor">
                            <AceEditor
                        mode="javascript"
                        theme="tomorrow"
                        name="code"
                        fontSize={16}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={this.props.text}
                        readonly={true}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}/>
                            </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="single">
                        <b>Information: </b>
                      </label>
        <div className="editorparent">
          <div id={"lesson" + this.props.id} className="editor ace-tomorrow">
        {this.props.lesson}
                    </div>
                    </div>

                    </div>
                    <br />
                    <div className="group">
                        <label className="single">
                          <b>Tags</b>
                        </label>
<ReactTags tags={this.state.tags}
                        suggestions={[]}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} 
                    readOnly={true}/>
                                              </div>
                    <div className="group">
                      <label className="single">
                        <b>Contributed By: </b>{this.props.user}
                      </label>
                    </div>
                    <br />
                    <div className="group">
                      <label className="single">
                        <b>Contributed On: </b>{this.props.date}
                      </label>
                    </div>
                        {DeleteBtn}
                  </div>
          </Col>

        <div className="clearfix"></div>
      </Collapsible>



      );
    }
}
