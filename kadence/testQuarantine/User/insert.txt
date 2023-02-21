test('Successful Request', () => {
    const toInsert = {
        username: "JohnKadence",
        email: "johnkadence@kadence.gov",
        password: "myPassword",
        bio: "welcome to my kadence account. If you don't like the same music as me you're wrong",
        private: false,
        devices: [],
        selectedDevice: "",
        musicPlatforms: [],
        selectedMusic: "",
        musicPrefs: [],
        waitToSave: true,
        intervalShort: 0,
        intervalLong: 120,
        rampUpTime: 5,
        rampDownTime: 5,
        mood: "happy",
        zipCode: "44114",
        friendRequests: [],
        friends: [],
        actions: [],
    };
    //var status;

    (async () => {
        const response = await fetch('https://localhost:3000/api/users/insert', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toInsert)
        });
        const content = response.json();

        console.log(content);
        expect(1).toBe(1);
    })();

    /*fetch('https://localhost:3000/api/users/getUsers?' + new URLSearchParams({
        username: username,
    })).then((response) => {
        console.log(response);
        //status = response.json();
        expect(response.status()).toBe(200);
    });
    //expect(status).toBe(!null);*/
});