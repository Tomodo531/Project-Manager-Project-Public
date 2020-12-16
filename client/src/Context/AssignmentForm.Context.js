import React, { useState, createContext } from "react";
import Axios from "axios";

export const ProjectContext = createContext();
export function AssignmentFormProvider(props) {
  const emptyAsignment = {
    name: "",
    description: "",
    priority: 0,
    status: 0,
    deadline: new Date()
  };

  const [AssignmentFormState, setAssignmentFormState] = useState({
    display: false,
    groupId: null,
    assignmet: emptyAsignment
  });

  function setDefault() {
    setAssignmentFormState({
      display: false,
      groupId: null,
      assignmet: emptyAsignment
    });
  }

  function setDisplay(id) {
    setAssignmentFormState({
      display: true,
      groupId: id,
      assignmet: emptyAsignment
    });
  }

  function setEdit(id, assignmet) {

    setAssignmentFormState({
      display: true,
      groupId: id,
      assignmet: this.assignmet
    });
  }

  const [hasError, setError] = useState(false);
  const [groups, setGroups] = useState([]);

  function getGroups(id) {
    Axios.get(`http://localhost:5000/group/${id}`, {withCredentials: true})
    .then(res => setGroups(res.data))
    .catch(err => setError(err));
}

  return (
    <ProjectContext.Provider
      value={{
        assigmentState: [AssignmentFormState, setAssignmentFormState],
        setDefault: setDefault,
        setDisplay: setDisplay,
        groupState : [groups, setGroups],
        getGroups: getGroups,
        setEdit: setEdit
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}
