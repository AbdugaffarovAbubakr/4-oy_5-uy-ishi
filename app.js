const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const blogsRoutes = require('./routes/blogs');

const app = express();

app.use(bodyParser.json());
app.use('/users', usersRoutes);
app.use('/blogs', blogsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
