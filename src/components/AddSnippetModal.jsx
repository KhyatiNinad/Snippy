import React from "react";
import { Col } from "./bootstrap";
import PropTypes from "prop-types";
import classnames from 'classnames';
import { WithContext as ReactTags } from 'react-tag-input';
 
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
 
import 'brace/mode/java';
import 'brace/theme/tomorrow';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/markdown';
import 'brace/mode/csharp';


class AddSnippetModalHeader extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    static defaultProps = {
        title: "Sign up",
        closeClass: "close"
    };

    render() {
        const closeClass = this.props.closeClass + "close";

        return (
          <div className="modal-header  light-blue darken-3 white-text">
            <h4 className="title"><i className={this.props.icon}></i>{this.props.title}</h4>
            <button type="button" className={`close waves-effect waves-light  ${closeClass}`} data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
        );
            }
            }

    class AddSnippetModalFooter extends React.Component {

    static propTypes = {
                buttonText: PropTypes.string.isRequired,
            };

    static defaultProps = {
                buttonText: "Sign up",
            };

      render() {
        return (
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary btn-block btn-ghost">{this.props.buttonText}</button>
          </div>
        );
            }
            }


    export class AddSnippetModal extends React.Component {

    static propTypes = {
                title: PropTypes.string.isRequired,
                buttonText: PropTypes.string.isRequired,
                modalId: PropTypes.string.isRequired,
                openModalId: PropTypes.string.isRequired,
                onSubmit: PropTypes.func,
            };

    static defaultProps = {
                title: "Sign up",
                buttonText: "Sign up",
                modalId: "signup-modal",
                openModalId: "openId"
            };

                constructor(props) {
        super(props);
 
        this.state = {
                tags: [{id: 1, text: "Apples"}],
                suggestions: [],
                code: "",
                title: "",
                isNew: 0,
                displayVal: "none",
                id: 0
            };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
            }
        handleChange = (e) => {
            this.setState({ [`${e.target.name}`]: e.target.value });
};

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.onSubmit) { this.props.onSubmit(this.state); }
};
    showModal(text) {
    this.setState({
    tags: [],
    suggestions: [],
    code: "",
    lesson: "",
    title: "",
    isNew: 0,
    id: 0,
    errorMsg: "",
    displayVal : "block"
});
}

        showModalForEdit(e) {
    var tagArr = [];

     var tags = e.tags.split(",");
     for(var i = 0 ; i < tags.length ; i++)
    if(tags[i].length > 0)
       tagArr.push({ id: i, text: tags[i]});

    this.setState({
    tags: tagArr,
    suggestions: [],
    code: e.text,
    title: e.title,
    lesson: e.lesson,
    isNew: 1,
    id: e.id,
    errorMsg: "",
    displayVal : "block"
});
    var labels = document.getElementsByClassName("AddSnippetModalClass")[0].getElementsByTagName("label");
     for(var i = 0 ; i < tags.length ; i++)
    this.addClass(labels[i], "active");
    

}

    onChange(e)
{
    this.setState({code: e});
}
    componentDidMount() {

    const modalId = this.props.modalId;
    const openmodalId = this.props.openModalId;
    var modal = document.getElementById(modalId);

    // Get the button that opens the modal
    var btn = document.getElementById(openmodalId);
    var span = document.getElementsByClassName(modalId + "close");
    // Get the <span> element that closes the modal
    for(var i = 0 ; i < span.length ; i++){
    // When the user clicks on <span> (x), close the modal
    span[i].onclick = function() {
    this.setState( {
    displayVal: "none"
});

}.bind(this);

}
    if(btn)
    // When the user clicks on the button, open the modal 
    btn.onclick = function() {
    this.setState( {
    displayVal: "block"
});
}.bind(this);


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    debugger;
        if (event.target == modal) {
    this.setState( {
    displayVal: "none"
});
}
}.bind(this);

    this.addClass(document.getElementsByClassName("ReactTags__tagInputField")[0], "form-control");
