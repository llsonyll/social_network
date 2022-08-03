import { INotification, IUser } from './../../types/index';
import express, { Request, Response } from 'express';
import passport from 'passport';
import { Notification, User } from '../../mongoose';


const router = express.Router()





router.post('/:fromId/:toId', passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}),
    async (req: Request, res: Response) => {

        const { fromId, toId } = req.params;

        const { content, type, refId } = req.body;

        try {
            const from: IUser | null = await User.findById(`${fromId}`)
            const to: IUser | null = await User.findById(`${toId}`)
            if (!from || !to) return res.status(404).json({ errorMsg: "Missing data !!!!" })
            const notification = new Notification({
                from: from._id,
                to: to._id,
                refId: refId,
                type: type,
                content: content,
                seen: false,
            })
            await notification.save()
            return res.json({ msg: "Notification posted successfully", notification })
        } catch (err) {
            return res.status(400).json({ errorMsg: err })
        }
    })



router.get('/:userId', passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}),
    async (req: Request, res: Response) => {

        const { userId } = req.params;

        try {
            const user: IUser | null = await User.findById(`${userId}`)
            if (!user) return res.status(404).json({ errorMsg: "Wtf who are you men?" })
            const notifications = await Notification.find({ to: user._id })

            return res.send(notifications)
        } catch (err) {
            return res.status(400).json({ errorMsg: err })
        }
    })


router.put('/seen/:userId', passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}),
    async (req: Request, res: Response) => {
        const { userId } = req.params
        const date = new Date().getTime();
        try {
            const user: IUser | null = await User.findById(`${userId}`)
            if (!user) return res.status(404).json({ errorMsg: "Wtf who are you?" })
            const seenNotifications = await Notification.updateMany(
                { to: user._id },
                { $set: { seen: true } },
                { new: true })

            const deleted = await Notification.deleteMany({ to: user._id, createdAt: { $lt: new Date(date - 259200000) }, seen: true })

            const updatedNotifications = await Notification.find({ to: user._id })

            return res.send(updatedNotifications)

        } catch (err) {
            res.status(400).json({ errorMsg: err })
        }

    })

export default router