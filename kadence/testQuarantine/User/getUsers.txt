test('Successful Request', () => {
    const username = "JohnDoe";
    //var status;

    fetch('https://localhost:3000/api/users/getUsers?' + new URLSearchParams({
        username: username,
    })).then((response) => {
        console.log(response);
        //status = response.json();
        expect(response.status()).toBe(200);
    });
    //expect(status).toBe(!null);
});

test('Account Does Not Exist', () => {
    const username = "JaneDoe";

    fetch('https://localhost:3000/api/users/getUsers?' + new URLSearchParams({
        username: username,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status()).toBe(400);
    });
});

test('No Username Sent', () => {
    const username = "JohnDoe";
    const status = null;

    fetch('https://localhost:3000/api/users/getUsers?' + new URLSearchParams({
        username: username,
    })).then((response) => {
        //console.log(response.status);
        status = response;
    });
    //console.log(status);
    expect(status).toBe(null);
});