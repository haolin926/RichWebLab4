let reference;
let data1;
let data1_content;
let data2;
let data2_content;
let data3 = "data3.json";
let data3_content;
let students =[];
const request1 = new XMLHttpRequest();
const request2 = new XMLHttpRequest();
const request3 = new XMLHttpRequest();
const request4 = new XMLHttpRequest();

function synchronousCall() {
    request1.open('GET', 'reference.json', false);

    request1.onreadystatechange = function() {
        if (request1.readyState === XMLHttpRequest.DONE) {
            reference = JSON.parse(request1.responseText);
            data1 = reference.data_location;

            request2.open('GET', data1, false);

            request2.onreadystatechange = function() {
                if (request2.readyState === XMLHttpRequest.DONE) {
                    data1_content = JSON.parse(request2.responseText);
                    data2 = data1_content.data_location;

                    const student_data1 = data1_content.data.map(students => {
                        const [name, surname] = students.name.split(' ');
                        return {
                            name,
                            surname,
                            id : students.id
                        };
                    });
                    students.push(...student_data1);

                    request3.open('GET', data2, false);

                    request3.onreadystatechange = function() {
                        if (request3.readyState === XMLHttpRequest.DONE) {
                            data2_content = JSON.parse(request3.responseText);

                            const student_data2 = data2_content.data.map(students => {
                                const [name, surname] = students.name.split(' ');
                                return {
                                    name,
                                    surname,
                                    id : students.id
                                };
                            });
                            students.push(...student_data2);

                            request4.open('GET', data3, false);

                            request4.onreadystatechange = function() {
                                if(request4.readyState === XMLHttpRequest.DONE) {
                                    data3_content = JSON.parse(request4.responseText);

                                    const student_data3 = data3_content.data.map(students => {
                                        const [name, surname] = students.name.split(' ');
                                        return {
                                            name,
                                            surname,
                                            id : students.id
                                        };
                                    });
                                    students.push(...student_data3);
                                }
                            };
                            request4.send();
                        }
                    };
                    request3.send();
                }
            };
            request2.send();
        }
    };
    request1.send();
    displayData();
    console.log(students);
}

function asyncCall()
{
    fetchData('reference.json', function(response) {
        reference = JSON.parse(response);
        data1 = reference.data_location;
        fetchData(data1, function(response) {
            data1_content = JSON.parse(response);
            const student_data1 = data1_content.data.map(students => {
                const [name, surname] = students.name.split(' ');
                return {
                    name,
                    surname,
                    id : students.id
                };
            });
            students.push(...student_data1);
            data2 = data1_content.data_location;
            fetchData(data2, function(response) {
                data2_content = JSON.parse(response);
                const student_data2 = data2_content.data.map(students => {
                    const [name, surname] = students.name.split(' ');
                    return {
                        name,
                        surname,
                        id : students.id
                    };
                });
                students.push(...student_data2);
                fetchData(data3, function(response) {
                    data3_content = JSON.parse(response);
                    const student_data3 = data3_content.data.map(students => {
                        const [name, surname] = students.name.split(' ');
                        return {
                            name,
                            surname,
                            id : students.id
                        };
                    });
                    students.push(...student_data3);
                    displayData();
                    console.log(students);
                });
            });
        });
    });
}

function fetchData(url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            callback(request.responseText);
        }
    };
    request.send();
}

function fetchStudentData() {
    fetch('reference.json')
        .then(response => response.json())
        .then(data => {
            reference = data;
            data1 = reference.data_location;
            return fetch(data1);
        })
        .then(response => response.json())
        .then(data => {
            data1_content = data;
            data2 = data1_content.data_location;
            const student_data1 = data1_content.data.map(students => {
                const [name, surname] = students.name.split(' ');
                return {
                    name,
                    surname,
                    id : students.id
                };
            });
            students.push(...student_data1);
            return fetch(data2);
        })
        .then(response => response.json())
        .then(data => {
            data2_content = data;
            const students_data2 = data2_content.data.map(students => {
                const [name, surname] = students.name.split(' ');
                return {
                    name,
                    surname,
                    id : students.id
                };
            });
            students.push(...students_data2);
            return fetch(data3);
        })
        .then(response => response.json())
        .then(data => {
            data3_content = data;
            const student_data3 = data3_content.data.map(students => {
                const [name, surname] = students.name.split(' ');
                return {
                    name,
                    surname,
                    id : students.id
                };
            })
            students.push(...student_data3);
        })
        .then(() => {
            displayData();
        })
        .catch(error => console.error(error));
}

function displayData() {
    const student_table = document.getElementById('data');
    students.forEach(student => {
        const row = student_table.insertRow();
        row.insertCell(0).innerHTML = student.id;
        row.insertCell(1).innerHTML = student.name;
        row.insertCell(2).innerHTML = student.surname;
    });
}

function cleanOutput() {
    const table = document.getElementById('data');
    while(table.rows.length > 1) {
        table.deleteRow(1);
    }

    students = [];
}

document.getElementById('synchronous').addEventListener('click', synchronousCall);
document.getElementById('async').addEventListener('click', asyncCall);
document.getElementById('fetch').addEventListener('click', fetchStudentData);
document.getElementById('clean').addEventListener('click', cleanOutput);