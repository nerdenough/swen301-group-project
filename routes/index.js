'use strict';
var parseString = require('xml2js').parseString;
var express = require('express');
var fs = require("fs");
var router = express.Router();

var userPath = 'users.json';
var logPath = 'sample1.xml';
var users;
var logData;
var currentMaxID = 0;
var eventTypes = ['cost','price','mail','timelimit','discontinue'];

//check if file exist
function getFileRealPath(path){
  try {
    return fs.realpathSync(path);
  } catch(e){
    return false;
  }
}

//check username
function getIndex(name){
  if (users) {
    for (var i = 0; users.groups.length; i++) {
      if (users.groups[i].user === name) {
        return i;
      }
    }
  }
  return -1;
}

//check pass
function getPassword(i){
  return users.groups[i].pass;
}

//get ID of latest event
//FORMAT: logData[type][#index][attribute][0]
function getMaxID(type) {
  for (var i = 0; i < logData[type].length; i++) {
    var num = parseInt(logData[type][i]['ID'][0]);
    if (num > currentMaxID) {
       currentMaxID = num;
    }
  }
}

//get Event in logData
//FORMAT: logData[type][#index][attribute][0]
function getEvent(uID) {
  for (var i = 0; i < eventTypes.length; i++) {
    var type = eventTypes[i];
    for (var j = 0; j < logData[type].length; j++) {
      if (logData[type][j]['ID'][0] === uID.toString()) {
        return logData[type][j];
      }
    }
  }

  return null;
}

//get Attribute in event
//FORMAT: logData[type][#index][attribute][0]
function getAttribute(evt,attr) {
  return evt[attr][0];
}

//load user file
if(getFileRealPath(userPath)) {
  fs.open(userPath, 'rs+', function(err, fd) {
    if (err) {
      console.error(err);
    }
    fs.readFile(userPath, function (err, data) {
      if (err) {
        console.error(err);
      }
      users = JSON.parse(data.toString());
      fs.close(fd, function(err){
        if (err){
          console.log(err);
        }
      });
    });
  });
}

//load log file
if(getFileRealPath(logPath)) {
  fs.open(logPath, 'r+', function(err, fd) {
    if (err) {
      return console.error(err);
    }

    fs.readFile(logPath, function (err, data) {
      if (err) {
        return console.error(err);
      }
      parseString(data.toString(), function (err, result) {
        logData = result['simulation'];
        //get max
        for (var i = 0; i < eventTypes.length; i++) {
          getMaxID(eventTypes[i]);
        }

        fs.close(fd, function(err){
          if (err){
            console.log(err);
          }
        });
      });
    });

  });
}

// GET: /
router.get('/', function(req, res) {
  if(!req.session.user) { //check for login
    res.render('index/index', {
      title: 'KPSmart - Restricted Access'
    });
  } else {
    res.redirect('/main');
  }
});

// GET: /main
router.get('/main', function(req, res) {
  //console.log(req.session);

  if(!req.session.user) { //check for login
    res.redirect('/');
  } else {
    res.render('index/main', {
      title: 'KPSmart - Home',
      username: req.session.user
    });
  }
});

// POST: /login
router.post('/login', function(req, res) {
  ////////////////////TRY CATCH IS TEMPORARY REMEDY ONLY
  //GETS TYPE ERROR IF CODE INSIDE TRY CLAUSE IS USED ON ITS OWN
  try {
    if (!req.session.user) { // Check if user logged in
      var i = getIndex(req.body.username);
      if (i >=0) {
        if (users.groups[i].pass === req.body.password) {
          req.session.user = req.body.username;
          req.session.save();
          //console.log(req.session);
          res.redirect('/main');
        } else {
          res.render('index/feedback', {
            title: 'KPSmart - Restricted Access',
            feedback: 'Password incorrect'
          });
        }
      } else {
        res.render('index/feedback', {
          title: 'KPSmart - Restricted Access',
          feedback: 'Username does not exist'
        });
      }
    } else {
      res.redirect('/main');
    }
  } catch(e){
    res.redirect('/');
  }


});

// GET: /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  //console.log(req.session);
  res.redirect('/');
});

