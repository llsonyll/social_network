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
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const URLCALLBACK = process.env.URLCALLBACK || 'http://localhost:3001';
//Auth configuration function
function Auth(app, userCollection) {
    //Local strategy for authentication
    passport_1.default.use('local', new passport_local_1.default.Strategy({ usernameField: 'email' }, function (email, password, done) {
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
    //google strategy
    passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: `${URLCALLBACK}/auth/loginGoogle`,
        scope: ["email", "profile"],
    }, (accessToken, RefreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            let { _json } = profile;
            let user = yield userCollection.findOne({ email: `${_json.email}` });
            if (!user) {
                let salt = yield bcrypt_1.default.genSalt(10);
                let hash = yield bcrypt_1.default.hash(`${profile.id}`, salt);
                let newUser = new userCollection({
                    lastname: _json.family_name,
                    firstname: _json.given_name,
                    username: _json.given_name,
                    email: _json.email,
                    password: hash,
                    profilePicture: _json.picture
                });
                yield newUser.save();
                return done(null, newUser);
            }
            else {
                return done(null, user);
            }
        }
        catch (err) {
            return done(null, false);
        }
    })));
    //facebook strategy
    passport_1.default.use("facebook", new passport_facebook_1.default.Strategy({
        clientID: `${process.env.FACEBOOK_APP_ID}`,
        clientSecret: `${process.env.FACEBOOK_APP_SECRET}`,
        callbackURL: `${process.env.FACEBOOK_CALLBACK}`,
        profileFields: ['email', 'id', "name", 'displayName', 'photos'],
    }, (accessToken, RefreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(profile);
            let { _json } = profile;
            let user = yield userCollection.findOne({ email: `${_json.email}` });
            let { url } = _json.picture.data;
            console.log(url);
            if (!user) {
                let salt = yield bcrypt_1.default.genSalt(10);
                let hash = yield bcrypt_1.default.hash(`${profile.id}`, salt);
                let newUser = new userCollection({
                    lastname: _json.last_name,
                    firstname: _json.first_name,
                    username: _json.first_name,
                    email: _json.email,
                    password: hash,
                    profilePicture: url,
                });
                yield newUser.save();
                return done(null, newUser);
            }
            else {
                return done(null, user);
            }
        }
        catch (err) {
            return done(null, false);
        }
    })));
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
            let expiredToken = new Date(token.exp * 1000);
            if (expiredToken < new Date()) {
                return done(null, false);
            }
            if (!token.user) {
                return done(null, token);
            }
            done(null, token.user);
        }
        catch (err) {
            done(err);
        }
    })));
}
exports.Auth = Auth;
