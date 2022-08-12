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
const index_1 = require("./../../mongoose/index");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const axios_1 = __importDefault(require("axios"));
const redirect = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield axios_1.default.post(`${process.env.URL}auth/refresh`, { refreshToken });
        return res.data;
    }
    catch (err) {
        console.log(err);
    }
});
const profileArray = [
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p1_anad93.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p2_tj88ek.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p3_dlphru.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p4_zy2yhe.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p5_i3n2nd.png",
];
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
        callbackURL: `${process.env.URL}auth/loginGoogle`,
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
                    profilePicture: profileArray[Math.floor(Math.random() * 5)]
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
        callbackURL: `${process.env.URL}auth/loginFacebook`,
        profileFields: ['email', 'id', "name", 'displayName', 'photos'],
    }, (accessToken, RefreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            let { _json } = profile;
            let user = yield userCollection.findOne({ email: `${_json.email}` });
            if (!user) {
                let salt = yield bcrypt_1.default.genSalt(10);
                let hash = yield bcrypt_1.default.hash(`${profile.id}`, salt);
                let newUser = new userCollection({
                    lastname: _json.last_name,
                    firstname: _json.first_name,
                    username: _json.first_name,
                    email: _json.email,
                    password: hash,
                    profilePicture: profileArray[Math.floor(Math.random() * 5)],
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
        secretOrKey: `${process.env.SECRET_REFRESH}`,
        jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken()
    }, 
    //Tryes to read the user from the token, or auth fails 
    (refreshtoken, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            let token = yield index_1.Token.findOne({ email: refreshtoken.email });
            if (!token || !(refreshtoken.userTokenId === token._id.toString())) {
                return done(null, false);
            }
            ;
            token = jsonwebtoken_1.default.verify(token.token, `${process.env.SECRET_TEST}`);
            return done(null, token.user);
        }
        catch (err) {
            if (err.message === 'jwt expired') {
                yield redirect(refreshtoken);
                let token = yield index_1.Token.findOne({ email: refreshtoken.email });
                token = jsonwebtoken_1.default.verify(token.token, `${process.env.SECRET_TEST}`);
                return done(null, token.user);
            }
            else {
                return done(null, false);
            }
        }
    })));
}
exports.Auth = Auth;
