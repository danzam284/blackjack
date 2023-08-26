const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const db = new sqlite3.Database('mydatabase.db');

const app = express();              
const port = 1000;            

app.engine('html', require('ejs').renderFile);
app.set('trust proxy', true)
app.use(express.static("public"));
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}));

app.use(passport.initialize());
app.use(passport.session());

//Used to validate username/password combo
authUser = (username, password, cb) => {
    db.get('SELECT * FROM users WHERE name = ?', [ username ], function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
        if (bcrypt.compareSync(password, user.password)) {
            return cb(null, username);
        } else {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
    })
}

passport.use(new LocalStrategy(authUser));

passport.serializeUser( (user, done) => { 
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done (null, user)      
});

//Removes favicon error
app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/login", (req, res) => {
    res.render(__dirname + "/login.html", {msg: "Incorrect username or password."});
});

app.get("/index", (req, res) => {
    res.render(__dirname + "/index.html", {user: req.user});
});

app.post("/login", urlencodedParser, passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/login"
}));

app.use((req, res, next) => {
    req.db = db; // Attach the database connection to the request object
    next();
});

app.get('/', (req, res) => {        
    res.sendFile('login.html', {root: __dirname});     
});

app.listen(port, () => {    
    console.log(`Now listening on port ${port}`); 
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, chips INT, muted TEXT, password TEXT)");
});

//Sets chips to proper number for user
app.post("/updateChips", urlencodedParser, (req, res) => {
    const count = req.body.chips;
    const user = req.body.user;

    req.db.run("UPDATE users SET chips = ? WHERE name = ?", [count, user], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.send("Chips updated successfully.");
        }
    });
});

//Sends chip count to user
app.get("/getChips", (req, res) => {
    const user = req.query.name;
    req.db.get("SELECT chips FROM users WHERE name = ?", [user], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            if (row) {
                res.send({ return: row.chips });
            } else {
                res.status(404).send("User not found");
            }
        }
    });
});

//Updates mute status for user
app.post("/updateMuted", urlencodedParser, (req, res) => {
    const muted = req.body.muted;
    const user = req.body.user;

    req.db.run("UPDATE users SET muted = ? WHERE name = ?", [muted, user], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Interal Server Error");
        } else {
            res.send("Chips updated successfully");
        }
    });
});

//Creates a new user in the database
app.post("/signup", urlencodedParser, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
        } else {
            req.db.run("INSERT INTO users (name, chips, muted, password) VALUES (?, 100, 'unmuted', ?)", [username, hash], (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Interal Server Error");
                } else {
                    res.status(204).send("Account successfully created");
                }
            });
        }
    });
});

//Sends the user their mute status
app.get("/getMuted", (req, res) => {
    const user = req.query.name;
    req.db.get("SELECT muted FROM users WHERE name = ?", [user], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            if (row) {
                res.send({ return: row.muted });
            } else {
                res.status(404).send("User not found");
            }
        }
    });
});

//Sends the data for leaderboard formulation
app.get("/viewLeaderboard", (req, res) => {
    req.db.all("SELECT name, chips FROM users ORDER BY chips DESC LIMIT 10", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(rows);
        }
    });
});

//returns all users
app.get("/getUser", (req, res) => {
    req.db.all("SELECT name FROM users", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(rows);
        }
    });
});

//Checks if a user exists
function userExists(username) {
    req.db.get("SELECT name FROM users WHERE name = ?", [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return false;
        }
        if (row) {
            return true;
        } else {
            return false;
        }
    });
}
