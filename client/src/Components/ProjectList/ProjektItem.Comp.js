import React from 'react';
import { toShortFormat } from '../ProjectNew/modules/toShortFormat';
import { FaUserFriends } from "react-icons/fa";
import './ProjektItem.Comp.css';

function ProjektItem({ project }) {
	return (
		<tr onClick={() => window.location = `project/${project._id}`}>
			<td className="project_name">{project.name}</td>
			<td><FaUserFriends/> {project.Users.length}</td>
			<td className="project__progress">
				{
					project.totalDone !== null ? (
				
						<>
							<div style={{width: `${project.totalNotStarted}%`}}>
								<span>{Math.round(project.totalNotStarted)}%</span><br/>
								<span className="project__progressBar project__progressNotStarted"></span>
							</div>

							<div style={{width: `${project.totalStarted}%`}}>
								<span>{Math.round(project.totalStarted)}%</span><br/>
								<span className="project__progressBar project__progressStarted"></span>
							</div>

							<div style={{width: `${project.totalDone}%`}}>
								<span>{Math.round(project.totalDone)}%</span><br/>
								<span className="project__progressBar project__progressDone"></span>
							</div>
						</>
					
					) : <span>N/A</span>
				}
			</td>
			<td 
				style={new Date() > new Date(project.deadline) ? { color: '#ff6961' } : null}
			>
				{toShortFormat(new Date(project.deadline))}
			</td>
		</tr>
	);
}

export default ProjektItem;
