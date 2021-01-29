export const timeService = {
    addTime,
    deleteTime,
    getTimes
};

const apiUrl = 'http://192.168.1.16:2228/notoken';

function getTimes(uid, from, to) {
    var from_path = from != '' ? `&from=${from}` : '';
    var to_path = to != '' ? `&to=${to}` : '';

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 'token': localStorage.getItem('token')
        }
    };

    return fetch(`${apiUrl}/times?uid=${uid}${from_path}${to_path}`, requestOptions).then(handleResponse)
}

function addTime(time) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
        body: JSON.stringify(time)
    };

    return fetch(`${apiUrl}/time`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function deleteTime(timeID) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') }
    };

    return fetch(`${apiUrl}/time/${timeID}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript

function handleResponse(response) {
    return response.text().then(text => {
        const data = text ;
        if (!response.ok) {            
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}