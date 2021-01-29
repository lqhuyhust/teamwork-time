export const reportService = {
    createReport,
    editReport,
    getReportInPagination,
    getReportByUserID,
    deleteReport
};

import {router} from './../router/router'
const apiUrl = 'http://192.168.1.16:2228';

function createReport(report) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
        body: JSON.stringify(report)
    };

    return fetch(`${apiUrl}/report`, requestOptions)
        .then(handleResponse)
        .then(response => {
            console.log(response);
        });
}

function editReport(report, reportID) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
        body: JSON.stringify(report)
    };

    return fetch(`${apiUrl}/report/${reportID}`, requestOptions)
        .then(handleResponse)
        .then(response => {
            console.log(response);
        });
}

function getReportByUserID(reportID) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') }
    };

    return fetch(`${apiUrl}/report/${reportID}`, requestOptions).then(handleResponse);
}

function getReportInPagination(keyword, from, to, userID, page, limit = 5) {
    
    var key_path = keyword != '' ? `&search=${keyword}` : '';
    var from_path = from != '' ? `&from=${from}` : '';
    var to_path = to != '' ? `&to=${to}` : '';
    var user_path = userID != '' ? `&uid=${userID}` : '';

    console.log(
        localStorage.getItem('token')
    );

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 'token':  localStorage.getItem('token')  //JSON.parse()
        }
    };

    return fetch(`${apiUrl}/reports?page=${page}&limit=${limit}${key_path}${from_path}${to_path}${user_path}`, requestOptions).then(handleResponse)
    
}

function deleteReport(reportID) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'token': token }
    };

    return fetch(`${apiUrl}/report/${reportID}`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}

// prefixed function name with underscore because delete is a reserved word in javascript

function handleResponse(response) {
    return response.text().then(text => {
        const data = text ;
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                //router.push('/login');
                //logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}