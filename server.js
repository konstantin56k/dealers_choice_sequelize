const express = require('express');
const {syncAndSeed, conn, models: {Department, Employee}} = require('./db');
const app = express();

app.get('/api/departments', async(req, res, next) => {
    try {
        res.send(await Department.findAll({
            include: [{
                model: Employee,
                as: 'manager'
            }]
        })
    )}
    catch(error) {
        next(error)
    }
});

const init = async() => {
    try {
        conn.authenticate();
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`)) 
    }
    catch(error) {
        console.log(error);
    }
}

init();