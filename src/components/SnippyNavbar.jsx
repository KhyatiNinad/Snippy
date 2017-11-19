import React from "react";
import classNames from "classnames";

const scrollClass = 'navbar  navbar-fixed-top navbar-color-on-scroll';
const topClass = 'navbar navbar-main navbar-absolute';

export class SnippyNavbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {navbarClass: topClass, search_text: "", mobile_menu_visible: 0, mobile_menu_initialized: false};
    }

    handleLogout(e) {
        e.preventDefault();
        if(this.props.handleLogout)
            this.props.handleLogout();

    }
    componentDidMount() {
        var formControls = document.getElementsByClassName("dropdown-toggle");
        for(var i = 0 ; i < formControls.length ; i++)
        {
            formControls[i].onclick = this.toggleDropDown.bind(this);
        }
        window.onresize = this.initSidebarsCheck.bind(this);
        Element.prototype.remove = function() {
            this.parentElement.removeChild(this);
        }
        NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
            for(var i = this.length - 1; i >= 0; i--) {
                if(this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        }
        this.initSidebarsCheck();
    }
    initSidebarsCheck() {
        if (window.innerWidth <= 991) {
            this.initRightMenu();
        }
    }

    initRightMenu()
    {
        debugger;


        var $sidebar_wrapper = document.getElementsByClassName('sidebar-wrapper')[0];
        var mobile_menu_initialized = this.state.mobile_menu_initialized;

        if (!mobile_menu_initialized) {
            var $navbar = document.getElementsByClassName('navbar-collapse')[0].childNodes[0];

            var mobile_menu_content = '';
            var $sidebar = document.getElementsByClassName('sidebar')[0];
            this.removeClass($sidebar, "active");
            var nav_content = $navbar.innerHTML;

            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

            var div = document.createElement('div');
            div.innerHTML = nav_content;
            nav_content = div.childNodes[0];

            var navbar_form = document.getElementsByClassName('navbar-form')[0].outerHTML;

            var div2 = document.createElement('div');
            div2.innerHTML = navbar_form;
            navbar_form = div2.childNodes[0];

            var $sidebar_nav = $sidebar_wrapper.childNodes[0];

            $sidebar_wrapper.insertBefore((navbar_form), $sidebar_nav); 
            $sidebar_wrapper.insertBefore((nav_content), $sidebar_nav); 

            debugger;
            var hyp = $sidebar_wrapper.getElementsByTagName("a");

            for(var i = 0 ; i < hyp.length ; i++)
            {

                hyp[i].onclick = function(event){
                    debugger;
                    event.stopPropagation();
                };
            }


            this.setState({mobile_menu_initialized : true});
        } else {
            if (window.innerWidth  > 991) {
                // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                $sidebar_wrapper.getElementsByClassName('navbar-form')[0].remove();
                $sidebar_wrapper.getElementsByClassName('nav-mobile-menu')[0].remove();

                this.setState({mobile_menu_initialized : false});
            }

        }

    }

    handleKeyDown = (e) => {
        if (!e) { var e = window.event; }
        // Enter is pressed
        if (e.keyCode === 13) { 
            e.preventDefault(); // sometimes useful
            this.onSearchClicked(e); 
        }
    }
    handleChange = (e) => {
        this.setState({ [`${e.target.name}`]: e.target.value });
    };

    onSearchClicked(e)
    {
        if(this.props.onSearchClicked)
        {
            this.props.onSearchClicked(this.state.search_text);
        }
    };
    toggleDropDown(e)
    {
        debugger;
        this.toggleClass(e.currentTarget.parentNode, "open");
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

    componentWillUnmount() {
    };

    handleScroll(event) {
        this.debounce(this.checkScroll(event) , 17).bind(this);
    };

    checkScroll(event) {
        let scrollTop = document.documentElement.scrollTop;
        if(scrollTop > 80) {
            this.setState({
                navbarClass: scrollClass
            });
        }
        else
        {
            this.setState({
                navbarClass: topClass
            });

        }

    };
    navBarToggle()
    {
        var mobile_menu_visible = this.state.mobile_menu_visible;
        var $toggle = document.getElementsByClassName("navbar-toggle")[0];
        if (mobile_menu_visible == 1) {
            this.removeClass(document.getElementsByTagName("html")[0], 'nav-open');

            //$('.close-layer').remove();
            setTimeout(function() {
                this.removeClass($toggle,'toggled');
            }.bind(this), 400);

            this.setState({mobile_menu_visible : 0});
        } else {
            setTimeout(function() {
                this.addClass($toggle,'toggled');
            }.bind(this), 430);

            this.addClass(document.getElementsByTagName("html")[0], 'nav-open');
            this.setState({mobile_menu_visible : 1});

        }
    }
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    };

    render() {
        return (
          <nav className={this.state.navbarClass}>
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" id="sidebarCollapse" className="navbar-btn active">
                <span></span>
                <span></span>
                <span></span>
              </button>
              <button type="button" className="navbar-toggle" data-toggle="collapse" onClick={this.navBarToggle.bind(this)}>
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#"> Snippy </a>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="material-icons">person</i>
                    <p className="hidden-lg hidden-md">Profile</p>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <div className="card card-profile">
                        <div className="card-avatar">
                          <a href="#pablo">
                            <img className="img" src={this.props.imageUrl} />
                          </a>
                        </div>
                        <div className="content">
                          <h4 className="card-title">
                          {this.props.userName}
                          </h4>
                          <p className="card-content">
                          </p>
                          <a href="#" onClick={this.handleLogout.bind(this)} className="btn btn-primary btn-round">Sign Out</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div className="navbar-form navbar-right" role="search">
                <div className="form-group  is-empty">
                  <input type="text" className="form-control" name="search_text" id="search_text" placeholder="Search Code Snippets" onChange={this.handleChange} onKeyDown={this.handleKeyDown.bind(this)}/>
                    <span className="material-input"></span>
                  </div>
                <button type="button" name="search_button" id="search_button" className="btn btn-white btn-round btn-just-icon" onClick={this.onSearchClicked.bind(this)}>
                  <i className="material-icons">search</i>
                  <div className="ripple-container"></div>
                </button>
              </div>
            </div>
          </div>
        </nav>

    );
}
}

