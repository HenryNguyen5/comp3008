import express = require('express');
const router = express.Router();
import wrap = require('express-async-wrap');

router.get('/', (req: express.Request, res: express.Response) =>{
    res.render('index');
});

router.post('/testResults', wrap( async(req: express.Request, res: express.Response) => {

}));
