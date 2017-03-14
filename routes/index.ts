import express = require('express');
import {User, connectToDb}  from '../db/user';
connectToDb();

const router = express.Router();
import wrap = require('express-async-wrap');
//User.add({name:'hen'});

router.get('/', (req: express.Request, res: express.Response) =>{
    res.render('index');
});

router.post('/testResults', wrap( async(req: express.Request, res: express.Response) => {
    
}));


export {router}