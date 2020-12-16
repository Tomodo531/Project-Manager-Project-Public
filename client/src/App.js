import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage.Comp';
import Login from './Components/Login/Login.Comp';
import Register from './Components/Register/Register.Comp';
import ProjectList from './Components/ProjectList/ProjectList.Comp';
import Project from './Components/ProjectNew/Project.Comp';
import { ProjectProvider } from './Context/Project.Context';
import Adduser from './Components/Addusertoproject/Addusertoproject.comp';
import './App.css';

function App() {
	return (
		<ProjectProvider>
			<Router>
				<div className="App">
					<Switch>
						<Route path="/" exact component={Homepage} />
						<Route path="/login" exact component={Login} />
						<Route path="/register" exact component={Register} />
						<Route path="/projects" exact component={ProjectList} />v
						<Route path="/editproject/adduser/:id" exact component={Adduser} />
						<Route path="/project/:id" exact component={Project} />
					</Switch>
				</div>
			</Router>
		</ProjectProvider>
	);
}

export default App;
