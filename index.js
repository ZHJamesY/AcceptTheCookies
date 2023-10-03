// Import express. Supported by Node.js, lets us include modules in our project.
let express = require('express');

// Session tracking module
let session = require('express-session');

// generate random session id
const { v4: uuidv4 } = require('uuid');

// Instantiate express application
let app = express();

// Importing local mongoose code.
const dataBase = require('./dataBase.js');

// Setup a static server for all files in /public
app.use(express.static('public'));
// access to post: middleware handler
app.use(express.urlencoded({extended: false}));

app.use(session({
    // Generate our session ID
    // genid: () => '12345',
    genid: () => uuidv4(),
    // Should we keep saving this file?
    resave: false,
    // Should I save parameters in the session dictionary?
    saveUninitialized: false,
    
    // Needed to sign our session ID.
    secret: 'AcceptTheCookies'
}));

// Use environment variable specified at command line, or if none provided, 3000 default
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
    console.log(`Listening on port ${app.get('port')}`);
});

app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

// Serve a static HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// login page
app.get('/login', function (request, response) {
    response.render('login', {
        title: 'Login',
        errorMessage: 'Adjust height text.',
        route: '/login'
    });
});

// async function to check if user exists
async function userExists(email,password) {
    let index = 0;
    const accounts = await dataBase.Accounts.find();
    const exists = accounts.some(function(element) {
        if(password == "")
        {
            return element.Email === email;
        }
        else
        {
            return (element.Email === email  && element.Password === password);
        }
    });
    return exists;
}

// find index by email
async function findIndexByEmail(email) {
    const accounts = await dataBase.Accounts.find();
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].Email === email) {
        return i;
      }
    }
    return -1;
}

// store current user's email
let currentEmail = "";

// sign in page - process
app.post('/signIn', async function (request, response) {
    let email = request.body.email;
    currentEmail = email;
    let password = request.body.password;
    const exists = await userExists(email,password);
    if(email == "admin@gmail.com" && password == "admin123")
    {
        request.session.email = email;
        response.render('adminListChat', {
            title: 'Live Chat',
        });
    }
    else if(exists == true) // check if email exist and password is correct
    {
        request.session.email = email;
        response.sendFile(__dirname + '/public/accessIndex.html');
    }
    else // else display error message
    {
        response.render('login', {
            title: 'Sign in',
            errorMessage: "Incorrect email or password. Try again.",
            route: '/processLogin'
        });
    }
});

// direct to sign up page
app.get('/signUp', async function (request, response){
    response.render('signUp', {
        title: 'Sign up',
        errorMessage: 'Adjust height text.',
        route: '/signUp'
    });
});

// process new account sign up
app.post('/newAccount', async function (request, response){
    const accounts = await dataBase.Accounts.find();
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;

    const exists = await userExists(email,"");

    if(exists)
    {
        response.render('signUp', {
            title: 'Sign up',
            errorMessage: "Sorry, email exist.",
            route: '/newAccount'
        });
    }
    else
    {
        const Accounts = dataBase.Accounts;
        // Insert the new account into the database
        const newAccount = new Accounts({
            Email: email,
            Password: password,
            Username: username
        });
        await newAccount.save();

        // add session cookie, auto sign in for new user
        currentEmail = email;
        request.session.email = email;
        console.log("in new: ", request.session.email)
        response.redirect('./accessIndex.html');
    }
});

// access account info page
app.get('/accountInfo', async function (request, response) {
    console.log("in acc: ", request.session.email)
    // check if the user has a current session on landing
    const accounts = await dataBase.Accounts.find();

    // check if email not exist in database return to login page, else do ...
    const accIndex = await findIndexByEmail(currentEmail);
    if(accIndex == -1)
    {
        response.render('login', {
            title: 'Login',
            errorMessage: 'Adjust height text.',
            route: '/login'
        });
    }
    else
    {
        // check if user has logged in access page, else return to login
        if(request.session.email)
        {
            response.render('accountInfo', {
                title: 'Account',
                email: accounts[accIndex].Email,
                username: accounts[accIndex].Username
            });
        }
        else
        {
            response.render('login', {
                title: 'Login',
                errorMessage: 'Adjust height text.',
                route: '/login'
            });
        }
    }
    

});

