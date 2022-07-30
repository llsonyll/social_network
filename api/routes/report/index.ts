import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment,  } from '../../mongoose';

const router = express.Router()

router.post('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body; // REPORTED VA A ACEPTAR 3 VALORES: COMMENT, POST Y USER

        if (reported === 'comment') {
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                commentReportedId: reportId, // como string o buscarlo y ponerlo como objectid
                reason
            });
        } else if (reported === 'post') {
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                postReportedId: reportId, // como string o buscarlo y ponerlo como objectid
                reason
            });
        } else {
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                userReportedId: reportId, // como string o buscarlo y ponerlo como objectid
                reason
            });
        }
        
        if (!report) return res.status(401).json({msg: 'Reported fails'});

        await report.save();

        return res.status(201).json({msg: 'Reported successfully'});
    } catch (error) {
        return res.status(400).json(error);
    }
});


router.get('/', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {

const {type} = req.query


try{
    let reports: any[] = []
    if(!type) {
        reports = await Report.find({})
    }
    if(type === "postReportedId") {
        reports = await Report.find({postReportedId: {$exists: true} })
    } if(type==="commentReportedId") {
        reports = await Report.find({commentReportedId: {$exists: true}})
    } if(type==="userReportedId") {
        reports = await Report.find({userReportedId: {$exists: true}})
    }

    res.json(reports)

} catch(err) { 
    res.status(400).json({errMsg: err})
}

})


export default router;
