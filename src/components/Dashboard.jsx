import React from 'react';
import { Link } from "react-router-dom";
import classnames from 'classnames';

export class Dashboard extends React.Component {

    render() {
        const d = new Date();
        const dt = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

        return (
<div className="row">
                        <div className="col-lg-3 col-lg-offset-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="orange">
                                    <i className="fa fa-user fa-2x"></i>
                                </div>
                                <div className="card-content">
                                    <p className="category">User Base</p>
                                    <h3 className="title">{this.props.users}
                                    </h3>
                                </div>
                            </div>
                        </div>
                                    
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="green">
                                    <i className="fa fa-code fa-2x"></i>
                                </div>
                                <div className="card-content">
                                    <p className="category">Snippets</p>
                                    <h3 className="title">{this.props.snippets}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-content">
                                    <p className="category">As On</p>
                                    <h3 className="title">{dt}
                                    </h3>
                                </div>
                            </div>
                        </div>
                  </div>
               );
    }
}

