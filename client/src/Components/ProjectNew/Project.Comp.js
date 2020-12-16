import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../Context/Project.Context';
import AssignmentForm from '../ProjectNew/AssignmentForm.Comp';
import Axios from 'axios';
import Group from '../ProjectNew/Group.Comp';
import './Project.Comp.css';

function Project() {
	const { id: projectid } = useParams();

	const context = useContext(ProjectContext);
	const [ assignmentForm ] = context.assignmentForm;
	const [ project ] = context.project;
	const [ hasError ] = context.hasError;

	useEffect(() => {
		context.getProject(projectid);
	}, []);

	return (
		<div className="project">
			<div style={assignmentForm.display ? { display: 'flex' } : { display: 'none' }}>
				<AssignmentForm />
			</div>

			<h1>{project.name}</h1>

			<a className="btn btn_primary" style={{ float: 'right' }} href={'/editproject/adduser/' + projectid}>Add user</a>
			<GroupForm />

			{hasError.error ? <p>{hasError.msg}</p> : null}		

			{project.groups.length === 0 ? (
				<p>No groups found</p>
			) : (
				project.groups.map((group) => <Group key={group._id} group={group} />)
			)}
		</div>
	);
}

function GroupForm() {
	const { id: projectid } = useParams();

	const context = useContext(ProjectContext);
	const [ name, setName ] = useState('');
	function createGroup() {
		Axios.post(`http://localhost:5000/group/add/${projectid}`, { name: name }, { withCredentials: true })
			.then((res) => {
				context.getProject(projectid);
			})
			.catch((err) => console.log(err));
	}

	return (
		<div className="groupForm">
			<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" />
			<button className="btn btn btn btn btn btn_primary" onClick={createGroup}>
				Create Group
			</button>
		</div>
	);
}

export default Project;
