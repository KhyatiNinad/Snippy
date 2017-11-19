// src/components/Snippy/index.js
import React, { Component } from 'react';


import { Link, Redirect } from "react-router-dom";
import { Navbar, NavItem } from "../navbar";
import {SnippyNavbar} from "../SnippyNavbar";
import { Footer} from "../footer";
import {FacebookComponent} from "../FacebookComponent";
import { Wrapper, Container, Row, Col } from "../bootstrap";
import {Modal } from "../Modal";
import {AddSnippetModal } from "../AddSnippetModal";
import { Sidebar } from "../sidebar";
import { FloatingButton } from "../FloatingButton";
import { Snippet } from "../Snippet";
import { SnippetList } from "../SnippetList";
import {Loader} from "../Loader";
import {Dashboard} from "../Dashboard";

import classnames from 'classnames';
import request from 'superagent';
import jsonQuery from 'json-query';

import '../../static/assets/css/bootstrap.min.css';
import '../../static/assets/css/material-dashboard.css';
import '../../static/assets/css/font-awesome.min.css';
import '../../static/assets/css/roboto.css';
import '../../static/assets/css/bootstrap-social.css';
import '../../static/assets/css/jquery.tagit.css';
import '../../static/assets/css/tagit.ui-zendesk.css';
import '../../static/assets/css/loader.css';
import '../../static/assets/css/woco-accordion.css';
//import './react-accessible-accordion.css';
import '../../static/assets/css/style.css';


import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';





const appName = "Snippy";
const devName = "Khyati Ninad Majmudar";
const appId = '1580224302045363';


