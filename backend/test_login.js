const axios = require('axios');

axios.post('http://localhost:8000/api/user/user-login', { 
    email: 'johndea12@gmail.com', 
    password: 'password123' // Just a guess, but if it says "Incorrect email or password", that's from the !user check, NOT the !ismatch check!
})
.then(res => console.log(res.data))
.catch(err => console.error(err.message));
