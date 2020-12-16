import React, { Fragment, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../Context/Project.Context';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AssignmentForm.Comp.css';
import Axios from 'axios';

function AssignmentForm() {
	const { id: projectid } = useParams();
	
	const context = useContext(ProjectContext);
	const [ assignmentForm ] = context.assignmentForm;

	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ priority, setPriority ] = useState(0);
	const [ status, setStatus ] = useState(0);
	const [ deadline, setDeadline ] = useState(new Date());

	useEffect(
		() => {
			setName(assignmentForm.assignment.name);
			setDescription(assignmentForm.assignment.description);
			setPriority(assignmentForm.assignment.priority);
			setStatus(assignmentForm.assignment.status);
			setDeadline(new Date(assignmentForm.assignment.deadline));
		},
		[ assignmentForm ]
	);

	function createAssignment() {
		const assigmentObj = {
			_id: assignmentForm.assignment._id ? assignmentForm.assignment._id : null,
			name: name,
			description: description,
			priority: priority,
			status: status,
			deadline: deadline
		};

		Axios.post(`http://localhost:5000/group/add/assignment/${projectid}/${assignmentForm.id}`, assigmentObj, {
			withCredentials: true
		})
			.then((result) => {
				context.getProject(projectid);
				setForm();
				console.log(result);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function deleteAssignment() {
		Axios.delete(`http://localhost:5000/group/delete/assignment/${projectid}/${assignmentForm.id}/${assignmentForm.assignment._id}`, {withCredentials: true})
		.then((result) => {
			context.getProject(projectid);
			setForm();
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	function setForm() {
		context.setForm(null, false, context.emptyAsignment);
	}

	return (
		<Fragment>
			<div className="assignmentForm" onClick={() => setForm()} />
			<div className="assignmentForm__form">
				<h2>Assignment form</h2>
				<label htmlFor="name">Name</label>
				<input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
				<br />
				<label htmlFor="description">Description</label>
				<textarea
					name="description"
					id="description"
					cols="30"
					rows="5"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<br />
				<label htmlFor="priority">Priority</label>
				<br />
				<select name="priority" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
					<option value="0">Low</option>
					<option value="1">Medium</option>
					<option value="2">High</option>
					<option value="3">Critical</option>
				</select>
				<br />
				<label htmlFor="status">Status</label>
				<br />
				<select name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="0">Not started</option>
					<option value="1">Working on it</option>
					<option value="2">Waiting for review</option>
					<option value="3">Approved</option>
					<option value="4">Done</option>
					<option value="5">Stuck</option>
				</select>
				<br />
				<label htmlFor="deadline">Deadline</label>
				<Datepicker id="deadline" selected={deadline} onChange={(deadline) => setDeadline(deadline)} />
				<button className="btn btn_primary" onClick={() => createAssignment()}>
					Submit Assignment
				</button>
				<button className="btn btn_warning" style={assignmentForm.assignment._id ? {display: "inline-block", marginLeft:"10px"} : {display: "none"} } onClick={() => {
								if (
									window.confirm(
										"Are you sure want to delete this assignment?"
									)
								)
								deleteAssignment();
							}}>
					Delete
				</button>
			</div>
		</Fragment>
	);
}

export default AssignmentForm;
