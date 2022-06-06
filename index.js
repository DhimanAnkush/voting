require('dotenv').config();
const express = require('express');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { send } = require('process');
const authenticate = require('./authenticate');

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send("App working")
})

app.post('/user/create', (req, res) => {

    const existUsers = getUserData();
    const userData = req.body;

    if(userData.name == null || userData.age == null || userData.role == null || userData.password == null || userData.username == null){
        return res.status(400).send({error : true, msg : "Please provide data"});
    }

    const findExist = existUsers.find(user => user.username === userData.username);

    if(findExist){
        return res.status(401).send({error: true, msg : "username already exists"});
    }

    existUsers.push(userData);

    saveUserData(existUsers);
    res.status(201).send({success: true, msg: "User data added"});
})

app.get('/votes/voters', (req, res) => {

    const users = getUserData();
    res.send(users, "App working")
})

app.post('/db', (req, res) => {

    const data = getUserData();
    const userData = req.body;

    data.push(userData);

    saveUserData(data);
    res.status(201).send({success: true, msg: "New data added"});

})

app.get('/db', (req,res) => {

    const users = getUserData();
    res.send(users)
});

app.post('/user/login', (req, res) => {

    const user = getUserData();

    if(!user){
        return res.status(400).send({msg: "Please enter correct user details"});
    }

    // const match = user.checkPassword(req.body.password);

    if(user.password !== req.body.password){
        return res.status(400).send({msg : "Please enter correct details"})
    }

    const token = (user) => {
        return jwt.sign({user: user}, process.env.JWT_SECRET_KEY, {
            expiresIn: 60*60*3,
        })
    }

    return res.status(201).send({user, token})
})

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync('db.json', stringifyData);
}

const getUserData = () => {
    const jsonData = fs.readFileSync('db.json');
    return JSON.parse(jsonData);
}

app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening to port`);
})