import Axios from 'axios';
import { verify } from 'jsonwebtoken';
import React from 'react';

function user({ user, id, deleteuser }) {
	return (
		<tr>
			<td>{user.User.username}</td>
			<td>
				<button
					onClick={() => {
						deleteuser(user);
					}}
					className="btn btn_warning"
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

export default user;
