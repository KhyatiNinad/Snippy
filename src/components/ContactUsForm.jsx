import React from "react";
import { Container, Row, Col } from "./bootstrap";
import {PropTypes} from "prop-types";

export class ContactUsForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func,
    };

    state = { email: null, user: null , message: null};

    handleChange = (e) => {
        this.setState({ [`${e.target.name}`]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.onSubmit) { this.props.onSubmit(this.state); }
    };

    render() {
        return (

            <Row id="contact" >
              <Col className="form-group" size={["xs-12", "lg-12"]}>
              <div className="section-content">
                <h3 className="section-header">
                  Get in <span className="content-header wow fadeIn " data-wow-delay="0.2s" data-wow-duration="2s"> Touch with us</span>
                </h3>
              </div>
              <div className="contact-section">
                <Container>
            <form onSubmit={this.handleSubmit}>
                    <Row>
              <Col size={["xs-12", "md-6"]}>
                        <div className="form-group">
                          <label htmlFor="userName">Your name</label>
                <input type="text" required className="form-control" name="user" placeholder=""
        onChange={this.handleChange}/>
                        </div>
                      </Col>
              <Col size={["xs-12", "md-6"]}>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail">Email Address</label>
                <input type="email" required className="form-control" name="email" placeholder=""
        onChange={this.handleChange}/>
			  			</div>
                      </Col>
                    </Row>
                    <Row>
              <Col size={["xs-12", "md-12"]}>
                        <div className="form-group">
                          <label htmlFor="description"> Message</label>
                          <textarea  className="form-control" id="message" name="message"  placeholder="" required
                           onChange={this.handleChange}></textarea>
                        </div>
                      </Col>
                    </Row>

                    <Row>
              <Col size={["xs-12", "md-6"]}>

                        <button id="btnContact" type="submit" className="btn btn-primary submit">
                          <i className="fa fa-paper-plane" aria-hidden="true"></i>  Send Message
                        </button>
                      </Col>

                    </Row>
                  </form>
                </Container>
              </div>
            </Col>
          </Row>


      );
    }
}
