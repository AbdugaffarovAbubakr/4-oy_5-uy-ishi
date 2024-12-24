const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const usersFile = './database/users.json';

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

router.post('/register', (req, res) => {
    const { username, password, fullName, age, email, gender } = req.body;
    const users = readUsers();

    if (users.find(user => user.username === username || user.email === email)) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }
    if (!username || username.length < 3 || !password || password.length < 5 || !email || age < 10) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const newUser = { id: uuidv4(), username, password, fullName, age, email, gender };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json(newUser);
});

router.get('/profile/:identifier', (req, res) => {
    const users = readUsers();
    const user = users.find(
        user => user.username === req.params.identifier || user.email === req.params.identifier
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
});

router.put('/profile/:identifier', (req, res) => {
    const users = readUsers();
    const userIndex = users.findIndex(
        user => user.username === req.params.identifier || user.email === req.params.identifier
    );

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;
    writeUsers(users);

    res.json(updatedUser);
});

router.delete('/profile/:identifier', (req, res) => {
    const users = readUsers();
    const newUsers = users.filter(
        user => user.username !== req.params.identifier && user.email !== req.params.identifier
    );

    if (newUsers.length === users.length)
        return res.status(404).json({ message: 'User not found' });

    writeUsers(newUsers);
    res.json({ message: 'User deleted successfully' });
});

module.exports = router;
