const objects = {}

let x = 1

let arrOfUsers = []

for (let i = 0; i < 20; i++) {
	x = x + 1
	arrOfUsers.push({
		_id: 111 + x,
		username: 'Username' + x,
		email: 'aa@gmail.com' + x,
		firstname: 'Firstname',
		lastname: 'Lastname',

		posts: [
			{
				_id: 222 + x,
				userId: 333 + x,
				content: 'Contenido del post Contenido del postContenido del postContenido del postContenido del post',
				commentsId: 'Comentario Comentario Comentario Comentario Comentario ',
				likes: 444 + x,
				dislikes: 555 + x,
			},
		],
		following: [
			{
				_id: 666 + x,
				username: 'Username' + x,
			},
			{
				_id: 777 + x,
				username: 'Username' + x,
			},
		],
		followers: [
			{
				_id: 666 + x,
				username: 'Username' + x,
			},
			{
				_id: 777 + x,
				username: 'Username' + x,
			},
		],
		isAdmin: false,
		isPrivate: false,
		isPremium: false,
		birthday: '01/01/1990',
		isConnected: true,
		biography: 'Este usuario es una invencion de la imaginacion de los desarrolladores',
		review: 'reviewreviewreviewreviewreviewreviewreviewreviewreviewreviewreviewreview',
	})
}

console.log(arrOfUsers)
