const router = require('express').Router();
const Group = require('../models/assignmentGroup.model');
const Project = require('../models/project.model');
const verify = require('./modules/verifyToken');
const decode = require('jwt-decode');
const { authRead, authReadWrite, authAdmin, authOwner } = require('./modules/verifyAccess');
const validation = require('./modules/joiValidation');

router.get('/:projectid', verify, authRead, async (req, res) => {
    //:id = project id
    const decoded = decode(req.cookies.auth_token);
    var result = {};

    Project.findOne({ _id: req.params.projectid}, {name: 1 , Users: { $elemMatch: { User: decoded._id } }})
        .then((project) => {
            
            Group.find({ p_id: req.params.projectid })
                .then((groups) => {

                    res.status(200).json({
                        name: project.name,
                        access: project.Users[0].access,
                        groups: groups
                    }).send();
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        })
        .catch((err) => {
            res.status(500).send(err);
        });

    
});

router.post('/add/:projectid', verify, authReadWrite, async (req, res) => {
    //:id = project id   

    var newGroup = new Group({
        p_id: req.params.projectid,
        name: req.body.name,
        assignments: []
    });

    let {error, value} = validation.validateGroup(newGroup);
    console.log(error);
    if(error) return res.status(400).send(error);

    newGroup.save(newGroup)
    .then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(500).send(err);
    })
});

router.delete('/delete/:projectid/:groupid', verify, authAdmin, async (req, res) => {
    
    Group.findByIdAndRemove(req.params.groupid)
    .then((result) => {
        res.status(200).send(result);
        console.log(200)
    })
    .catch((err) => {
        res.status(500).send(err);
        console.log(err);
    }) 
});

router.post('/add/assignment/:projectid/:groupid', verify, authReadWrite, async (req, res) => {

    if(req.body._id === null){
        delete req.body._id;
        Group.update({_id: req.params.groupid}, {$push: {assignments: req.body}})
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
            console.log(err);
        })
    }else{     
        Group.update({'assignments._id': req.body._id}, {'$set': {
            'assignments.$._id': req.body._id,
            'assignments.$.name': req.body.name,
            'assignments.$.description': req.body.description,
            'assignments.$.priority': req.body.priority,
            'assignments.$.status': req.body.status,
            'assignments.$.deadline': req.body.deadline
        }})
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
            console.log(err);
        })
    }
});

router.delete('/delete/assignment/:projectid/:groupid/:assignmentid', verify, authReadWrite, async (req, res) => {
    
    Group.updateOne({_id: req.params.groupid}, {'$pull': {'assignments': {_id: req.params.assignmentid}}})
    .then((result) => {
        res.status(200).send(result);
        console.log(200)
    })
    .catch((err) => {
        res.status(500).send(err);
        console.log(err);
    });
});

module.exports = router;
