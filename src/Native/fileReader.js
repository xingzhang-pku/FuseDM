function readTextFile(filename, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filename);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}