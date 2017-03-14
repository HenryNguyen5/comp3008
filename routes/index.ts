import express = require('express');
import {User, connectToDb}  from '../db/user';
import {createPasswordObj} from '../lib/password'
connectToDb();
console.log(createPasswordObj());

const router = express.Router();
import wrap = require('express-async-wrap');
//User.add({name:'hen'});

router.get('/', (req: express.Request, res: express.Response) =>{
    res.render('index');
});

router.get('/getPassword', (req: express.Request, res: express.Response) => {
    res.send(createPasswordObj());
});
router.post('/testResults', wrap( async(req: express.Request, res: express.Response) => {
    
}));


export {router}