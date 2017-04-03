"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const user_1 = require("../db/user");
const password_1 = require("../lib/password");
const fs = require("fs");
const path = require("path");
user_1.connectToDb();
const router = express.Router();
exports.router = router;
const wrap = require("express-async-wrap");
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/sendDebrief', (req, res) => {
    res.contentType('application/pdf');
    const rs = fs.createReadStream(`${path.join(__dirname, '../public/pdfs/debrief.pdf')}`);
    rs.pipe(res);
});
router.get('/getPassword', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(password_1.createPasswordObj());
}));
router.post('/testResults', wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let results = req.body;
    console.log(results);
    fs.writeFile(`${path.join(__dirname, `../db/dbstore/result_${Date.now()}.json`)}`, JSON.stringify(results, null, 2));
})));
//# sourceMappingURL=index.js.map