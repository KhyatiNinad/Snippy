import React from "react";
import classNames from "classnames";
import { Link, Redirect } from "react-router-dom";

export class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedTab: "Dashboard"};
    }

    changeTab(tab)
    {
        this.setState ( {selectedTab: tab});
    }
    NavClicked = (id, parent = null) => 
    {
        id.preventDefault();
        var lt = id.currentTarget.parentNode.attributes["data-atr"].value;
        
        this.setState ( {selectedTab: lt});
        if(this.props.handleNavigation)
            this.props.handleNavigation(lt);
    }

    componentDidMount() {
    };

    componentWillUnmount() {
    };


    render() {
        return (
                  <div className="sidebar active" id="sidebar" data-color="blue" >
        <div className="logo">
          <span id="logo" className="simple-text">
            </span>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
        {this.props.list.map(function(listValue, i){
            if(this.state.selectedTab == listValue.Title) {
                return <li className="active" data-atr="{listValue.Title}" key={i}>
                <Link to="" onClick={this.NavClicked.bind(this)}>
                <i className="material-icons">{listValue.Icon}
                </i>
                <p>{listValue.Title}
                </p>
              </Link>
                </li>;
                }
                    else
                    {
                return <li data-atr={listValue.Title} key={i}>
                <Link to="" onClick={this.NavClicked}>
                <i className="material-icons">{listValue.Icon}
                </i>
                <p>{listValue.Title}
                </p>
              </Link>
                </li>;

                    }
        }.bind(this))}
         </ul>
        </div>
      </div>


    );
}
}

