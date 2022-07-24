import express, { Response, Request, NextFunction } from 'express'
import { IUser } from './../../types/index'
import { User } from '../../mongoose'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'

let router = express.Router()

//---------------function create Token--------------------
const createToken = (user: IUser) => {
	return jwt.sign({ user: { id: user._id, email: user.email } }, `${process.env.SECRET_TEST}`)
}

//---------------middleware new User-----------------------------
const middlewareNewUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { email, password, firstname, lastname, username } = req.body
		const profileArray = [
			'https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p1_anad93.png',
			'https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p2_tj88ek.png',
			'https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p3_dlphru.png',
			'https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p4_zy2yhe.png',
			'https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p5_i3n2nd.png'
		]
		if (!email || !password || !firstname || !lastname || !username) {
			return res.status(400).json({ message: 'Please, send your email and password' })
		}

		//search if User already exists
		let user = await User.findOne({ email: email })

		if (user) {
			return res.status(400).json({ message: 'User already exists' })
		}

		//password encryption
		let salt = await bcrypt.genSalt(10)
		let hash = await bcrypt.hash(password, salt)

		//create new User
		let newUser = new User({ ...req.body, password: hash , profilePicture: profileArray[Math.floor(Math.random() * 5)]})

		await newUser.save()

		//res.status(201).json(newUser);
		next()
	} catch (error) {
		res.json(error)
	}
}

//------------rute register-----------------------------
router.post(
	'/register',
	middlewareNewUser,
	passport.authenticate('local', { session: false, failureRedirect: '/auth/login' }),
	async (req: Request, res: Response) => {
		//user return of passport strategy
		try {
			let { user } = req

			if (user) {
				const send: IUser = user as IUser
				return res
					.status(200)
					.json({ token: createToken(user as IUser), username: send.username, _id: send._id })
				//res.redirect()
			}
			return res.status(400).json('The user does not exists')
		} catch (error) {
			res.json(error)
		}
	}
)

//route error login
router.get('/login', (req: Request, res: Response) => {
	res.status(400).json('Incorrect email or password.')
})
router.get('/loginjwt', (req: Request, res: Response) => {
	res.status(400).json('Token needed')
})

//-----------------------------login user -----------------------------
/*
  strategy passport local, verify user in database if error redirect route error login
*/
router.post(
	'/login',
	passport.authenticate('local', { session: false, failureRedirect: '/auth/login' }),
	async (req: Request, res: Response) => {
		//user return of passport strategy
		try {
			let { user } = req
			if (user) {
				const send: IUser = user as IUser
				return res
					.status(200)
					.json({ token: createToken(user as IUser), username: send.username, _id: send._id , profilePicture: send.profilePicture})
				//res.redirect()
			}
			return res.status(400).json('The user does not exists')
		} catch (error) {
			res.json(error)
		}
	}
)

//------------------------route data user----------------------------------
router.post(
	'/',
	passport.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }),
	async (req: Request, res: Response) => {
		try {
			//-------------extract Authorization from HTTP headers----------------
			const authorization: string[] | undefined = req.headers.authorization?.split(' ')

			if (!authorization || authorization.length !== 2 || authorization[0].toLocaleLowerCase() !== 'bearer') {
				return res.status(400).json('no token')
			}

			const token = authorization[1]

			//------------------------decode token-----------------------------------
			let verifyToken: any = jwt.verify(`${token}`, `${process.env.SECRET_TEST}`)

			if (!verifyToken || !verifyToken.user) {
				res.status(401).json('Invalid Token')
			}

			let { id } = verifyToken.user

			const user: IUser | null = await User.findById(`${id}`)

			if (!user) {
				return res.status(400).json('Invalid Token')
			}

			let { username, profilePicture } = user

			return res.status(200).json({ _id: id, username , profilePicture})
		} catch (err) {
			return res.status(400).json(err)
		}
	}
)

//-------------------------route test---------------------------------
router.get(
	'/test',
	passport.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }),
	(req: Request, res: Response) => {
		res.json({ msg: 'Todo funciona a la perfeccion' })
	}
)

export default router