// POST: /signup
router.post('/signup', function(req, res) {
  var role = req.body.role;
  var pass = req.body.passwordinput;
  var rePass = req.body.retypepassword;
  var email = req.body.emailinput;
  //email regex
  var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  var feedback = [];

  if (users) {
    for (var i = 0; i <users.groups.length; i++) {
      if (users.groups[i].user === role) {
        feedback.push('Login for user group"'+role+'" already exist');
        feedback.push('Nothing has been changed');
      }
    }
  } else if (pass !== rePass || !re.test(email)) {
    if (newPass !== newRePass) {
      feedback.push('New password entered does not match with re-typed password');
    }
    if (!re.test(email)) {
      feedback.push('Invalid email address');
    }
    feedback.push('Nothing has been changed');
  } else {
    var text = '{"groups":[';
    if (users) {
      for (var i = 0; i <users.groups.length; i++) {
        text+='{"user":"'+users.groups[i].user+'", "pass":"'+users.groups[i].pass+'", "email":"'+users.groups[i].email+'"},';
      }
    }
    text+='{"user":"'+role+'", "pass":"'+pass+'", "email":"'+email+'"}]}';
    fs.writeFile('users.json', text,  function(err) {
       if (err) {
           return console.error(err);
       }
    });
  }

  res.render('index/feedback', {
    title: 'KPSmart - Restricted Access',
    username: req.session.user,
    feedback: feedback
  });
});

// GET: /edit login information
router.get('/edit', function(req, res) {
  if(!req.session.user) { //check for login
    res.redirect('/');
  }

  var i = getIndex(req.session.user);
  var email = users.groups[i].email;
  res.render('form/edit', {
    title: 'KPSmart - Edit Credentials',
    username: req.session.user,
    email: email
  });
});

// POST: /edit_process
router.post('/edit_process', function(req, res) {
  if(!req.session.user) { //check for login
    res.redirect('/');
  }

  var role = req.session.user;
  var currPass = req.body.currentpasswordinput;
  var newPass = req.body.passwordinput;
  var newRePass = req.body.retypepassword;
  var email = req.body.emailinput;
  //email regex
  var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  var index = getIndex(req.session.user);
  var feedback = [];

  if (currPass !==  users.groups[index].pass || newPass !== newRePass || !re.test(email)) {
    if (currPass !==  users.groups[index].pass) {
      feedback.push('Current password entered does not match with current password');
    }
    if (newPass !== newRePass) {
      feedback.push('New password entered does not match with re-typed password');
    }
    if (!re.test(email)) {
      feedback.push('Invalid email address');
    }
    feedback.push('Nothing has been changed');
  } else {
    var text = '{"groups":[';
    if (users) {
      for (var i = 0; i <users.groups.length; i++) {
        if (i !== index) {
          text+='{"user":"'+users.groups[i].user+'", "pass":"'+users.groups[i].pass+'", "email":"'+users.groups[i].email+'"},';
        }
      }
    }
    if (newPass === '') {
      text+='{"user":"'+role+'", "pass":"'+currPass+'", "email":"'+email+'"}]}';
    } else {
      text+='{"user":"'+role+'", "pass":"'+newPass+'", "email":"'+email+'"}]}';
      feedback.push('Password changed');
    }

    fs.writeFile('users.json', text,  function(err) {
       if (err) {
           return console.error(err);
       }
    });
  }

  res.render('index/feedback', {
    title: 'KPSmart - Edit Credentials',
    username: req.session.user,
    feedback: feedback
  });
});

//GET: /test
router.get('/test', function(req, res) {
  fs.open('sample1.xml', 'r+', function(err, fd) {
     if (err) {
         return console.error(err);
     } else {
       fs.readFile('sample1.xml', function (err, data) {
        if (err) {
           return console.error(err);
        }

        parseString(data.toString(), function (err, result) {
            try {
              console.log(logData['cost'][0]);
              var evt = getEvent(1);
              console.log(evt);
              console.log(getAttribute(evt,'from'));
            } catch (e) {}
        });

        res.redirect('/');
        fs.close(fd, function(err){
          if (err){
             console.log(err);
          }
       });
      });
     }
  });
});

module.exports = router;
