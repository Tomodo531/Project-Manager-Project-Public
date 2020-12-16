import React,{useContext} from 'react'
import { ProjectContext } from '../../Context/AssignmentForm.Context'

function Assignment({assignment, id}) {

    const context = useContext(ProjectContext);

    return (
        <div style={{color: "red"}}>
            {assignment.name}
            <button onClick={() => context.setEdit(id, assignment)}></button>
        </div>
    )
}

export default Assignment
