/*
Send id i url
send req.body.id og req.body.access
*/
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Useritem from "./AddusertoprojectItem.comp";

function Adduser() {
  const [Usernames, setUsernames] = useState([]);
  const { id: projectid } = useParams();
  const [selectedUsernames, setselectedUsernames] = useState([]);
  const [Access, setAccess] = useState("0");
  const [Error, setError] = useState("");
  const [UsernamesOP, setUsernamesOP] = useState([]);
  useEffect(() => {
    getUsernames();
    getUsernamesOP();
  }, []);

  const getUsernames = () => {
    Axios.get("http://localhost:5000/user/usernames", { withCredentials: true })
      .then((res) => {
        setUsernames(
          JSON.parse(
            JSON.stringify(res.data)
              .replace(/"username"/g, '"label"')
              .replace(/"_id"/g, '"value"')
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //get user on project
  const getUsernamesOP = () => {
    Axios.get("http://localhost:5000/project/projectdetailusers/" + projectid, {
      withCredentials: true,
    })
      .then((res) => {
        setUsernamesOP(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function submit(e) {
    setError("");
    const values = {
      userid: selectedUsernames.selectedOption.value,
      access: Access.value,
    };

    Axios.post("http://localhost:5000/project/adduser/" + projectid, values, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.error === true) {
          setError(res.data.msg);
          console.log(res);
        } else {
          console.log(res);
          getUsernamesOP();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChange(selectedOption) {
    setselectedUsernames({ selectedOption });
  }

  const animatedComponents = makeAnimated();

  function deleteuser(user) {
    setError("");
    Axios.delete(
      "http://localhost:5000/project/removeuser/" +
        projectid +
        "/" +
        user.User._id,
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        if (res.data.error === true) {
          setError(res.data.msg);
          console.log(res.data.msg);
        } else {
          console.log(res);
          setUsernamesOP(UsernamesOP.filter((el) => el._id !== user._id));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function back() {
    window.location = "/project/" + projectid;
  }

  return (
    <div>
      <h1>Add user to project</h1>
      <div style={{ width: "100%", height: "50px" }}>
        <button
          className="btn btn_primary"
          style={{ float: "right" }}
          onClick={back}
        >
          Back to project
        </button>
      </div>
      <p style={{ color: "red" }}>{Error}</p>
      <div style={{ width: "25%", float: "left", display: "inline" }}>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          options={Usernames}
          defaultValue={Usernames}
          onChange={handleChange}
        />
      </div>
      <div style={{ width: "25%", float: "left", display: "inline" }}>
        <Select
          name="access"
          value={Access}
          onChange={setAccess}
          options={[
            { value: "1", label: "Readonly" },
            { value: "3", label: "User" },
            { value: "5", label: "Owner" },
          ]}
        />
      </div>
      <div style={{ float: "none" }}>
        <button className="btn btn_primary" onClick={submit}>
          Save
        </button>
      </div>
      <div style={{ paddingTop: "25px", width: "100%" }}>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {UsernamesOP.map((user) => (
              <Useritem
                key={user._id}
                user={user}
                id={projectid}
                deleteuser={deleteuser}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Adduser;
