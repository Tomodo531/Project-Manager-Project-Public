import React, { useEffect, useState } from 'react';
import { useForm } from '../Hooks/useForm';
import { useSortableData } from '../Hooks/useSortableData';
import Axios from 'axios';
import ProjectItem from './ProjektItem.Comp';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ProjectList.Comp.css';

function ProjectList() {
	const [ values, handleChange, handleDate ] = useForm({
		name: '',
		deadline: new Date()
	});
	const [ projects, setProjects ] = useState({ ownProjects: [], memberProjects: [] });

	useEffect(() => {
		getProject();
	}, []);

	const getProject = () => {
		Axios.get('http://localhost:5000/project/', { withCredentials: true })
			.then((res) => {
				setProjects(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const addProject = () => {
		Axios.post('http://localhost:5000/project/add', values, {
			withCredentials: true
		})
			.then((res) => {
				console.log(res);
				getProject();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="projects">
			<h1>Projects</h1>

			<div className="projects_form">
				<input type="text" name="name" placeholder="Project name" value={values.name} onChange={handleChange} />
				<div className="projects_date">
					<Datepicker
						id="deadline"
						selected={values.deadline}
						onChange={(deadline) => handleDate('deadline', deadline)}
					/>
				</div>				
				<button className="btn btn_primary" onClick={addProject}>
					Create Project
				</button>
			</div>
			

			<h2>My projects:</h2>

			{projects.ownProjects.length === 0 ? (
				<p>No projects</p>
			) : (
				<ProjectsTable data={projects.ownProjects}/>
			)}		

			<h2>Member projects:</h2>

			{projects.memberProjects.length === 0 ? (
				<p>No member projects</p>
			) : (
				<ProjectsTable data={projects.memberProjects}/>
			)}

			

		</div>
	);
}

function ProjectsTable({data}) {

	console.log(data);

	const { items, requestSort, sortConfig } = useSortableData(data);

	const getClassNamesFor = (name) => {
		if (!sortConfig) {
			return;
		}

		return sortConfig.key === name ? sortConfig.direction : undefined;
	};
	
	return (
		<div>
			{items.length === 0 ? (
				<p>No projects</p>
			) : (				
				<table className="project__table">
					<thead>
						<tr>
							<th>
							<button
								type="button"
								onClick={() => requestSort('name')}
								className={`project__Sort${getClassNamesFor('name')}`}
							>
								Name</button></th>
							<th>
							<button
								type="button"
								onClick={() => requestSort('member')}
								className={`project__Sort${getClassNamesFor('member')}`}
							>Members</button></th>
							<th>
							<button
								type="button"
								onClick={() => requestSort('progress')}
								className={`project__Sort${getClassNamesFor('naprogressme')}`}
							>Progress</button></th>
							<th>
							<button
								type="button"
								onClick={() => requestSort('deadline')}
								className={`project__Sort${getClassNamesFor('deadline')}`}
							>Deadline</button></th>
						</tr>
					</thead>
					<tbody>
						{items.map((project) => 
							<ProjectItem key={project._id} project={project} />
						)}
					</tbody>
				</table>				
				
			)}
		</div>
	);
}

export default ProjectList;
