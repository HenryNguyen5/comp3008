import {EmbeddedDocument, connect, Document} from 'camo';

const uri = 'nedb:///comp3008/';


/**
* User
*/
export class User extends Document<any>{
    constructor() {
        super();
        this.name = String;
        //this.consent = Buffer;
        //this.results = [PasswordResults];
    }

    private static async get(u) {
		if (!u.name){
            throw "No User found";   
        }
		const curUser = await this.findOne({
			name: u.name
		});
		console.log("\n\nUser grabbed from db:", curUser);
		return curUser;
	}
    
    static async add(u):Promise<any> {
		//let deleted = await this.deleteMany({});
		//console.log(`Deleted:${deleted}`);
		//check if user exists yet
        const curUser:any = await this.get(u);	
        
		if (curUser) {
			throw 'User already exists';
		}
        
		const newUser = this.create(u);
        
		try {
			await newUser.save();
			console.log(`\n\nCreated and saved user`, newUser);
			return;
		} catch (e) {
			console.log(e);
		}
	}
}
/*
. For each password, the system should say what
it is for (e.g. “Email”, or “Bank”, or “Facebook”), show the user the password, and have
the user enter the password to confirm they know it. When this has been done for all 3
passwords, the system should request the user enter the passwords again, in a random order.
It should then repeat this process again. The user may be allowed up to 3 attempts to enter
each password before declaring failure.

Instrument your software to record details useful for
assessing usability, such as login times, success, failures, etc.
*/
class PasswordResults extends EmbeddedDocument<any> {
    constructor() {
        super();
        this.service = String;
        this.allowedAttempts = Number;
        this.attempts = Number;
        this.givenShapes = Array;
        this.receivedShapes = Array;
        this.failed = Boolean;
        this.loginTime = Number;
    };

}

export function connectToDb(){
connect(uri).then(function (ubase) {
	console.log('Connected to db!');
}).catch((err) => {
	console.log(err);
	
});
}
