import React, { Fragment, useState } from 'react';
import { useForm } from '../Hooks/useForm';
import Axios from 'axios';
import './Login.Comp.css';

function Login() {
	const [ Error, setError ] = useState('');
	const [ values, handleChange ] = useForm({ email: '', password: '' });

	const Login = () => {
		Axios.post('http://localhost:5000/user/login', values, { withCredentials: true })
			.then((res) => {
				console.log(res);
				if (!res.data.err) {
					window.location = '/projects';
				} else {
					setError(res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="login">
			<p style={{ color: 'red' }}>{Error}</p>
			<Fragment>
				<div className="left">

					<h1 className="logo">LOGO</h1>

					<div className="centerbox">
						<label htmlFor="emailId">Email</label>
						<input id="emailId" name="email" placeholder="Enter email adress" value={values.email} onChange={handleChange} />

						<br/><br/>
						<label htmlFor="passwordId">Password</label>
						<input id="passwordId" type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} />
						<br/><br/>
						<div className="login-bottom">
							<button className="btn btn_primary" onClick={Login}>
								Login
							</button>

							<a href="/Register">sign up</a>
						</div>
					</div>

				</div>

				<div className="right">
					<h1 className="greeting">
						Welcome back! <br></br> glad to see you.
					</h1>

				</div>
			</Fragment>
		</div>
	);
}

export default Login;
