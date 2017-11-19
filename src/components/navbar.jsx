import React from "react";
import classNames from "classnames";

const scrollClass = 'navbar  navbar-fixed-top navbar-color-on-scroll';
const topClass = 'navbar navbar-transparent navbar-fixed-top navbar-color-on-scroll';

export class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {navbarClass: topClass};
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
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
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/">{this.props.AppName}</a>
                </div>

                <div className="collapse navbar-collapse" id="navigation-example">
                    <ul className="nav navbar-nav navbar-right">
            {this.props.children}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
}

export class NavItem extends React.Component {

    render() {
        return (
            <li>
                { this.props.children }
            </li>
        );
    }
}

export class DropdownToggle extends React.Component {
    render() {
        return (
          <a className="nav-link" data-toggle="dropdown" role="button" {... this.props}>
            {this.props.children}
          </a>);
    }
}

export class DropdownMenu extends React.Component {
    render() {
        return <div className="dropdown-menu" {... this.props}>{this.props.children}</div>;
    }
}
