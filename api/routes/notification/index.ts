import { INotification, IUser } from './../../types/index';
import express, {Request,Response} from 'express';
import passport from 'passport';
import { Notification, User } from '../../mongoose';


const router = express.Router()





router.post('/:fromId/:toId',  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {

    const {fromId, toId} = req.params;

    const {content, type, refId} = req.body;

    try{
        const from: IUser | null= await User.findById(`${fromId}`)
        const to: IUser | null= await User.findById(`${toId}`)
        if(!from || !to) return res.status(404).json({errorMsg: "Missing data !!!!"})
        const notification = new Notification({
            from: from._id,
            to: to._id,
            refId: refId,
            type: type,
            content: content, 
            seen: false,
        })
        return res.json({msg: "Notification posted successfully", notification})
    } catch(err) {
        return res.status(400).json({errorMsg: err})
    }


  })





export default router