// account info update
app.post('/accessAccountInfoUpdated', async function (request, response) {
    const accounts = await dataBase.Accounts.find();
    if(request.session.email)
    {
        let email = request.body.email;
        let username = request.body.username;
        let password = request.body.password;
        let confirmPassword = request.body.confirmPassword;
        const accIndex = await findIndexByEmail(currentEmail);

        // check if index == -1: something wrong return to login page, else do ...
        if(accIndex == -1)
        {
            response.render('login', {
                title: 'Login',
                errorMessage: 'Adjust height text.',
                route: '/login'
            });
        }
        else
        {
            // if only username changed
            if(username != accounts[accIndex].Username && (password == "" && confirmPassword == ""))
            {
                await dataBase.Accounts.updateOne(
                    { Email: email },
                    { $set: { Username: username} }
                );
            }
            // only update password
            else if(username == accounts[accIndex].Username && (password != '' && confirmPassword != ''))
            {
                await dataBase.Accounts.updateOne(
                    { Email: email },
                    { $set: { Password: password} }
                );
            }
            // else update both
            else if(username != accounts[accIndex].Username && (password != '' && confirmPassword != ''))
            {
                await dataBase.Accounts.updateOne(
                    { Email: email },
                    { $set: { username: username, password: password } }
                );
            }
        }
        
        // Redirect the user to the account information page
        response.redirect('/accountInfo');
    }
    else
    {
        response.render('login', {
            title: 'Login',
            errorMessage: 'Adjust height text.',
            route: '/login'
        });
    }

});

// Initialize socket.io
const io = require('socket.io')(server);

// Counter variable to keep track of the number of connected users
let numUsers = 0;

// Array to store users waiting to connect
let waitlist = [];

// admin socket
let admin = "";

// user socket
let currentUser = "";

// Create a socket connection
io.on('connection', (socket) => {
  console.log('User connected');

  if (numUsers < 2) {
    // Allow user to connect
    numUsers++;
    console.log(`User ${socket.id} connected. Number of users: ${numUsers}`);

    // assign admin socket
    if(numUsers == 1)
    {
        admin = socket;
    }
    else if(numUsers == 2)
    {
        currentUser = socket;
    }

    // Listen for messages from the client
    socket.on('chat-message', (data) => {
      console.log(`Message received: ${data}`);
      
      // emit message to all connected users
      if(socket == admin)
      {
        admin.emit('chat-message', `(Agent): ${data}`);
        currentUser.emit('chat-message', `(Agent): ${data}`);
      }
      else
      {
        admin.emit('chat-message', `(User): ${data}`);
        currentUser.emit('chat-message', `(User): ${data}`);
      }
    });
  } 
  // if numUsers > 1, put user to wait list
  else {
    console.log("enter waitlist")
    // Add user to the waitlist
    waitlist.push(socket);
    console.log("current waitlist num: ", waitlist.length);
    const position = waitlist.length;
    socket.emit('waitlist', `You are number ${position} in line`);
  }

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);

    console.log("current waitlist = ", waitlist.length)

    // check if user disconnected is a waitlist user
    for(let i = 0; i < waitlist.length; i++)
    {
      // if user is a waitlist user increment numUsers, remove user from waitlist
      if(socket.id == waitlist[i].id)
      {
        waitlist.splice(i,1)
        numUsers++;
      }
    }
    numUsers--;
    console.log("current numUsers = ", numUsers);
    // Check if a slot is available
    if (numUsers < 2 && waitlist.length > 0) {
      console.log("enters")
      // Retrieve next user from waitlist
      const nextSocket = waitlist.shift();

      nextSocket.emit('waitlist', `Adjust height text`);


      // increment numUsers
      numUsers++;

      currentUser = nextSocket;
    
      // Listen for messages from the client
      nextSocket.on('chat-message', (data) => {
        console.log(`Message received: ${data}`);
    
        // emit message to all connected users
        if(socket == admin)
        {
            admin.emit('chat-message', `(Agent): ${data}`);
            currentUser.emit('chat-message', `(Agent): ${data}`);
        }
        else
        {
            admin.emit('chat-message', `(User): ${data}`);
            currentUser.emit('chat-message', `(User): ${data}`);
        }
      });
    }
    // else update waitlist message to waitlist users
    else
    {
      console.log("enter here")
      console.log("length = ", waitlist.length)
      for(let i = 0; i < waitlist.length; i++)
      {
        io.to(waitlist[i].id).emit('waitlistUpdate', `${i+1}`);
      }
    }
  });

});


// logout remove session cookies
app.get('/logout', (request, response) => {
    // delete information from the session
    request.session.email = '';
    response.sendFile(__dirname + '/public/index.html');
});
