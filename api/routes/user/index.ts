import express, { Request, Response } from "express";
import { Comment, Post, User } from "../../mongoose";
import passport from "passport";
import bcrypt from "bcrypt";

import { mailInfo, sendMail } from "../../utils/nodemailer";
import { IUser } from "../../types";

const router = express.Router();

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

			return res.status(200).json(users)
		} catch (err) {
			res.status(400).json(err)
		}
	}
)

router.get(
	'/home/:userId',
	passport.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }),
	async (req: Request, res: Response) => {
		const { userId } = req.params
		let page = parseInt(`${req.query.page}`)

		if (!page) page = 0

		try {
			const user = await User.findById(`${userId}`)
			if (!user) return res.status(404).json({ errorMsg: 'who are you?' })

			if (user.following.length === 0) {
				const posts = await Post.find({})
					.sort({ createdAt: -1 })
					.skip(page * 20)
					.limit(20)
                    .populate('userId', ['username', 'profilePicture'])
				res.json(posts)
			}
			//  else {

			//si el usuario sigue a otros usuarios

			// }
		} catch (err) {
			return res.status(404).json({ errorMsg: err })
		}
	}
)

router.get(
	'/:userId',
	passport.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }),
	async (req: Request, res: Response) => {
		const { userId } = req.params

		try {
			const user = await User.findById(`${userId}`)
				// .populate('posts', select['_id', 'likes', 'dislikes', 'content','commentsId'], populate:{path: 'userId', select: ['username', 'likes']} )
				.populate({
					path: 'posts',
					select: ['content', 'createdAt', 'likes', 'dislikes', '_id', 'commentsId', 'multimedia'],
					options: {sort: {'createdAt': -1 } },
					populate: { path: 'userId', select: ['username', 'profilePicture'] },
				})

				//.populate('following', 'username')
				//.populate('followers', 'username')
				.select('-password')
			if (!user) return res.status(404).json({ errorMsg: 'who are you?' })
			return res.status(201).json(user)
		} catch (err) {
			res.status(404).json({ errorMsg: err })
		}
	}
)


router.put('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    try{
        const {userId} = req.params
        const {username, firstname, lastname, biography, profilePicture } = req.body
        
        if(!username && !firstname && !lastname && (!biography && biography !== '') && !profilePicture){
            return res.status(400).json({errprMsg: 'Please send data'})
        }

        const user = await User.findByIdAndUpdate(`${userId}`, req.body, {new: true})
        .populate({
			path: 'posts',
			select: ['content', 'likes', 'dislikes', '_id', 'commentsId','createdAt', 'multimedia'],
			options: {sort: {'createdAt': -1 } }, 
			populate:{path: 'userId', select: ['username', 'profilePicture']}
		})
        // .populate('following', 'username')
        // .populate('followers', 'username')
        .select("-password")

        if(!user) return res.status(404).json({errorMsg: "who are you?"})
        
        
      return res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.get(
  "/home/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    let page = parseInt(req.query.page as string);
    if (!page) page = 0;

    try {
      const user = await User.findById(`${userId}`);
      if (!user) return res.status(404).json({ errorMsg: "who are you?" });

      if (user.following.length === 0) {
        const posts = await Post.find({})
          .sort({ createdAt: -1 })
          .skip(page * 20)
          .limit(20)
          .populate("userId", ["username", "profilePicture"]);
        res.json(posts);
      } else {
        const posts = await Post.find({})
          .sort({ createdAt: -1 })
          .skip(page * 20)
          .limit(20)
          .populate("userId", ["username", "profilePicture"]);
        res.json(posts);
      }
    } catch (err) {
      return res.status(404).json({ errorMsg: err });
    }
  }
);

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
          ],
          options: { sort: { createdAt: -1 } },
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })

        //.populate('following', 'username')
        //.populate('followers', 'username')
        .select("-password");
      if (!user) return res.status(404).json({ errorMsg: "who are you?" });
      return res.status(201).json(user);
    } catch (err) {
      res.status(404).json({ errorMsg: err });
    }
  }
);

// Recovery Password
router.post("/restorePassword", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email not provided" });
    const [user] = await User.find({ email: email });

    if (!user)
      return res.status(400).json({
        error: "Email provided does not belong to any registered user",
      });

    const dummyPassword = "abcde12345";

    const mailMessage: mailInfo = {
      title: "Password Restored",
      subject: "Password Restoration",
      message: `<li>Your password has been restored to a dummy value, you should change it quickly as possible, because its not safe now</li>
      <li>New Password: <strong>${dummyPassword}</strong></li>`,
    };

    const { message } = await sendMail(mailMessage, user.email);
    console.log(message);

    //password encryption
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(dummyPassword, salt);

    user.password = hash;
    await user.save();

    return res.status(200).json({
      message: "Successfully user's password restored",
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});

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

router.put(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { username, firstname, lastname, biography } = req.body;

      if (
        !username &&
        !firstname &&
        !lastname &&
        !biography &&
        biography !== ""
      ) {
        return res.status(400).json({ errprMsg: "Please send data" });
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
          ],
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })
        .populate("following", "username")
        .populate("followers", "username")
        .select("-password");

      if (!user) return res.status(404).json({ errorMsg: "who are you?" });

      return res.json(user);
    } catch (err) {
      res.status(400).json({ errorMsg: err });
    }
  }
);

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
      } else {
        user.following.push(userFollowed._id);
        await user.save();
        userFollowed.followers.push(user._id);
        await userFollowed.save();
      }

      const userFollowedUpdated: any = await User.findById(userFollowed._id);
      return res.status(200).json(userFollowedUpdated.followers);
    } catch (err) {
      return res.status(404).json({ errorMsg: err });
    }
  }
);

export default router;
