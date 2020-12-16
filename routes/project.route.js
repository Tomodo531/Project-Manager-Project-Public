const router = require("express").Router();
const Project = require("../models/project.model");
const Group = require('../models/assignmentGroup.model');
const verify = require("./modules/verifyToken");
const {
  authRead,
  authReadWrite,
  authAdmin,
  authOwner,
} = require("./modules/verifyAccess");
const validation = require("./modules/joiValidation");
const decode = require("jwt-decode");
const User = require("../models/user.model");
const mongoose = require("mongoose");

async function getProgress(id) {

    var output = {
      _id: id,
      totalAssignments: 0,
      totalNotStarted: 0,
      totalStarted: 0,
      totalDone: 0
      }	

    await Group.aggregate([
      { $match: { p_id: mongoose.Types.ObjectId(id) } },
      { $project: {
        totalAssignments: {$size: {$ifNull:["$assignments", []] }},
        totalNotStarted: {
          $size: {
          $filter: {
            input: "$assignments",
            as: "assignment",
            cond: { $eq: [ "$$assignment.status", 0 ] }
          }
          }
        },
        totalStarted: {
          $size: {
            $filter: {
            input: "$assignments",
            as: "assignment",
            cond: {
              $or: [
                {
                  $and: [
                    { $gt: [ "$$assignment.status", 0 ] },
                    { $lt: [ "$$assignment.status", 4 ] }
                  ]
                },
                { $eq: [ "$$assignment.status", 5 ] }
              ]						
            }
            }
          }
          },
        totalDone: {
          $size: {
            $filter: {
            input: "$assignments",
            as: "assignment",
            cond: { $eq: [ "$$assignment.status", 4 ] }
            }
          }
          }			  
        }},
    ])
    .then((result) => {
      
      result.forEach((element) => {
        output.totalAssignments += element.totalAssignments;
        output.totalNotStarted += element.totalNotStarted;
        output.totalStarted += element.totalStarted;
        output.totalDone += element.totalDone;
      });
  });

  output.totalNotStarted = output.totalNotStarted / output.totalAssignments * 100;
  output.totalStarted = output.totalStarted / output.totalAssignments * 100;
  output.totalDone = output.totalDone / output.totalAssignments * 100;

  console.log(output);

  return output;
}

router.get("/a", verify, (req, res) => {
  const decoded = decode(req.cookies.auth_token);
  console.log(decoded);
  
	Project.find({ Users: { $elemMatch: { User: decoded._id, access: { $eq: 7 } }}})
		.then((ownProjects) => {
			
			Project.find({ Users: { $elemMatch: { User: decoded._id, access: { $ne: 7 } }}})
				.then((memberProjects) => {

					res.status(200).json(
						{
							ownProjects: ownProjects,
							memberProjects: memberProjects
						}
					).send();
				})
				.catch((err) => {
					res.status(500).send(err);
				});

		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.get("/", verify, (req, res) => {
  const decoded = decode(req.cookies.auth_token);
  console.log(decoded);
  
	Project.find({ Users: { $elemMatch: { User: decoded._id, access: { $eq: 7 } }}}).lean()
		.then((ownProjects) => {

      var progressOwnProjects = new Promise ((resolve, reject) => {

        if(ownProjects.length === 0) resolve();

        ownProjects.forEach(async (element, index, array) => {
          var progess = await getProgress(element._id);
          ownProjects[index].totalNotStarted = progess.totalNotStarted;
          ownProjects[index].totalStarted = progess.totalStarted;
          ownProjects[index].totalDone = progess.totalDone;
          
          if(index === array.length - 1) resolve();
        });
      });

      progressOwnProjects.then(() => {

        console.log('Resolve 1')

        Project.find({ Users: { $elemMatch: { User: decoded._id, access: { $ne: 7 } }}}).lean()
				.then((memberProjects) => {

          console.log('memberProjects', memberProjects)

          var progressMemberProjects = new Promise ((resolve, reject) => {

            if(memberProjects.length === 0) resolve();

            memberProjects.forEach(async (element, index, array) => {
              var progess = await getProgress(element._id);
              memberProjects[index].totalNotStarted = progess.totalNotStarted;
              memberProjects[index].totalStarted = progess.totalStarted;
              memberProjects[index].totalDone = progess.totalDone;
    
              if(index === array.length - 1) resolve();
            });
          });

          progressMemberProjects.then(() => {
            console.log('Resolve 2')

            res.status(200).json(
              {
                ownProjects: ownProjects,
                memberProjects: memberProjects
              }
            ).send();
          })					
				})
				.catch((err) => {
					res.status(500).send(err);
				});
      }); 		
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.post("/add", verify, (req, res) => {
  let { error, value } = validation.validateProject(req.body);
  if (error) return res.status(400).send(error);

  const decoded = decode(req.cookies.auth_token);

  const newProject = new Project({
    op_id: decoded._id,
    Users: [{ User: decoded._id, access: "7" }],
    name: req.body.name,
    deadline: req.body.deadline,
  });

  newProject
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
//user to project - adduser
router.post("/adduser/:projectid", verify, authAdmin, async (req, res) => {
  const userexsist = await User.exists({ _id: req.body.userid });
  if (!userexsist)
    return res
      .status(200)
      .json({ error: true, msg: "No user by that name exsist" });

  const useralready = await Project.exists({
    "Users.User": req.body.userid,
    _id: req.params.projectid,
  });
  if (useralready)
    return res
      .status(200)
      .json({ error: true, msg: "User is already a member of the project" });

  Project.updateOne(
    { _id: req.params.projectid },
    { $push: { Users: { User: req.body.userid, access: req.body.access } } }
  )
    .then((result) => {
      res.json("User updated!");
      console.log(result);
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
      console.log(err);
    });
});
//Delete user - adduser
router.delete(
  "/removeuser/:projectid/:userid",
  verify,
  authAdmin,
  async (req, res) => {
    const userowner = await Project.exists({
      op_id: req.params.userid,
      _id: req.params.projectid,
    });
    if (userowner)
      return res
        .status(200)
        .json({ error: true, msg: "You can not delete owner" });

    const userexsist = await User.exists({ _id: req.params.userid });
    if (!userexsist)
      return res
        .status(200)
        .json({ error: true, msg: "No user by that name exsist" });

    const useralready = await Project.exists({
      "Users.User": req.params.userid,
      _id: req.params.projectid,
    });
    if (!useralready)
      return res
        .status(200)
        .json({ error: true, msg: "User is not member of project" });

    Project.updateOne(
      { _id: req.params.projectid },
      { $pull: { Users: { User: req.params.userid } } }
    )
      .then((result) => {
        res.json("User removed from Project!");
        console.log(result);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
        console.log(err);
      });
  }
);
//returns users on project for add user page
router.get(
  "/projectdetailusers/:projectid",
  verify,
  authReadWrite,
  async (req, res) => {
    Project.findOne({ _id: req.params.projectid })
      .populate({ path: "Users.User", model: User, select: "username" })
      .then((projects) => {
        res.status(200).json(projects.Users).send();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
);

module.exports = router;
