// COPIEN TODO EL CODIGO Y LO EJECUTAN EN LA CONSOLA DE CHROME, LUEGO AL OBJETO QUE APAREZCA LE DAN CLICK DERECHO Y COPIAR, LO PEGAN DONDE QUIERAN Y YA

let x = Math.random()

//Math.round(num * 100) / 100

let arrOfPosts = []

for (let i = 0; i < 20; i++) {
	x = x + 1
	arrOfPosts.push({
		_id: 2 + x,
		userId: {
			_id: 3334533 + x,
			username: 'pepe',
		},
		content: 'blablabla',
		comments: [
			{
				_id: 312663 + x,
				userId: {
					_id: 236784 + x,
					username: 'aaaaaa',
				},
				content: 'Me encantó tu post!!!!',
			},
			{
				_id: 32109 + x,
				userId: {
					_id: 12267 + x,
					username: 'cccccc',
				},
				content: 'Como desveo esta cosa?',
			},
		],
		likes: [
			{
				_id: 23864657 + x,
				username: 'aaaaaa',
			},
		],
		dislikes: [
			{
				_id: 126782 + x,
				username: 'cccccc',
			},
		],
	})
}

console.log(arrOfPosts)
