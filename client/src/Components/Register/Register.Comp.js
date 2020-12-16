import React, { Fragment, useState } from 'react';
import { useForm } from '../Hooks/useForm';
import Axios from 'axios';
import './Register.Comp.css';

function Register() {
	const [ Error, setError ] = useState('');
	const [ values, handleChange ] = useForm({
		name: '',
		username: '',
		email: '',
		password: ''
	});

	const Register = () => {
		Axios.post('http://localhost:5000/user/register', values, { withCredentials: true })
		.then((res) => {
			console.log(res);
			if (!res.data.err) {
				window.location = '/projects';
				
			} else {
				setError(res.data.msg)
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

	return (
		<div className="register">
		<p style={{ color: 'red' }}>{Error}</p>
			<Fragment>

				<div className="left">

					<h1 className="logo">LOGO</h1>

					<div className="centerbox">

						<label htmlFor="nameId">Full name</label>
						<input id="nameId" name="name" placeholder="Julia Roberts" value={values.name} onChange={handleChange} />

						<br/><br/>

						<label htmlFor="usernameId">Username</label>
						<input id="usernameId" name="username" placeholder="Username" value={values.username} onChange={handleChange} />

						<br/><br/>

						<label htmlFor="emailId">Email address</label>
						<input id="emailId" name="email" placeholder="Enter email address" value={values.email} onChange={handleChange} />

						<br/><br/>

						<label htmlFor="passwordId">Create password</label>
						<input id="passwordId" type="password" placeholder="Password" name="password" value={values.password} onChange={handleChange} />

						<div className="login-bottom">

						<button className="btn btn_primary" onClick={Register}>
						Register
						</button>

							<a href="/Login">Sign in</a>
						</div>
						<div className="terms">
							<p>by signing up, you agree to our <a href="">Terms & Conditions</a></p>
						</div>
					</div>

				</div>

				<div className="right">
					<h1 className="greeting">
						Improve your<br></br> workflow today!
					</h1>

				</div>


			</Fragment>
		</div>
	);
}

export default Register;
