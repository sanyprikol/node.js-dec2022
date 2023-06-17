// EVENTS
// //
// const events = require('node:events');
//
// const eventEmitter = new events();
//
// eventEmitter.on('click', (data)=> {
//     console.log(data);
//     console.log('click, click, click');
// });
// eventEmitter.emit('click', {data:'hello'});
//
// eventEmitter.once('clik', ()=>{
//     console.log('1234567890')
// })
// eventEmitter.emit('clik');
// console.log(eventEmitter.eventNames());

// STRIM
// const fs = require('node:fs');
// const path = require('node:path');
//
// const readStream = fs.createReadStream('text.txt', {highWaterMark:50*1024});
// const writeStream = fs.createWriteStream('text2.txt');
// readStream.on('data', (chunk)=>{
//     console.log(chunk);
//     writeStream.write(chunk);
//
// })
// readStream.on('error', ()=>{
//     readStream.destroy();
//     writeStream.end('ERROR!!!!!!!!!!!!!!!!!!!!')
// })
//     .pipe(writeStream)

const express = require('express');
const fileService = require('./file.service');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));


app.get('/users', async (req, res) => {
    const users = await fileService.readDB();
    res.json(users)
})

// app.get('/users/:id', (req, res) => {
//
//     const {id} = req.params;
//     res.json(users[+id])
// })
//
app.post('/users', async (req, res) => {
    const {name, age, gender} = req.body;
    if (!name) {
        return res.status(400).json('name is wrong')
    }
    if (!age || age < 0 || age > 100) {
        return res.status(400).json('age is wrong')
    }
    if (!gender || gender !== 'male' && 'female') {
        return res.status(400).json('gender not valid')
    }

    const users = await fileService.readDB();

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
        gender
    }
    users.push(newUser);
    await fileService.writeDB(users);

    res.status(201).json(newUser)
});

app.get('/users/:id', async (req, res) => {
    const {id} = req.params;

    const users = await fileService.readDB();

    const  user = users.find((user) => user.id === +id);
    if (!user) {
        return res.status(422).json('User not found');
    }
    res.json(user)
})

app.patch('/users/:id', async (req, res)=> {
    const {id} = req.params;
    const {name, age, gender} = req.body;

    if (name && name.length <3) {
        return res.status(400).json('name is wrong')
    }
    if (age &&(age < 0 || age > 100)) {
        return res.status(400).json('age is wrong')
    }
    if (gender && (gender !== 'male' && 'female')) {
        return res.status(400).json('gender not valid')
    }

    const users = await fileService.readDB();
    const user = users.find((user) => user.id === +id)

    if (!user) {
        return res.status(422).json('user not found');
    }
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;

    await fileService.writeDB(users);
    res.status(201).json(user);
})


app.delete('/users/:id', async (req, res)=> {
    const {id} = req.params;

    const users = await fileService.readDB();
    const index = users.findIndex((user) => user.id === +id)

    if (index === -1) {
        return res.status(422).json('user not found');
    }
    users.splice(index, 1);
    await fileService.writeDB(users);
    res.sendStatus(204);
})

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server has started  on port ${PORT}🤞`)
})
