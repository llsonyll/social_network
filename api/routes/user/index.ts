import  jwt  from 'jsonwebtoken';
import express, { Request, Response } from "express";
import { Comment, Post, User, Review, Chat, Message, Report } from "../../mongoose";
import passport from "passport";
import bcrypt from "bcrypt";

import { mailInfo, sendMail } from "../../utils/nodemailer";
import { IUser } from "../../types";

const router = express.Router();

//-------------------query ?email="user.email"
router.get("/restorePassWord", async (req:Request, res:Response) => {
   try {
      const { email } = req.query;
      if(!email){ return res.status(400).json({ error: "Email not provided" })}
      
      const user: IUser | null = await User.findOne({email: email});

      if (!user){
        return res.status(400).json({
           error: "Email provided does not belong to any registered user",
        });
      }

      const tokenRestore = jwt.sign(
        { id: user._id },
        `${process.env.SECRET_TEST}`,
        {
          expiresIn: 60 * 15 *1000
        }
      );;

      const mailMessage: mailInfo = {
        title: "Password Restored",
        subject: "Password Restoration",
        message: `<li>Follow this link to restore your password: </li>
        <li><a href="${process.env.URL_FRONT}/restore" target="_back" > ${process.env.URL_FRONT}/restore </a></li>`,
        link:"https://www.socialn.me/"
      };
    
      await sendMail(mailMessage, user.email);
      
      return res.status(200).cookie("restorePassword", `${tokenRestore}`,{domain:`.socialn.me`}).json({
        message: "User's email successfully restored",
      });
   } catch (err) {
      res.json(err);
   }
});

// GET "/browser/:username"
router.get(
  "/browser/:username",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      //---------------------find User by username ---> return ([{id,username},{}....])---------------------------
      const users = await User.find(
        { username: new RegExp(`^${username}`, "i") },
        { username: 1, _id: 1, profilePicture: 1 }
      ).limit(4);

      if (!Object.values(users).length) {
        return res.status(400).json({ err: "User not fount" });
      }

      return res.status(200).json(users);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);


router.get(
  "/browserFollowing/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    let { users } = req.query;
    !users ? users="" : null
    try {

      //---------------------find User by username ---> return ([{id,username},{}....])---------------------------
      const user = await User.findById(`${userId}`)
      if(!user) return res.status(404).json({errorMsg: "Who r u?!!!!"})




      const foundUsers = await User.find({username: {
        $regex: users,
        $options: "i"
      }, _id: {$in: user.following}} )
      // .select(['-password', '-chats', '-socketId', '-isAdmin', '-chats', '-paymentsId', ''])
      .select(['_id', 'username', 'profilePicture', 'firstname', 'lastname', 'isPremium', 'isConnected'])
      console.log(foundUsers)
      return res.status(200).json(foundUsers);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);


// GET '/:userId'
router.get(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(`${userId}`)
        // .populate('posts', select['_id', 'likes', 'dislikes', 'content','commentsId'], populate:{path: 'userId', select: ['username', 'likes']} )
        .populate({
          path: "posts",
          select: [
            "content",
            "createdAt",
            "likes",
            "dislikes",
            "_id",
            "commentsId",
            "multimedia",
          ],
          options: { sort: { createdAt: -1 } },
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })
        .populate({
          path: "review",
        })
        .populate('followRequest', ['username', 'profilePicture'])
        .populate({
          path: 'paymentsId',
          select: [
            'paymentId',
            'amount',
            'plan',
            'paymentDate',
            'paymentStatus',
          ]
        })
        .select("-password");
      if (!user) return res.status(404).json({ errorMsg: "who are you?" });
      return res.status(201).json(user);
    } catch (err) {
      res.status(404).json({ errorMsg: err });
    }
  }
);

