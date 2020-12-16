import React, { Fragment, useContext} from "react";
import { useForm } from "../Hooks/useForm";
import { useParams } from 'react-router-dom';
import {ProjectContext} from '../../Context/AssignmentForm.Context';
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AssignmentForm.Comp.css";
import Axios from "axios";

function AssignmentForm() {
  const { id } = useParams()

  const context = useContext(ProjectContext);
  const [AssignmentFormState, setAssignmentFormState] = context.assigmentState;
  const [values, handleChanges, handleDate] = useForm(AssignmentFormState.assignmet);

  

  function createAssignment() {
    Axios.post(`http://localhost:5000/group/add/assignment/${AssignmentFormState.groupId}`, values, {withCredentials: true})
    .then((result) => {
      context.getGroups(id);
      context.setDefault();
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <Fragment>
    <div className="assignmentForm" onClick={() => context.setDefault()}/>
      <div className="assignmentForm__form">
        <h2>Assignment form</h2>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChanges}
        />
        <br />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="5"
          value={values.description} onChange={handleChanges}
        ></textarea>
        <br />
        <label htmlFor="priority">Priority</label>
        <br />
        <select name="priority" id="priority" value={values.priority} onChange={handleChanges}>
          <option value="0"></option>
          <option value="1">Working on it</option>
          <option value="2">Waiting for review</option>
          <option value="3">Approved</option>
          <option value="4">Done</option>
          <option value="5">Stuck</option>
        </select>
        <br />
        <label htmlFor="status">Status</label>
        <br />
        <select name="status" id="status" value={values.status} onChange={handleChanges}>
          <option value="0"></option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
          <option value="4">Critical</option>
          <option value="5">Stuck</option>
        </select>
        <br />
        <label htmlFor="deadline">Deadline</label>
        <Datepicker
          id="deadline"
          selected={values.deadline}
          onChange={deadline => handleDate('deadline', deadline)}
        />
        <button onClick={() => createAssignment()}>Submit Assignment</button>
      </div>
    </Fragment>
  );
}

export default AssignmentForm;
