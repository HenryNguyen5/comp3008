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
const path = require("path");
const camo_1 = require("camo");
console.log(__dirname);
const uri = `nedb://${path.join(__dirname, 'dbstore/')}`;
class User extends camo_1.Document {
    constructor() {
        super();
        this.name = String;
    }
    static get(u) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!u.name) {
                throw "No User found";
            }
            const curUser = yield this.findOne({
                name: u.name
            });
            console.log("\n\nUser grabbed from db:", curUser);
            return curUser;
        });
    }
    static add(u) {
        return __awaiter(this, void 0, void 0, function* () {
            const curUser = yield this.get(u);
            if (curUser) {
                throw 'User already exists';
            }
            const newUser = this.create(u);
            try {
                yield newUser.save();
                console.log(`\n\nCreated and saved user`, newUser);
                return;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.User = User;
class PasswordResults extends camo_1.EmbeddedDocument {
    constructor() {
        super();
        this.service = String;
        this.allowedAttempts = Number;
        this.attempts = Number;
        this.givenShapes = Array;
        this.receivedShapes = Array;
        this.failed = Boolean;
        this.loginTime = Number;
    }
    ;
}
function connectToDb() {
    camo_1.connect(uri).then(function (ubase) {
        console.log('Connected to db!');
    }).catch((err) => {
        console.log(err);
    });
}
exports.connectToDb = connectToDb;
//# sourceMappingURL=user.js.map