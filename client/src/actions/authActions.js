import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import { GET_ERRORS } from './types';
import {SET_CURRENT_USER} from './types'
import jwt_decode from 'jwt-decode'


export const registeruser = (userData, history) => dispatch =>{
	axios.post('/users/register', userData)
	.then(res => history.push('/login'))
	.catch(err => 
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	)
}

//login - get user token

export const loginUser = userData => dispatch => {
	axios.post('/users/login', userData)
		.then( res => {
			//save to localstorage
			const {token} = res.data;
			localStorage.setItem('jwtToken', token);
			//set token to Auth header
			setAuthToken(token);
			//decode toket with jwt decode 
			const decoded = jwt_decode(token);
			//set current user
			dispatch(setCurrentUser(decoded))
		})
		.catch(err => 
			dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}))
};

//set current user
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
};

//log user out

export const logoutUser = () => dispatch => {
	//remove the token
	localStorage.removeItem('jwtToken');
	//remove auth for future requests
	setAuthToken(false);
	//set current user to {}
	dispatch(setCurrentUser({}));
}