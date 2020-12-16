import React, { useEffect, useState, useContext } from 'react'
import {ProjectContext} from '../../Context/AssignmentForm.Context'
import { useParams } from 'react-router-dom';
import GroupForm from './GroupForm.Comp'
import Group from './Group.Comp'
import AssignmentForm from './AssignmentForm.Comp'
import Axios from 'axios';
function Project() {
    const { id } = useParams()

    const context = useContext(ProjectContext);
    const [AssignmentFormState, setAssignmentFormState] = context.assigmentState;
    const [groups, setGroups] = context.groupState;

    useEffect(() => {
        context.getGroups(id);
    }, [])

    return (
        <div>
            <div style={AssignmentFormState.display ? {display: "flex"} : {display: "none"}}>
                <AssignmentForm/>
            </div>

            <GroupForm id={id}></GroupForm>
            <br/>

            {groups.length === 0
                ? <p>No Assignment Groups</p>
                : groups.map((group) => 
                    
                     <Group key={group._id} group={group}/>
                )
            }            
        </div>
    )
}

export default Project
