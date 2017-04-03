import express = require('express');
import { User, connectToDb } from '../db/user';
import { createPasswordObj } from '../lib/password';
import fs = require('fs');
import path = require('path');

connectToDb();


const router = express.Router();
import wrap = require('express-async-wrap');


router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
});

router.get('/sendDebrief', (req: express.Request, res: express.Response) => {
    res.contentType('application/pdf');
    const rs = fs.createReadStream(`${path.join(__dirname, '../public/pdfs/debrief.pdf')}`);
    rs.pipe(res);
});

router.get('/getPassword', async (req: express.Request, res: express.Response) => {
    res.send(createPasswordObj());
});

router.post('/testResults', wrap(async (req: express.Request, res: express.Response) => {
    let results = req.body;
    console.log(results);
    fs.writeFile(`${path.join(__dirname, `../db/dbstore/result_${Date.now()}.json`)}`, JSON.stringify(results, null, 2));
}));


export { router }