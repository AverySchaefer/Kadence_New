test('Successful Login', () => {
    const username = "JohnDoe";
    const password = "passw0rd";

    fetch('https://localhost:3000/api/users/login?' + new URLSearchParams({
        username: username,
        enteredPW: password,
    })).then((response) => {
        //console.log(response.status);
        expect(response.status).toBe(200);
    });
});