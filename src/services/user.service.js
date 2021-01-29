export const userService = {
    login,
    logout,
    getAllUser
}

import {router} from './../router/router'
const apiUrl = 'http://192.168.1.16:2228';

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${apiUrl}/login`, requestOptions)
        .then(handleResponse)
        .then(response => {
            // login successful if there's a jwt token in the response
            if (response) {
                let res = JSON.parse(response);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', res.token); //JSON.stringify()
                localStorage.setItem('user', res.user.id);
                console.log(localStorage.getItem('token'));
                console.log(localStorage.getItem('user'));
            }
            
            router.push('/home');
            return response;
        });
}

function getAllUser(){
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 'token': localStorage.getItem('token')
        }
    };

    return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 'token': localStorage.getItem('token')
        }
    };

    return fetch(`${apiUrl}/logout`, requestOptions).then(handleResponse);
    
}

// prefixed function name with underscore because delete is a reserved word in javascript

function handleResponse(response) {
    return response.text().then(text => {
        const data = text;
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}