import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSortableData } from '../Hooks/useSortableData';
import { ProjectContext } from '../../Context/Project.Context';
import { toShortFormat } from './modules/toShortFormat';
import './Group.Comp.css';
import Axios from 'axios';

function Group({ group }) {
	const context = useContext(ProjectContext);
	const { items, requestSort, sortConfig } = useSortableData(group.assignments);
	const { id: projectid } = useParams();

	const getClassNamesFor = (name) => {
		if (!sortConfig) {
			return;
		}

		return sortConfig.key === name ? sortConfig.direction : undefined;
	};

	function deleteGroup() {
		Axios.delete(`http://localhost:5000/group/delete/${projectid}/${group._id}`, {withCredentials: true})
		.then((result) => {
			context.getProject(projectid);
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	function setForm() {
		context.setForm(group._id, true, context.emptyAsignment);
	}

	return (
		<div className="group">
			<div className="group__header">
				<h2 className="group__headline">{group.name}:</h2>
				<button className="btn btn_primary group__newAssignment" onClick={() => setForm()}>
					New assignment
				</button>
				<button className="btn btn_warning" onClick={() => {
								if (
									window.confirm(
										"Are you sure want to delete this assignment?"
									)
								)
								deleteGroup();
							}}>
					Delete
				</button>				
			</div>

			{group.assignments.length === 0 ? (
				<p>No assignments found</p>
			) : (
				<table className="group__assignmentTable">
					<thead>
						<tr>
							<th>
								<button
									type="button"
									onClick={() => requestSort('name')}
									className={`group__Sort${getClassNamesFor('name')}`}
								>
									Name
								</button>
							</th>
							<th>
								<button
									type="button"
									onClick={() => requestSort('priority')}
									className={`group__Sort${getClassNamesFor('priority')}`}
								>
									Priority
								</button>
							</th>
							<th>
								<button
									type="button"
									onClick={() => requestSort('status')}
									className={`group__Sort${getClassNamesFor('status')}`}
								>
									Status
								</button>
							</th>
							<th>
								<button
									type="button"
									onClick={() => requestSort('deadline')}
									className={`group__Sort${getClassNamesFor('deadline')}`}
								>
									Deadline
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{items.map((assignment) => (
							<Assignment key={assignment._id} groupId={group._id} assignment={assignment} />
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

function Assignment({ groupId, assignment }) {
	const context = useContext(ProjectContext);

	function setForm() {
		context.setForm(groupId, true, assignment);
	}

	return (
		<tr key={assignment._id} onClick={() => setForm()}>
			<td className="group__assignmentName">{assignment.name}</td>
			<td className="group__assignmentPriority">
				<Priority priority={assignment.priority} />
			</td>
			<td className="group__assignmentStatus">
				<Status status={assignment.status} />
			</td>
			<td
				className="group__assignmentDeadline"
				style={new Date() > new Date(assignment.deadline) ? { color: '#ff6961' } : null}
			>
				{toShortFormat(new Date(assignment.deadline))}
			</td>
		</tr>
	);
}

function Priority({ priority }) {
	const priorityText = [ 'Low', 'Medium', 'High', 'Critical' ];

	return (
		<span className={`group__priotyWrap group__assignment${priorityText[priority]}`}>{priorityText[priority]}</span>
	);
}

function Status({ status }) {
	const statusText = [ 'Not started', 'Working on it', 'Waiting for review', 'Approved', 'Done', 'Stuck' ];
	const statusClass = [ 'Not', 'Working', 'Waiting', 'Approved', 'Done', 'Stuck' ];

	return <span className={`group__statusWrap group__assignment${statusClass[status]}`}>{statusText[status]}</span>;
}

export default Group;
