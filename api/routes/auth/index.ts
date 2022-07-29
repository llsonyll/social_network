import express, { Response, Request, NextFunction } from "express";
import { IUser } from "./../../types/index";
import { User, Token } from "../../mongoose";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { createTransport } from "nodemailer";

let router = express.Router();

//---------------function create Token--------------------
const createToken = (user: IUser) => {
  return jwt.sign(
    { user: { id: user._id, email: user.email } },
    `${process.env.SECRET_TEST}`,
    {
      expiresIn: 60 * 1 ,
    }
  );
};

//---------------function create Token--------------------
const refreshToken = (user: IUser, _idToken: string) => {
  //solo guarda email
  return jwt.sign(
    { email: user.email, userTokenId: _idToken },
    `${process.env.SECRET_REFRESH}`,
    {
      expiresIn: 60 * 22//"1d",
    }
  );
};

const cookie = (res:Response) => {
    res.cookie("token","holamundo",{
      httpOnly:true,
    })
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

    //create new User
    let newUser = new User({
      ...req.body,
      password: hash,
      profilePicture: profileArray[Math.floor(Math.random() * 5)],
    });

    await newUser.save();

    //res.status(201).json(newUser);
    next();
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
    
    if(new Date(currentRefreshToken.exp*1000) > difference) {
      // return res.("token", `hola`,{
      //    httpOnly: true
      // });
      cookie(res);
    };
    return res.status(200).json({tokenUser});
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

      if (user) {
        const send: IUser = user as IUser;

        const transporter = createTransport({
          service: "gmail",
          auth: {
            user: "vavatyni@gmail.com",
            pass: "nlsbenyeedlvxfhb",
          },
        });

        const output = `
          <p>You have a new message from SN</p>
          <h3>New User</h3>
          <ul>  
            <li>Register has been completed successfully</li>
          </ul>
          <h3>Message</h3>
          <p>Usuario creado satisfactoriamente, procede a ingresar a nuestra plataforma <a href="https://finaldeploy-tau.vercel.app" target="_blank"> </a></p>
        `;

        const mailOptions = {
          from: "Social Network <vavatyni@gmail.com>",
          to: send.email,
          subject: "Social Network registration",
          html: output,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        //--------------elimina susuario----------------------------
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
        });
        //res.redirect()
      }
      return res.status(400).json("The user does not exists");
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

        let refreshtoken = refreshToken(user as IUser, token._id.toString());
        console.log(token._id);
        return res.status(200).json({
          token: refreshtoken,
          username: send.username,
          _id: send._id,
          profilePicture: send.profilePicture,
        });
        //res.redirect()
      }
      return res.status(400).json("The user does not exists");
    } catch (error) {
      res.json(error);
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

      const user: IUser | null = await User.findOne({ email: `${email}` });

      if (!user) {
        return res.status(400).json("Invalid Token");
      }

      let { username, profilePicture, _id } = user;

      return res
        .status(200)
        .json({ _id: _id.toString(), username, profilePicture });
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
