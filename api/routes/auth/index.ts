import express, { Response, Request, NextFunction } from "express";
import { IUser } from "./../../types/index";
import { User, Token  } from "../../mongoose";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

import { createTransport } from "nodemailer";
import { mailInfo, sendMail } from "../../utils/nodemailer";
// @ts-ignore-error
import emailExistence from 'email-existence'

let router = express.Router();

//---------------function create Token--------------------
const createToken = (user: IUser) => {
  return jwt.sign(
    { user: { id: user._id, email: user.email } },
    `${process.env.SECRET_TEST}`,
    {
      expiresIn: 60 * 15 ,
    }
  );
};

//---------------function create Token--------------------
const refreshToken = (user: IUser, _idToken: string) => {
  return jwt.sign(
    { email: user.email, userTokenId: _idToken },
    `${process.env.SECRET_REFRESH}`,
    {
      expiresIn: "1d",
    }
  );
};

//---------------middleware new User-----------------------------
const middlewareNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password, firstname, lastname, username } = req.body;
    const profileArray = [
      "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p1_anad93.png",
      "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p2_tj88ek.png",
      "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p3_dlphru.png",
      "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p4_zy2yhe.png",
      "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p5_i3n2nd.png",
    ];
    if (!email || !password || !firstname || !lastname || !username) {
      return res
        .status(400)
        .json({ message: "Please, send your email and password" });
    }

    //search if User already exists
    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //password encryption
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    //verify email existence uwu
    // await emailExistence.check(`${email}`, async(err: any, response: boolean) => {
    //   if(!response) {
    //     return res.status(400).json({message: "Email doesn't exists"})
    //   }
    // })
    
    let newUser = new User({
      ...req.body,
      password: hash,
      profilePicture: profileArray[Math.floor(Math.random() * 5)],
    });
    await newUser.save();
    next()
    
  } catch (error) {
    res.json(error);
  }
};

router.get("/logOuterr", (req: Request, res: Response) => {
  res.status(400).json("fallo logOut");
});

//----------------------log up -----------------------------------------------
router.put(
  "/logOut",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/logOuterr",
  }),
  async (req: Request, res: Response) => {
    try {
      let { user }: any = req;
      if (!user) {
        return res.status(400).json("user required");
      }
      await Token.deleteOne({ email: user.email });
      return res.json({});
    } catch (err) {
      res.json(err);
    }
  }
  );

//---------------------------refresh Token---------------------------------------------
router.post("/refresh", async (req: Request, res: Response) => {
  try {

    let currentRefreshToken = req.body.refreshToken;

    let user = await User.findOne({ email: currentRefreshToken.email });

    if (!user) {
      return res.status(400).json("user not register");
    }

    let tokenUser = await Token.findOneAndUpdate(
      { email: currentRefreshToken.email },
      { token: createToken(user as IUser) },
      {new: true}
    ); //actualiza user

    if (!tokenUser) {
      return res.status(400).json("token not exist");
    }

    //---------------le resta 20 minutos a la actua ------------------------------
    let difference: any = new Date().getTime();
    difference = new Date(difference - 60 * 20000);

    //---------------------cada 24 horas ------------------------------------------
    let cookie = " ";

    if(new Date(currentRefreshToken.exp*1000) > difference) {
        cookie = refreshToken(user as IUser, tokenUser._id.toString()); 
    };

    return res.status(200).json();
  } catch (err) {
    return res.json(err);
  }
});


//------------rute register-----------------------------
router.post(
  "/register",
  middlewareNewUser,
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  async (req: Request, res: Response) => {
    //user return of passport strategy
    try {
      let { user } = req;
      console.log(user);
      if (!user) { return res.status(400).json("The user does not exists"); } 
        const send: IUser = user as IUser;

        const mailInfo: mailInfo = {
          title: "New User Registered",
          subject: "Registration",
          message: `<li>Register has been completed successfully</li>`,
        };

        const { message } = await sendMail(mailInfo, send.email);
        console.log(message);
       
        //------------------deleted token-----------------------------
        await Token.deleteOne({ email: send.email });

        let token = new Token({
          email: send.email,
          token: createToken(user as IUser),
        });

        await token.save();

        return res.status(200).json({
          token: refreshToken(user as IUser, token._id.toString()),
          username: send.username,
          _id: send._id,
          profilePicture: send.profilePicture,
          isDeleted: send.isDeleted,
          isAdmin: send.isAdmin,
          isPremium: send.isPremium,
        });

    } catch (error) {
      res.json(error);
    }
  }
);

