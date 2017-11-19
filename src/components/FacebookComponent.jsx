import React from 'react';
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

const appId = '1580224302045363';
export class FacebookComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn : false,
            count: 0
        };
    }

    loadFbLoginApi() {

        window.fbAsyncInit = function() {
            console.log("Loading fb api Init");
            window.FB.init({
                appId      : appId,
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.9' // use version 2.1
            });
        };

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
        this.loadFbLoginApi();
    }

    testAPI() {
        window.FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
              'Thanks for logging in, ' + response.name + '!';
        });
    }

    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
//        alert(response.status + this.state.count);
        if (response.status === 'connected') {
            //this.testAPI();
            this.setState({
                loggedIn: true,
                count: 0
            });
            debugger;
            if(this.props.onLogin)
                this.props.onLogin(response);

        } else if (response.status === 'unknown') {
            //this.testAPI();
            if(this.state.count == 0)
            {
                this.setState({
                    loggedIn: false,
                    count: 1
                });
                this.handleFBLogin();
  //              window.FB.login(this.checkLoginState());

            }

        } else if (response.status === 'not_authorized') {
            console.log("Please log into this app.");
            this.setState({
                loggedIn: false,
                count: 0
            });
            this.handleFBLogin();
        } else {
            console.log("Please log into this facebook.");
            this.setState({
                loggedIn: false,
                count: 0
            });
            this.handleFBLogin();
        }
    }

    checkLoginState() {
        debugger;
        window.FB.getLoginStatus(function(response) {
            debugger;
            this.statusChangeCallback(response);
        }.bind(this));
    }

    handleFBLogin() {
        //window.FB.login(
        //    this.checkLoginState());
        debugger;

        window.FB.login(function(response) {
            debugger;
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                this.setState({
                    loggedIn: true,
                    count: 0
                });
                debugger;
                if(this.props.onLogin)
                    this.props.onLogin(response);

            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }.bind(this), {
            scope: 'email', 
            profile_selector_ids: '',
            return_scopes: true
        });

    }
    handleLogoutClick() {
        window.FB.logout(function(response) {
            this.deleteCookie("fblo_" + appId); //fblo_1580224302045363
            this.deleteCookie("fbsr_" + appId); //fbsr_1580224302045363
            this.setState({
                loggedIn: false,
                count: 0
            });
        }.bind(this));
    }

    deleteCookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    render() {
        const isLoggedIn = this.state.loggedIn;

        let button = null;
        if (isLoggedIn) {
            button = <LogoutButton clickHandler={this.handleLogoutClick.bind(this)} />;
        } else {
            button = <LoginButton clickHandler={this.checkLoginState.bind(this)} />;
        }

        return (
          <div>
            {button}
        </div>
               );
   }
}
