// $(document).ready(function(){
//   // Connect to the socket server
//   const socket = io();

//   // Get the UI elements
//   const chatLog = document.getElementById('chat-log');
//   const messageInput = document.getElementById('message-input');
//   const sendButton = document.getElementById('send-button');
//   const waitlistContainer = document.getElementById('waitlist-container');


//   // Listen for chat messages from the server
//   socket.on('chat-message', (data) => {
//     console.log("message is: ", data);
//     addMessageToLog(data);
//   });

//   // Listen for waitlist position from the server
//   socket.on('waitlist', (data) => {
//     waitlistContainer.innerText = `${data}`;
//     if(data == "Adjust height text")
//     {
//       waitlistContainer.classList.add('waitList-white');

//     }
//     else 
//     {
//       waitlistContainer.classList.remove('waitList-white');
//     }
//   });

//   // Listen for waitlist update position from the server
//   socket.on('waitlistUpdate', (id) => {
//     console.log("current id= ", id);
//     waitlistContainer.classList.remove('waitList-white');
//     waitlistContainer.innerText = `You are number ${id} in line`;
//   });

//   // Send chat messages to the server
//   function sendMessage() {
//     const message = messageInput.value;
//     if (message.trim() !== '') {
//       socket.emit('chat-message', message);
//       messageInput.value = '';
//     }
//   }


//   // send message with Enter key, move to new line with shift + Enter keys
//   messageInput.addEventListener('keydown', (event) => {
//     const keyCode = event.which || event.keyCode;

//     // if === enter key and != shift key, send message
//     if (keyCode === 13 && !event.shiftKey) {
//       // prevent default behaviour: new line
//       event.preventDefault();
//       sendMessage();
//     }
//   });
  

//   // send message when send button is clicked
//   sendButton.addEventListener('click', () => {
//     sendMessage();
//   });


//   // Add a message to the chat log
//   function addMessageToLog(message) {
//     chatLog.value += `${message}\n`;
//   }
  
// });

// // Open chat
// function openForm() {
//   document.getElementById("myForm").style.display = "block";
// }

// // close chat
// function closeForm() {
//   document.getElementById("myForm").style.display = "none";
// }

let socket; // Define socket variable in the global scope

// Function to initialize socket connection
function initSocketConnection() {
  // Connect to the socket server
  socket = io();

  // Get the UI elements
  const chatLog = document.getElementById('chat-log');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const waitlistContainer = document.getElementById('waitlist-container');

  // Listen for chat messages from the server
  socket.on('chat-message', (data) => {
    console.log("message is: ", data);
    addMessageToLog(data);
  });

  // Listen for waitlist position from the server
  socket.on('waitlist', (data) => {
    waitlistContainer.innerText = `${data}`;
    if(data == "Adjust height text")
    {
      waitlistContainer.classList.add('waitList-white');

    }
    else 
    {
      waitlistContainer.classList.remove('waitList-white');
    }
  });

  // Listen for waitlist update position from the server
  socket.on('waitlistUpdate', (id) => {
    console.log("current id= ", id);
    waitlistContainer.classList.remove('waitList-white');
    waitlistContainer.innerText = `You are number ${id} in line`;
  });

  // Send chat messages to the server
  function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
      socket.emit('chat-message', message);
      messageInput.value = '';
    }
  }

  // send message with Enter key, move to new line with shift + Enter keys
  messageInput.addEventListener('keydown', (event) => {
    const keyCode = event.which || event.keyCode;

    // if === enter key and != shift key, send message
    if (keyCode === 13 && !event.shiftKey) {
      // prevent default behaviour: new line
      event.preventDefault();
      sendMessage();
    }
  });

  // send message when send button is clicked
  sendButton.addEventListener('click', () => {
    sendMessage();
  });

  // Add a message to the chat log
  function addMessageToLog(message) {
    chatLog.value += `${message}\n`;
  }
}

$(document).ready(function(){
  // Open chat and initialize socket connection when send button is clicked
  document.getElementById("open_button").addEventListener('click', () => {
    openForm();
    initSocketConnection();
  });

  // Close chat and disconnect socket connection when close button is clicked
  document.getElementById("close-button").addEventListener('click', () => {
    closeForm();
    socket.disconnect();
  });
});

// Open chat
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

// close chat
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}