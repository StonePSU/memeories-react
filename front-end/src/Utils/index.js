function sendXhrRequest(method = 'GET', url = '', token='',cb) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    
    if (token) {
        xhr.setRequestHeader('x-auth-token', token);
    }
    
    xhr.onreadystatechange = () => {
        if (xhr.readyState ===4 && xhr.status < 400) {
            cb(xhr);
        }
    }
    
    xhr.send();
}

export { sendXhrRequest }