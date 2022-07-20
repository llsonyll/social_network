"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//Auth configuration function
function Auth(app, userCollection) {
    //Local strategy for authentication
    passport_1.default.use('local', new passport_local_1.default.Strategy(function (email, password, done) {
        //Try to find an user with that email
        userCollection.findOne({ email: email }, (err, user) => {
            console.log(`user ${email} tried to log in`);
            if (err)
                return done(err);
            //If no user found or wrong password the authentication fails, else it executes a callback
            else if (!user)
                return done(null, false);
            else if (!bcrypt_1.default.compareSync(password, user.password))
                return done(null, false);
            else
                return done(null, user);
        });
    }));
    //JasonWebToken strategy for auth
    passport_1.default.use('jwt', new passport_jwt_1.default.Strategy(
    //Extracts the token
    {
        secretOrKey: `${process.env.SECRET_TEST}`,
        jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken()
    }, 
    //Tryes to read the user from the token, or auth fails 
    (token, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            done(null, token.user);
        }
        catch (err) {
            done(err);
        }
    })));
}
exports.Auth = Auth;
