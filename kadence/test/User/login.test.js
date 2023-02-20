test('Successful Login', () => {
    const username = "JohnDoe";
    const password = "passw0rd";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        console.log(response.status);
        expect(response.status).toBe(200);
    });
});

test('Account Does Not Exist', () => {
    const username = "JaneDoe";
    const password = "passw0rd";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status).toBe(400);
    });
});


test('No Username Sent', () => {
    const username = "";
    const password = "passw0rd";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status).toBe(400);
    });
});

test('No Password Sent', () => {
    const username = "JohnDoe";
    const password = "";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status).toBe(400);
    });
});

test('Incorrect Password', () => {
    const username = "JohnDoe";
    const password = "wrongPassword";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status).toBe(401);
    });
});