// PUT "/updatePassword"
router.put(
  "/updatePassword",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword, userId } = req.body;
      if (!oldPassword || !newPassword)
        return res.status(400).json({ error: "Passwords should be provided" });

      const user = await User.findById(userId);

      if (!user)
        return res.status(400).json({
          error: "Email provided does not belong to any registered user",
        });

      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match)
        return res.status(400).json({
          error:
            "Validation error on password you provided as current password",
        });

      const mailMessage: mailInfo = {
        title: "Password Changed",
        subject: "Password Update",
        message: `<li>Your password has been changed successfully</li>`,
      };

      const { message } = await sendMail(mailMessage, user.email);

      //password encryption
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(newPassword, salt);

      user.password = hash;
      await user.save();

      return res.status(200).json({
        message: "User's password updated successfully",
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

// PUT '/:userId'
router.put(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { username, firstname, lastname, biography, profilePicture, coverPicture } =
        req.body;

      if (
        !username &&
        !firstname &&
        !lastname &&
        !biography &&
        biography !== "" &&
        !profilePicture &&
        !coverPicture
      ) {
        return res.status(400).json({ errprMsg: "Please send data" });
      }

      if (req.body.isPremium === false) {
        req.body.plan = undefined;
        req.body.expirationDate = undefined;
      }

      if (req.body.isPremium) {
        req.body.plan = 'weekly';
        
        function sumarDias(fecha: Date, dias: number){
          fecha.setDate(fecha.getDate() + dias);
          return fecha;
        }
        const date = new Date();
        req.body.expirationDate = sumarDias(date, 7);
      }

      const user = await User.findByIdAndUpdate(`${userId}`, req.body, {
        new: true,
      })
        .populate({
          path: "posts",
          select: [
            "content",
            "likes",
            "dislikes",
            "_id",
            "commentsId",
            "createdAt",
            "multimedia",
          ],
          options: { sort: { createdAt: -1 } },
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })
        // .populate('following', 'username')
        // .populate('followers', 'username')
        .select("-password");

      if (!user) return res.status(404).json({ errorMsg: "who are you?" });

      return res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// GET '/home/:userId'
router.get(
  "/home/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    let page = parseInt(`${req.query.page}`);
    let control = req.query.control;
    !control ? (control = "true") : null;
    if (!page) page = 0;

    try {
      const user = await User.findById(`${userId}`);
      if (!user) return res.status(404).json({ errorMsg: "who are you?" });
      const date = new Date().getTime();

      let result: any[] = [];
      const privateUsers = await User.find({isPrivate: true}).select('_id')

      if (user.following.length > 0) {
        if (control === "true") {
          result = await Post.find({
            // userId: { $in: [...user.following, user._id] },
            $or: [{ userId: user._id }, { userId: { $in: user.following } }],
            createdAt: { $gte: new Date(date - 259200000) },
          }) //menos 3 dias
            .sort({ createdAt: -1 })
            .skip(page * 10)
            .limit(10)
            .populate("userId", ["username", "profilePicture"]);
        } else {
          result = await Post.find({
            createdAt: { $gte: new Date(date - 259200000) },
            userId: { $nin: [...user.following, ...privateUsers, user._id] },
          })
          .sort({ createdAt: -1 })
          .skip(page * 10)
          .limit(10)
          .populate("userId", ["username", "profilePicture", "isPrivate"]);
        }
      }

      if (user.following.length === 0) {
        result = await Post.find({
          createdAt: { $gte: new Date(date - 259200000) },
          userId: {$nin: [...privateUsers]}
        })
          .sort({ createdAt: -1 })
          .skip(page * 10)
          .limit(10)
          .populate("userId", ["username", "profilePicture"]);
      }
      res.json(result);
    } catch (err) {
      return res.status(404).json({ errorMsg: err });
    }
  }
);


// POST "/restorePassword"
router.post("/restorePassword", async (req: Request, res: Response) => {
  try {
    const { tokenRestore, password } = req.body;
   
    if (!password) return res.status(400).json({ error: "password not provided" });
    
    if(!tokenRestore) return res.status(400).json({error: "token restored expired"})

    let userId: any = jwt.verify(`${tokenRestore}`,`${process.env.SECRET_TEST}`);

    if(!userId.id) return res.status(400).json({error: "token restored invalid"});

    //password encryption
    let salt =  await bcrypt.genSalt(10);
    let hash =  await bcrypt.hash(`${password}`, salt);

    const user = await User.findByIdAndUpdate(`${userId.id}`,{
        password: hash
    },{new: true});
   
    if (!user)
      return res.status(400).json({
        error: "userId  does not registered user",
      });


    const mailMessage: mailInfo = {
      title: "Password Restored",
      subject: "Password Restoration",
      message: `<li>Your password was restored!</li>
      <li>Your new Password is: <strong>${password}</strong></li>`,
    };

    await sendMail(mailMessage, user.email);
 
    return res.status(200).json({
      message: "User's password successfully restored",
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});



// PUT "/follow/:userId/:userIdFollowed"
router.put(
  "/follow/:userId/:userIdFollowed",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId, userIdFollowed } = req.params;

    try {
      const user: any = await User.findById(`${userId}`); // usuario
      const userFollowed: any = await User.findById(`${userIdFollowed}`); // usuario seguido
      if (!user || !userFollowed)
        return res.status(404).json({ error: "some user doesn't exists" });
      if (user.email === userFollowed.email)
        return res.status(404).json({ error: "No te podes autoseguir capo" });

      if (
        user.following.includes(userFollowed._id) ||
        userFollowed.followers.includes(user._id)
      ) {
        await User.updateOne(
          { _id: user._id },
          {
            $pull: {
              following: userFollowed._id,
            },
          },
          { new: true }
        );
        await User.updateOne(
          { _id: userFollowed._id },
          {
            $pull: {
              followers: user._id,
            },
          },
          { new: true }
        );
      } else if (userFollowed.isPrivate) {
        if (userFollowed.followRequest.includes(user._id)) {
          await User.updateOne(
            { _id: userFollowed._id },
            {
              $pull: {
                followRequest: user._id,
              },
            },
            { new: true }
          );
        } else {
          userFollowed.followRequest.push(user._id);
        }

        await userFollowed.save();
      } else {
        // user.following.push(userFollowed._id);
        await User.findOneAndUpdate({_id: user._id},{
          $addToSet:{
              following: userFollowed._id
          }
      })
        await user.save();
        // userFollowed.followers.push(user._id);
        await User.findOneAndUpdate({_id: userFollowed._id},{
          $addToSet:{
            followers: user._id
          }
      })
        await userFollowed.save();
      }

      const userFollowedUpdated: any = await User.findById(userFollowed._id);
      return res
        .status(200)
        .json({
          followers: userFollowedUpdated.followers,
          followRequest: userFollowedUpdated.followRequest,
        });
    } catch (err) {
      return res.status(404).json({ errorMsg: err });
    }
  }
);

//ruta para borrar la cuenta de un usuario
router.put("/deleted/:userId", passport.authenticate("jwt", { session: false, failureRedirect: "/auth/loginjwt", }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      let user = await User.findOneAndUpdate({_id: `${userId}`}, {
        $set: {
          posts: [],
          following: [],
          followers: [],
          followRequest: []
        }
      }, { new: true });
      if (!user) return res.status(404).json('User not found');

      const posts = await Post.find({userId: user._id});
      for (let i = 0; i < posts.length; i ++) {
        await Comment.deleteMany({_id: {$in: posts[i].commentsId}});
      }
      await Post.deleteMany({ userId: user._id });
      await Post.updateMany({}, {
        $pull: {
          likes: `${user._id}`,
          dislikes: `${user._id}`,
        }
      });
      await User.updateMany({}, {
        $pull: {
          following: `${user._id}`,
          followers: `${user._id}`,
          followRequest: `${user._id}`}
      });
      await Review.deleteOne({ userId: user._id });

      const generateRandomString = (num: number) => {
        let result: string = Math.random().toString(36).substring(0, num);
        return result;
      };
      const trashEmail = generateRandomString(Math.random() * 10 + 6);

      user.profilePicture = 'https://recursoshumanostdf.ar/download/multimedia.normal.83e40515d7743bdf.6572726f725f6e6f726d616c2e706e67.png';
      user.username = 'User eliminated';
      user.email = trashEmail + '/ ' + user.email; // SE AGREGA BASURA AL EMAIL. EL USUARIO PODRÁ VOLVER A HACERSE UNA CUENTA CON EL MISMO EMAIL EN EL FUTURO
      user.isDeleted = true;
      user.isAdmin = false;
      user.isPremium = false;
      user.isPrivate = false;
      user.birthday = undefined;
      user.biography = undefined;
      user.review = undefined;
      user.plan = undefined;
      user.expirationDate = undefined;

      await user.save();
      await Report.deleteMany({userReportedId: {_id: user._id}});

      return res.status(200).json('Deleted successfully');
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
);

// -------------- PUT /acceptFollow/:userId/:userRequestingId --- Aceptar solicitud de seguimiento ------------------
router.put(
  "/acceptFollow/:userId/:userRequestingId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { userId, userRequestingId } = req.params;

      const userRequesting = await User.findById(`${userRequestingId}`);
      if (!userRequesting)
        return res.status(404).json({ msg: "User requesting not found" });

      const user = await User.findOneAndUpdate(
        { _id: `${userId}` },
        {
          $pull: {
            followRequest: `${userRequesting._id}`,
          },
        },
        { new: true }
      ).populate('followRequest',['username','profilePicture']);
      if (!user) return res.status(404).json({ msg: "User not found" });
      user.followers.push(`${userRequesting._id}`);
      await user.save();

      userRequesting.following.push(user._id);
      await userRequesting.save();

      // user = await user
      // .populate()

      return res.json({
        followers: user.followers,
        followRequest: user.followRequest,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

// -------------- PUT /cancelFollow/:userId/:userRequestingId --- Cancelar solicitud de seguimiento ------------------
router.put(
  "/cancelFollow/:userId/:userRequestingId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { userId, userRequestingId } = req.params;

      const userRequesting = await User.findById(`${userRequestingId}`);
      if (!userRequesting)
        return res.status(404).json({ msg: "User requesting not found" });

      const user = await User.findOneAndUpdate(
        { _id: `${userId}` },
        {
          $pull: {
            followRequest: `${userRequesting._id}`,
          },
        },
        { new: true }
      ).populate('followRequest',['username','profilePicture']);
      if (!user) return res.status(404).json({ msg: "User not found" });

      await user.save();

      return res.json({
        followers: user.followers,
        followRequest: user.followRequest,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

router.get('/following/:userId', passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/auth/loginjwt",
}),
async (req: Request, res: Response) => {
  try {
      let userId = req.params.userId;
      let user: any = await User.findById(`${userId}`)
                      .populate("following",['_id','username','profilePicture']);
       
      if(!user){ return res.status(400).json('not following')}

      res.status(200).json(user.following);
  } catch (err) {
    res.status(400).json(err)
  }
})

router.get('/followers/:userId', passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/auth/loginjwt",
}),
async (req: Request, res: Response) => {
  try {
      let userId = req.params.userId;
      let user: any = await User.findById(`${userId}`)
                      .populate("followers",['_id','username','profilePicture']);
       
      if(!user){ return res.status(400).json('not followers')}

      res.status(200).json(user.followers);
  } catch (err) {
    res.status(400).json(err)
  }
})

export default router;
