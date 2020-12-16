import React, { useContext } from "react";
import { ProjectContext } from "../../Context/AssignmentForm.Context";
import Assignment from "./Assignment.Comp";
import "./Group.Comp.css";
function Group({ group }) {
  const context = useContext(ProjectContext);
  const [AssignmentFormState, setAssignmentFormState] = context.assigmentState;

  return (
    <div className="group">
      <div className="group__header">
        <h1 className="group__name">{group.name}</h1>
        <button
          className="group__createAsignment"
          onClick={() => context.setDisplay(group._id)}
        >
          Create Assignment
        </button>
      </div>

      {group.assingments.length === 0 ? (
        <p>No assingments</p>
      ) : (
        group.assingments.map(assignment => (
          <Assignment key={assignment._id} assignment={assignment} id={group._id} />
        ))
      )}
    </div>
  );
}

export default Group;