//route error login
router.get("/login", (req: Request, res: Response) => {
  res.status(400).json("Incorrect email or password.");
});

router.get("/loginjwt", (req: Request, res: Response) => {
  res.status(400).json("Token needed");
});

//-----------------------------login user -----------------------------
/*
  strategy passport local, verify user in database if error redirect route error login
*/
router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  async (req: Request, res: Response) => {
    //user return of passport strategy
    try {
      let { user } = req;
      if (user) {
        const send: IUser = user as IUser;

       //--------------elimina susuario----------------------------
         await Token.deleteOne({ email: send.email });

          let token = new Token({
          email: send.email,
          token: createToken(user as IUser),
        });

        await token.save();

        if (send.isPremium) {
          const date = new Date();
          if (send.expirationDate) {
            if (date > send.expirationDate) {
              const newUser: any = await User.findById(send._id);
              if (newUser) {
                newUser.followers = newUser.followers.concat(newUser.followRequest);
                newUser.isPremium = false;
                newUser.expirationDate = undefined;
                newUser.plan = undefined;
                newUser.isPrivate = false;
                newUser.set({followRequest: []});
                
                await newUser.save();
              }
            }
          }
        }

        let newRefreshtoken = refreshToken(user as IUser, token._id.toString());
   
        return res.status(200).json({
          token: newRefreshtoken,
          username: send.username,
          _id: send._id,
          profilePicture: send.profilePicture,
          isDeleted: send.isDeleted,
          isAdmin: send.isAdmin,
          isPremium: send.isPremium,
        });
        //res.redirect()
      }
      return res.status(400).json("The user does not exists");
    } catch (error) {
      res.json(error);
    }
  }
);

//--------------------------------------login google-------------------------------------
router.get(
  "/loginGoogle",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const user: any = req.user;

      const send: IUser = user as IUser;

      //------------------deleted token-----------------------------
      await Token.deleteOne({ email: send.email });

      let token = new Token({
        email: send.email,
        token: createToken(user as IUser),
      });

      await token.save();

      res.cookie("token", refreshToken(user as IUser, token._id.toString()),{domain:`.socialn.me`, maxAge: 10000});
      return res.redirect(`${process.env.URL_FRONT}`);
    } catch (err) {
      res.status(400).json({ err: "todo salio mal" });
    }
  }
);

//---------------------------facebook---------------------------------
router.get(
  "/loginFacebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const user: any = req.user;

      const send: IUser = user as IUser;

        //------------------deleted token-----------------------------
        await Token.deleteOne({ email: send.email });

        let token = new Token({
          email: send.email,
          token: createToken(user as IUser),
        });
  
        await token.save();

      res.cookie("token", refreshToken(user as IUser, token._id.toString()),{domain:`.socialn.me`, maxAge: 10000});
      return res.redirect(`${process.env.URL_FRONT}`);
    } catch (err) {
      res.status(400).json({ err: "todo salio mal" });
    }
  }
);

//------------------------route data user----------------------------------
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      //-------------extract Authorization from HTTP headers----------------
      const authorization: string[] | undefined =
        req.headers.authorization?.split(" ");

      if (
        !authorization ||
        authorization.length !== 2 ||
        authorization[0].toLocaleLowerCase() !== "bearer"
      ) {
        return res.status(400).json("no token");
      }

      const token = authorization[1];

      //------------------------decode token-----------------------------------
      let verifyToken: any = jwt.verify(
        `${token}`,
        `${process.env.SECRET_REFRESH}`
      );

      if (!verifyToken || !verifyToken.email) {
        res.status(401).json("Invalid Token");
      }

      let { email } = verifyToken;

      const user: any= await User.findOne({ email: `${email}` });
      console.log(user)
      if (!user) {
        return res.status(400).json("Invalid Token");
      }

      let { _id, username, profilePicture, isDeleted, isAdmin, isPremium } = user;

      if (user.isPremium) {
        const date = new Date();
        if (user.expirationDate) {
          if (date > user.expirationDate) {
            user.followers = user.followers.concat(user.followRequest);
            user.isPrivate = false;
            user.isPremium = false;
            user.expirationDate = undefined;
            user.plan = undefined;
            user.set({followRequest: []});

            await user.save();
          }
        }
      }
      return res.status(200).json({
        _id: _id.toString(),
        username,
        profilePicture,
        isDeleted,
        isAdmin,
        isPremium,
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

//-------------------------route test---------------------------------
router.get(
  "/test",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  (req: Request, res: Response) => {
    res.json({ msg: "Todo funciona a la perfeccion" });
  }
);

export default router;
