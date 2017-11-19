// src/components/App/index.js
import React, { Component } from 'react';


import { Link, Redirect } from "react-router-dom";
import classnames from 'classnames';

import '../../static/assets/css/bootstrap.min.css';
import '../../static/assets/css/material-kit.css';
import '../../static/assets/css/style.css';
import '../../static/assets/css/font-awesome.min.css';
import '../../static/assets/css/roboto.css';
import '../../static/assets/css/bootstrap-social.css';

import { Navbar, NavItem } from "../navbar";
import { Footer} from "../footer";
import {FacebookComponent} from "../FacebookComponent";
import { Wrapper, Container, Row, Col } from "../bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {ContactUsForm } from "../ContactUsForm";
import {Modal } from "../Modal";


const appName = "Snippy";
const devName = "Khyati Ninad Majmudar";

class App extends Component {
    // static propTypes = {}
    // static defaultProps = {}
    state = {
        redirect: false
    }
    componentDidMount() {

        var formControls = document.getElementsByClassName("form-control");
        for(var i = 0 ; i < formControls.length ; i++)
        {
            formControls[i].onfocus = this.addFocusClass.bind(this);

            formControls[i].onblur = this.removeFocusClass.bind(this);
        }

        var links = document.getElementsByTagName("a");
        for(var i = 0 ; i < links.length ; i ++)
        {
            if(links[i].href.indexOf("#") >= 0)
            {
                if (
  window.location.pathname.replace(/^\//, '') == links[i].pathname.replace(/^\//, '') 
  && 
  window.location.hostname == links[i].hostname
) {
                    // Figure out element to scroll to
                    var target = document.getElementById(links[i].href.slice(links[i].href.indexOf("#") + 1));
                    // Does a scroll target exist?
                    if (target) {
                        links[i].onclick = function(e)  {
                            function findPos(obj) {
                                var curtop = 0;
                                if (obj.offsetParent) {
                                    do {
                                        curtop += obj.offsetTop;
                                    } while (obj = obj.offsetParent);
                                    return [curtop];
                                }
                            };
                            var target = document.getElementById(this.href.slice(this.href.indexOf("#") + 1));

                            var i = 10;
                            var finalPos = findPos(target);
                            var currentPos = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
                            if(currentPos > finalPos) {
                                i = currentPos - 10;
                            }
                            var int = setInterval(function() {
                                var finalPos = findPos(target);
                                window.scrollTo(0, i);
                                var currentPos = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
                                if(currentPos < finalPos) {
                                    i += 10;
                                    if (i >= finalPos) clearInterval(int);
                                }
                                else
                                {
                                    i -= 10;
                                    if (i <= finalPos) clearInterval(int);
                                }
                            }, 20);
                            // Only prevent default if animation is actually gonna happen
                            //window.scroll(0,findPos(target));
                        }

                    }
                }
            }
        }

    };
    onSubmit(e)
    {
        this.modal.showModal();
    }
    onLogin(response)
    {
        debugger;
        if(response.authResponse)
        {
            this.setState({
                redirect: true
            });
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
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    };

    addClass(el, className) {
        if (el.classList)
            el.classList.add(className)
        else if (!this.hasClass(el, className)) el.className += " " + className
    };

    removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    };


    render() {
        const { className, ...props } = this.props;
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/snippy'/>;
        }

        return (
          <div className={classnames('profile-page', className)} >
        <Navbar AppName={appName}>
            <NavItem><Link to="#about"><i className="fa fa-info-circle"></i> About</Link></NavItem>
            <NavItem><Link to="#feature"><i className="fa fa-tasks"></i> Features</Link></NavItem>
            <NavItem><Link to="#contact"><i className="fa fa-envelope"></i>Contact Us</Link></NavItem>
        </Navbar>

  <Wrapper className="wrapper" id="about">

    <Wrapper className="header header-filter parallax">
      <Wrapper className="top">
        <Wrapper className="main main-raised top-main " >
          <Wrapper className="profile-content ">

             <Container>
              <Row>
            <Col size={["xs-12", "md-8", "sm-12"]} className="ProfileHeading">
                  Snippy - Snippy is your <b>Code Snippet Manager</b> for your <b>Team</b>,
                  which manages Code Snippets and Internal Team Learning for your team in a secure manner and with an easy to search interface.<br/>
                  <br/>Get the Right piece of Code, at the right time.
                </Col><Col size={["xs-12", "md-4", "sm-12"]} className="vcenter text-center">
                  <Wrapper className="btn-group">
                  <FacebookComponent onLogin={this.onLogin.bind(this)}/>

                  </Wrapper>
                </Col>
              </Row>
            </Container>
          </Wrapper>
        </Wrapper>
      </Wrapper>
     </Wrapper>
    
    <Wrapper className="main main-raised">
      <Wrapper className="profile-content">
        <Container>
            <Row id="feature">
            <Wrapper className="profile">
              <Wrapper className="avatar">
              </Wrapper>
              <Wrapper className="name">
                <h3 className="title">{appName}</h3>
                <h6>Coding Collaboration Made Easy!</h6>
              </Wrapper>
            </Wrapper>
          </Row>

          <Row>
            <Col size={["md-10", "md-offset-1"]} >
              <Wrapper className="profile-tabs">
                <Wrapper className="nav-align-center">

        <Tabs>
    <TabList className="nav nav-pills" >
      <Tab >
      <Link to="">
      <i className="fa fa-code"></i>
                        Code Snippet Manager
                        </Link>
                        </Tab>
      <Tab>      <Link to="">
<i className="fa fa-user-secret"></i>
                        Private and Secure</Link></Tab>
      <Tab>      <Link to="">
<i className="fa fa-search"></i>
      Powerful Search</Link></Tab>
    </TabList>

    <TabPanel>
    <br/>
    <br/>
                    <Wrapper className="tab-pane active">
                      <Row>
                        <Col size={["md-6"]}>
                          Snippy is your Code Snippet Manager for your Team, 
                          which manages Code Snippets and Internal Learnings for your team in a secure manner and with an easy to search interface. 
                          <br/><br/>
As a team member, you can contribute by creating Code Snippets to the repository. <br/><br/>
Snippy provides an Editor to write your code in, with in-built language syntax highlighting of your choice.
                        </Col>
                        <Col size={["md-6"]}>
                          <img src={require("../../static/assets/img/examples/code.png")} className="img-responsive img-main" />
                        </Col>
                      </Row>
                    </Wrapper>
    <br/>
    <br/>
    </TabPanel>
    <TabPanel>
    <br/>
    <br/>
                    <Wrapper className="tab-pane active" >
                      <Row>
                        <Col size={["md-6"]}>
                          Safe and Secure. As an Admin, Host Snippy and Developers can Register with your Site. <br/><br/>
                          Admin can then, choose whom to allow, or send Invite for registration. And through secure Integrated Facebook Login, your code base remains secure within your community.
                        </Col>
                        <Col size={["md-6"]}>
                          <img src={require("../../static/assets/img/examples/private.png")} className="img-responsive img-main" />
                        </Col>
                      </Row>
                    </Wrapper>
    <br/>
    <br/>
    </TabPanel>
    <TabPanel>
    <br/>
    <br/>
                    <Wrapper className="tab-pane active" >
                      <Row>
                        <Col size={["md-6"]}>
                          Your team members can easily search for Code Snippets through a powerful tag and full text search based search engine, and use them in their modules.
<br/><br/>That's how coding gets easier...!
                        </Col>
                        <Col size={["md-6"]}>
                          <img src={require("../../static/assets/img/examples/search.png")} className="img-responsive img-main" />
                        </Col>
                      </Row>
                    </Wrapper>
    <br/>
    <br/>
    </TabPanel>
  </Tabs>
                </Wrapper>
              </Wrapper>
            </Col>
          </Row>



        </Container>
       </Wrapper>
                 <ContactUsForm onSubmit={this.onSubmit.bind(this)}/>
    </Wrapper>

    </Wrapper>
    <Footer brandName={devName}>
        </Footer>


        <Modal title="Snippy" modalId="ContactModal" openModalId="openModalId"  ref={modal => this.modal = modal} >
                             <div className="group md-form form-sm">
Thanks. We will get in touch with you soon!</div>

    
                    <div className="text-center mt-2">
 <button type="button" className="btn btn-outline-info waves-effect ml-auto ContactModalclose" data-dismiss="modal">Close</button>

                    </div>

        </Modal>
      </div>
    );
                          }
}

export default App;