export default class Snippy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn : false,
            count: 0,
            currentScreen: "Dashboard",
            errorMsg: "",
            photo: "",
            list: [],
            data: [],
            users: 0,
            snippets: 0
        };
    }

    

    loadFbLoginApi() {

        window.fbAsyncInit = function() {
            window.FB.init({
                appId      : appId,
                status: true,
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.9' // use version 2.1
            });
            window.FB.Event.subscribe('auth.statusChange', function(response) {
                if(response.status == 'connected') {
                    window.FB.api('/me', {  fields: 'id,picture,email,name' },
          function(response) {
              //alert(JSON.stringify(response));
              console.log(response.eamail);
              console.log(response.name);
              this.setState(response);
              this.setState({currentUserId: response.id, currentUser: response.name });
              if(response.picture)
              {
                  if(response.picture.data)
                  {
                      if(response.picture.data.url)
                      {
                          this.setState({photo: response.picture.data.url })
                      }
                  }
              }

              this.PostAjaxDataToApp("/addUser", response, function (results) {
                  this.loader.hide();
                  if(results)
                      if(results.body)
                          this.setState({users: results.body.user, snippets: results.body.snippet});
              }.bind(this),
function (e) {
    debugger;
}.bind(this)).bind(this);


          }.bind(this)
        );

                }
                else
                {
                    this.loader.hide();
                    this.props.history.push("/")
                }

            }.bind(this));
        }.bind(this);

        console.log("Loading fb api");
        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            
        }(document, 'script', 'facebook-jssdk'));
    }

    componentDidMount() {
        this.loader.show();

        this.loadFbLoginApi();
        var formControls = document.getElementsByClassName("form-control");
        for(var i = 0 ; i < formControls.length ; i++)
        {
            formControls[i].onfocus = this.addFocusClass.bind(this);

            formControls[i].onblur = this.removeFocusClass.bind(this);
        }

        var toggle = document.getElementById("sidebarCollapse");
            toggle.onclick = this.toggleNav.bind(this);

    }

    toggleNav(e) {
        this.toggleClass(document.getElementById("main-panel"), "active");
        this.toggleClass(document.getElementById("sidebarCollapse"), "active");
        this.toggleClass(document.getElementById("sidebar"), "active");


    }

    handleLogout(e)
    {
        window.FB.logout(function(response) {
            this.deleteCookie("fblo_" + appId); //fblo_1580224302045363
            this.deleteCookie("fbsr_" + appId); //fbsr_1580224302045363
            this.setState({
                loggedIn: false,
                count: 0
            });
            window.location.reload() ;
        }.bind(this));
    }
    handleNavigation(e) {
        //alert(e);
        this.setState({currentScreen: e});
        if(e == "Search Snippets") {
            this.setState({ list : []
            });
        }
        if(e == "My Snippets") {
                this.ViewMySnippets();
        }
        if(e == "Dashboard") {
            this.setState({ list : []
            });
        }
    }
    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
                if (response.status === 'connected') {
            //this.testAPI();
            this.setState({
                loggedIn: true,
                count: 0
            });
        } else  {
            console.log("Please log into this app.");
            this.setState({
                loggedIn: false,
                count: 0
            });
        }
    }

    checkLoginState() {
        window.FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
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

    handleAdd()
    { 
        this.addModal.showModal('TEXT');
    }
    onSaveSnippet(e)
    {

        if (e.isNew == 0) {
            this.SaveItem(e.title, e.text, e.tags, e.lesson);
        }
        else {
            this.setState({currentId: e.id});
            this.UpdateItem(e.id, e.title, e.text, e.tags, e.lesson);
        }

    }

    SaveItem(title, text, tags, lesson) {
        var userName = this.removeSpaces(this.state.currentUser);
        var now = new Date();
        var strDateTime = [[this.AddZero(now.getDate()), this.AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [this.AddZero(now.getHours()), this.AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
        var uid = (new Date().getTime()).toString(36);
        var id = userName + uid;

        this.SaveItemToDB(title, text, tags.join(','), lesson,  userName, strDateTime, id, this.state.currentUserId, true);


    }

    SaveItemToDB(title, text, tags, lesson, userName, strDateTime, id, cId, toServer) {
        var data = {
            id: id,
            title: title,
            text: text,
            tags: tags,
            lesson: lesson,
            user: userName,
            userId: cId,
            date: strDateTime
        };
        localStorage.setItem(id, JSON.stringify(data));

        if(toServer)
        {
            this.PostAjaxDataToApp("/saveSnippet", data, function (e)
            {

                this.ViewMySnippets();
                this.setState({ errorMsg: "Code Snippet Saved Successfully"});
                this.errorModal.showModal();
            

            }.bind(this),
            function (e) {
                this.setState({ errorMsg: "Error in Saving Snippet to Server. Please try again later."});
                this.errorModal.showModal();

            }.bind(this));
        }
    }


    removeSpaces(currentUser)
    {
        if(currentUser) {
            var str = currentUser.replace(/[^a-z0-9]/gi, '');
            return str;
        }
        return currentUser;
    }
    UpdateItem(currentId, title, text, tags, lesson) {
        var userName = this.removeSpaces(this.state.currentUser);

        var now = new Date();
        var strDateTime = [[this.AddZero(now.getDate()), this.AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [this.AddZero(now.getHours()), this.AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

        var data = {
            id: currentId,
            title: title,
            text: text,
            tags: tags.join(','),
            lesson: lesson,
            user: userName,
            userId: this.state.currentUserId,
            date: strDateTime
        };
        localStorage.setItem(currentId, JSON.stringify(data));
        this.PostAjaxDataToApp("/saveSnippet", data, function (e) {
            //ViewMySnippets();
            //getAllData();
            this.setState({ errorMsg: "Code Snippet Updated Successfully"});
            this.errorModal.showModal();

        }.bind(this),
function (e) {
    this.setState({ errorMsg: "Error in Saving Snippet to Server. Please try again later."});
    this.errorModal.showModal();

}.bind(this));


    }


    PostAjaxDataToApp(url, inputData, successCallback, errorCallback) {

        request.post(`${url}`)
          .send(inputData)
          .accept('json')
          .end((err, res) => {
              if(err) {
                  if (errorCallback)
                      errorCallback(err);
                  return;
              }
              if (successCallback)
                  successCallback(res);
          });
    }


    AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }

    getData(data)
    {
        /*
        var key = "";
        var i = 0;
        var array = [];
        for (i = 0; i <= localStorage.length - 1; i++) {
            key = localStorage.key(i);
            array.push(JSON.parse(localStorage.getItem(key)));
        }

        return { data: array};
        */


    }

    onSearchClicked(searchTerm)
    {
        this.setState({currentScreen: "Search Snippets"});
        var array = [];
        var data = { searchTerm: searchTerm, type: "search"};

        if (searchTerm.length > 0) {
            this.loader.show();
            this.PostAjaxDataToApp("/getSnippets", data, function (results) {
                var array = [];
                if (results.body.length > 0) {
                    array  = results.body;
                }
                else {
                    this.setState({msg: "No Results Found"});
                    this.setState({ errorMsg: "No Results Found"});
                    this.errorModal.showModal();
                }
                this.setState({list: array});
                this.loader.hide();
            

            }.bind(this),
function (e) {
    this.loader.hide();
            
    this.setState({ errorMsg: "Error in Fetching Data  from Server. Please try again later."});
    this.errorModal.showModal();

}.bind(this));


            //var data = this.getData();


            //var results = jsonQuery('data[*title~/' + searchTerm + '/i|tags~/' + searchTerm + '/i]', {
            //    data: data, allowRegexp: true
            //})
            //            var results = filterResults('//*[contains(title, "' + searchTerm + '")]|//*[contains(tags, "' + searchTerm + '")]', data);
        }
        else {
            this.setState({ errorMsg: "Please Enter a Search Term"});
            this.errorModal.showModal();
            this.setState({list: array});

        }
    }

    
    ViewMySnippets()
    {
        var searchTerm = this.state.currentUserId;
        var array = [];
        if(searchTerm) {
            if (searchTerm.length > 0) {
                this.loader.show();
            
                var data = { searchTerm: searchTerm, type: "mySnippets"};

                this.PostAjaxDataToApp("/getSnippets", data, function (results) {
                    var array = [];
                    if (results.body.length > 0) {
                        array  = results.body;
                    }
                    else {
                        this.setState({msg: "No Snippets Found! Start Contributing.."});
                        this.setState({ errorMsg: "No Snippets Found! Start Contributing.."});
                        this.errorModal.showModal();
                    }
                    this.loader.hide();
                    this.setState({list: array});

                }.bind(this),
function (e) {
    this.loader.hide();
    this.setState({ errorMsg: "Error in Fetching Data  from Server. Please try again later."});
    this.errorModal.showModal();

}.bind(this));

                //var data = this.getData();

                /*
                var results = jsonQuery('data[*userId~/' + searchTerm + '/i]', {
                    data: data, allowRegexp: true
                })
                //            var results = filterResults('//*[contains(title, "' + searchTerm + '")]|//*[contains(tags, "' + searchTerm + '")]', data);
                if (results.value.length > 0) {
                    array  = results.value;
                }
                */
            }
        }
        this.setState({list: array});
    };

    DeleteSnippet(e){
        debugger;
        localStorage.removeItem(e.id);


        this.loader.show();
            
        var data = { id: e.id};

        this.PostAjaxDataToApp("/deleteSnippets", data, function (results) {
            var array = [];
            if (results.body) {
                this.loader.hide();
                this.setState({ errorMsg: "Error in Deleting Data from Server. Please try again later."});
                this.errorModal.showModal();
            }
            else {
                this.setState({msg: "Record Deleted Successfully."});
                this.setState({ errorMsg: "Record Deleted Successfully."});
                this.errorModal.showModal();
            }
            this.ViewMySnippets();
            this.loader.hide();

        }.bind(this),
function (e) {
    this.loader.hide();
    this.setState({ errorMsg: "Error in Deleting Data from Server. Please try again later."});
    this.errorModal.showModal();

}.bind(this));

    };

    EditSnippet(e){
        this.addModal.showModalForEdit(e);
    };

    render() {
      const { className, ...props } = this.props;
      let Screen = <div> <Dashboard users={this.state.users} snippets={this.state.snippets}> </Dashboard></div>;
      if(this.state.currentScreen != "Dashboard") {
          if(this.state.list.length > 0) {
              if(this.state.currentScreen == "Search Snippets") {
                  Screen = <SnippetList list={this.state.list} EditSnippet={this.EditSnippet.bind(this)} DeleteSnippet={this.DeleteSnippet.bind(this)} allowDelete={false} />
              }
              else
              {
                  Screen = <SnippetList list={this.state.list} EditSnippet={this.EditSnippet.bind(this)} DeleteSnippet={this.DeleteSnippet.bind(this)} allowDelete={true}/>
                  }
              }
          else {
              if(this.state.currentScreen == "Search Snippets") {
                  Screen = <div>Please use the Search Bar On Top to Search the Snippets</div>;
              }
              else
              {
                  Screen = <div>No Snippets Found Contributed By You. Start Contributing!</div>;
              }
          }

      }

    return (

      <div className={classnames('wrapper', className)} {...props}>
      <Sidebar list={[{
          Title: "Dashboard",
          Icon: "dashboard"
      },
      {
          Title: "Search Snippets",
          Icon: "search"
      },
      {
          Title: "My Snippets",
          Icon: "library_books"
        }]} handleNavigation={this.handleNavigation.bind(this)}/>
            <div className="main-panel active" id="main-panel">
                <SnippyNavbar handleLogout={this.handleLogout} imageUrl={this.state.photo} onSearchClicked={this.onSearchClicked.bind(this)}  />
                        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                
                                            <div className="card">
                                <div className="card-header" data-background-color="purple">
                                    <h4 className="title" id="pageTitle">{this.state.currentScreen}</h4>
                                </div>
                                <div className="card-data">
                {Screen}

              </div>
            </div>

              </div>
            </div>
          </div>
        </div>

        
     <Footer brandName={devName}>
        </Footer>
           </div>
           <FloatingButton Text="Add" Icon="add" Id="btnContribute" onMenuClick={this.handleAdd.bind(this)} />

        <Modal title="Snippy" modalId="ErrorModal" openModalId="errorModalId"  ref={modal => this.errorModal = modal} >
                             <div className="group md-form form-sm">
                                 {this.state.errorMsg}
                                 </div>
                    <div className="text-center mt-2">
 <button type="button" className="btn btn-outline-info waves-effect ml-auto ErrorModalclose" data-dismiss="modal">Close</button>

                    </div>

        </Modal>

                <AddSnippetModal title="Add Snippet" modalId="AddModal" openModalId="addModalId"  icon="fa fa-plus"
                ref={modal => this.addModal = modal} onSaveSnippet={this.onSaveSnippet.bind(this)}>
                </AddSnippetModal>

                <Loader ref={loader => this.loader = loader} >
                </Loader>

 
      </div>
    );
  }
}