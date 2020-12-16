import React, { useState, useContext } from 'react'
import {ProjectContext} from '../../Context/AssignmentForm.Context'
import {useForm} from '../Hooks/useForm'
import Axios from 'axios';

function NewGroup({id}) {
    const context = useContext(ProjectContext);
    const [groups, setGroups] = context.groupState;

    const [values, handleChange] = useForm({name: ""})
    const [hasError, setError] = useState(false);

    function createGroup() {
        Axios.post(`http://localhost:5000/group/add/${id}`, values, {withCredentials: true})
        .then(res => {
            context.getGroups(id); 
            console.log("Hello");
            values.name = "";
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <input name="name" value={values.name} onChange={handleChange} />
            <button onClick={createGroup}>Create Group</button>
        </div>
    )
}

export default NewGroup
