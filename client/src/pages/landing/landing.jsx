import './landing.css'

const Landing = () => {
	return (
		<div className='landing_container'>
			<form action=''>
				<h1> Sn</h1>
				<div className='input_container'>
					<div>
						<button>Sign in</button>
						<button>Register</button>
					</div>
					<div>
						<label htmlFor=''>Email:</label>
						<input type='text' name='' id='' />
					</div>
					<div>
						<label htmlFor=''>Password:</label>
						<input type='password' name='' id='' />
					</div>
					<button class='on' type='submit'>
						Sign in
					</button>
				</div>
			</form>
			<div className='sn_review'>
				<h3>Sundar Pichai</h3>
				<p>"This is the app that I've found to create long lasting relationships"</p>
			</div>
		</div>
	)
}

export default Landing
