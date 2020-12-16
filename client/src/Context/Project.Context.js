import React, { createContext, useState } from 'react';
import Axios from "axios";

export const ProjectContext = createContext();
export function ProjectProvider(props) {

    const emptyAsignment = {
        name: "",
        description: "",
        priority: 0,
        status: 0,
        deadline: new Date()
      };

    const [assignmentForm, setAssignmentForm] = useState({
        display: false,
        id: null,
        assignment: emptyAsignment
    });

    function setForm(id, display, assignment) {
        setAssignmentForm({
            id: id,
            display: display,
            assignment: assignment
        })
    }

    const [hasError, setError] = useState({error: false, msg: ""});
    const [project, setProject] = useState({name: "", access: 0, groups:[]})

    function getProject(id) {
        Axios.get(`http://localhost:5000/group/${id}`, {withCredentials: true})
        .then(res => setProject(res.data))
        .catch(err => console.log(err.code));
    }

    return (
        <ProjectContext.Provider value={{
            assignmentForm: [assignmentForm, setAssignmentForm],
            emptyAsignment: emptyAsignment,
            setForm: setForm,
            hasError: [hasError, setError],
            project: [project, setProject],
            getProject: getProject
        }}>
            {props.children}
        </ProjectContext.Provider>
    )
}
