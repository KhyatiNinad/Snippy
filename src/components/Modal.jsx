import React from "react";
import { Col } from "./bootstrap";
import PropTypes from "prop-types";
import classnames from 'classnames';

class ModalHeader extends React.Component {

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
            <h4 className="title">{this.props.title}</h4>
            <button type="button" className={`close waves-effect waves-light  ${closeClass}`} data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
        );
            }
            }

    class ModalFooter extends React.Component {

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


    export class Modal extends React.Component {

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

        state = { 
            
                displayVal: "none"};

        handleChange = (e) => {
            this.setState({ [`${e.target.name}`]: e.target.value });
};

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.onSubmit) { this.props.onSubmit(this.state); }
};
    showModal(text) {
    this.setState({
    displayVal : "block"
});
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
}
  renderBody = () => {
    if (this.props.children) return this.props.children;
    return (
      <div>
        <Modal.Input name="name" required label="Name" placeholder="Name"/>
        <Modal.Input type="email" required name="email" label="Email" placeholder="Email"/>
        <Modal.Input type="password" required name="password" label="Password" placeholder="Password"/>
      </div>
    );
};

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
              <ModalHeader title={this.props.title} closeClass={modalId}/>
              <form className="form-vertical" onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <div className="modal-body">
    { this.renderBody() }
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

Modal.Input = class extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
    };

    static defaultProps = {
        type: "text",
    };

  render() {
    return (
      <div className="form-group neal-signup-modal-input">
        <label className="sr-only" htmlFor={this.props.name}>{this.props.label}</label>
        <input type="text" className="form-control" name={this.props.name}
          placeholder={this.props.placeholder} {... this.props}/>
      </div>
    );
    }
    };