var formControls = document.getElementsByClassName("form-control");
for(var i = 0 ; i < formControls.length ; i++)
{
    formControls[i].onfocus = this.addFocusClass.bind(this);

    formControls[i].onblur = this.removeFocusClass.bind(this);
    formControls[i].onkeyup = this.changeLabel.bind(this);
    formControls[i].onchange = this.changeLabel.bind(this);
}


}

    changeLabel(e)
{
    var label = e.currentTarget.parentNode.parentNode.querySelector('label');
                if (e.currentTarget.value.length > 0) {
                    this.addClass(label, "active");
}
else {
                    this.removeClass(label, "active");

}


}

        addFocusClass(e)
{
        this.addClass(e.currentTarget.parentNode,"is-focused");
}
    removeFocusClass(e)
{
        this.removeClass(e.currentTarget.parentNode,"is-focused");
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
 

  renderBody = () => {
    if (this.props.children) return this.props.children;
    const { tags, suggestions } = this.state;
    return (
      <div className="AddSnippetModalClass">
    <div className="row">
                 <div className="col-sm-12">
        <AddSnippetModal.Input name="title" required label="Snippet Title" value={this.state.title}/>
    </div>
    </div>
    <div className="row">
                 <div className="col-sm-6">
                 <div className="group  form-sm">
                     <label className="single">Code</label>
                     <div className="editorparent">
                         <div id="editor" className="editor">
<AceEditor
  mode="javascript"
  theme="tomorrow"
  name="code"
  onLoad={this.onLoad}
  onChange={this.onChange.bind(this)}
  fontSize={16}
  showPrintMargin={true}
  showGutter={true}
  highlightActiveLine={true}
  value={this.state.code}
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
    </div>

                 <div className="col-sm-6">

                 <div className="group  form-sm">
                     <label className="single">Information</label>
                     <div className="editorparent">
                         <div id="editor" className="editor">
    <textarea name="lesson" id="lesson" className="lesson"  value={this.state.lesson}></textarea>

    </div>
    </div>
    </div>


    </div>
    </div>
    <div className="row">
                     <div className="col-sm-12">

          <div className="group md-form form-sm">
      <div className="form-group">

<ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
    </div>
    </div>
    </div>
    </div>
    </div>
    );
};

    handleSave(e)
{
    this.setState({"errorMsg": ""});
    var isNew = this.state.isNew;
                var tags = this.state.tags;
            var text = this.state.code;
            var title = this.state.title;
    
            var lesson = this.state.lesson;
            if (title.length == 0) {
                this.setState({errorMsg: "Error: Please enter Snippet Title to Proceed"});
                return false;
}
            if (text.length == 0) {
                this.setState({errorMsg: "Error: Please enter Your Code Snippet to Proceed"});
                return false;
}
            if (text.replace(/ /g, '').length == 0) {
                this.setState({errorMsg: "Error: Please enter Your Code Snippet to Proceed"});
                return false;
}
            if (tags == null) {
                this.setState({errorMsg: "Error: Please enter Tags to Proceed"});
                return false;
}
            if (tags.length == 0) {
                this.setState({errorMsg: "Error: Please enter Tags to Proceed"});
                return false;
}

this.setState({displayVal: "none"});

    if(this.props.onSaveSnippet)
{
    var tagArr = [];
    for(var i = 0 ; i < tags.length ; i++)
    tagArr.push(tags[i].text);
    this.props.onSaveSnippet({title: title, text: text, lesson: lesson, tags: tagArr, isNew: isNew, id: this.state.id});
}
}

  render() {
    const modalId = this.props.modalId;
const style = {
    display: this.state.display
}
    return (
      <div>
      <div>
    <div className="modal-backdrop fade in"  aria-hidden="true" style={{display: `${ this.state.displayVal }`}}></div>
        <div className="modal fade in" key={modalId} id={modalId}
        tabIndex="-1" role="dialog" aria-hidden="true" style={{display: `${ this.state.displayVal }`}}>
          <div className="modal-dialog cascading-modal" role="document">
            <div className="modal-content">
              <AddSnippetModalHeader title={this.props.title} closeClass={modalId} icon={this.props.icon}/>
              <form className="form-vertical" onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <div className="modal-body">
    { this.renderBody() }
                     <div className="errorDiv">
                     <div id="newError" className="errorMessage">{this.state.errorMsg}</div>
                 </div>

                    <div className="text-center mt-2">
                 <button id="contributeSave" className="btn btn-info" onClick={this.handleSave.bind(this)}><i className="fa fa-save ml-1"></i> &nbsp;Save</button>
 <button type="button" className="btn btn-outline-info waves-effect ml-auto AddModalclose" data-dismiss="modal">Close</button>

                    </div>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
    }

    }

AddSnippetModal.Input = class extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    };

    static defaultProps = {
        type: "text",
    };

  render() {
    return (
      <div className="group md-form form-sm">
      <div className="form-group">
      <input name={this.props.name} id={this.props.name} type="text"  className="form-control"
    {... this.props}/> </div>
    <label htmlFor={this.props.name} className="">{this.props.label}</label>
                 </div>
    );
    }
    };
