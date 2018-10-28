import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Modal from 'react-modal';
import jwt_decode from 'jwt-decode';
import {setCurrentUser, logoutUser} from '../../actions/authActions';
import store from '../../store';
import setAuthToken from '../../utils/setAuthToken';


class SessionExpired extends Component {
  componentDidMount() {
    if (localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      alert(decoded.exp);
      alert(currentTime);
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login';
      }
    }
  }
  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"></h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SessionExpired;