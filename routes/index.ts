/**
 *  @name {index}
 *  Route for index
 *  Renders .pug file for index for user to interact with
 */
/**
 *  @name {getPassword}
 *  Route send a password object via GET request
 *  Creates the password via imported function in /lib then sends it
 */
/**
 *  @name {testResults}
 *  Route to receive results from front-end password scheme via POST request
 *  Stores the resulting data as a JSON file with its name being the timestamp
 */

import express = require('express');
import { createPasswordObj } from '../lib/password';
import fs = require('fs');
import path = require('path');
const router = express.Router();
import wrap = require('express-async-wrap');


router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
});


router.get('/getPassword', async (req: express.Request, res: express.Response) => {
    res.send(createPasswordObj());
});


router.post('/testResults', wrap(async (req: express.Request, res: express.Response) => {
    const results = req.body;
    console.log(results);
    fs.writeFile(`${path.join(__dirname, `../db/dbstore/result_${Date.now()}.json`)}`, JSON.stringify(results, null, 2));
}));


export { router }