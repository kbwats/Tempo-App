//var YTSearch = require('youtube-api-search');



function TempoApp() {
  this.checkSetup();
  // Shortcut to DOM Elements.
  this.googleSignInButton = document.getElementById('google');
  this.facebookSignInButton = document.getElementById('facebook')
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.querySelector('.sign-out');
  this.navButtons = document.querySelector('.nav-buttons');
  this.userInfo = document.getElementById('user-info');
  this.messagesList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');





 // Saves messages on form submit.
 this.messageForm.addEventListener('submit', this.saveMessage.bind(this));



   var buttonTogglingHandler = this.toggleButton.bind(this);
   this.messageInput.addEventListener('keyup', buttonTogglingHandler);
   this.messageInput.addEventListener('change', buttonTogglingHandler);

  this.signInButton.addEventListener('click', this.signInWithGoogle.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));

  this.initFirebase();
}

TempoApp.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
TempoApp.prototype.loadMessages = function() {
  // Reference to the /messages database path.
  this.messagesRef = this.database.ref('messages');
  // Remove all previous listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRef.limitToLast(10).on('child_added', setMessage);
  this.messagesRef.limitToLast(10).on('child_changed', setMessage);
}

TempoApp.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    console.log(this.messageInput.value)
    var currentUser = this.auth.currentUser;

    // Add a new message entry to the Firebase Database.

    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || 'images/profile_placeholder.png'
    }).then(function() {
      //Clear message text field and SEND button state.
      this.resetMaterialTextfield(this.messageInput);
       this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    })
  }
}

TempoApp.prototype.setImageUrl = function(imageUri, imgElement) {
  // If image is on Cloud Storage, fetch image URL and set img element's src.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = TempoApp.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
}


TempoApp.prototype.signInWithGoogle = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}

TempoApp.prototype.signOut = function() {
  // Signs out of Firebase
  this.auth.signOut();
}


// Triggers when the auth stat change for instance when the user signs-in or signs-out.
TempoApp.prototype.onAuthStateChanged = function(user) {
  if (user) {
    // Get the profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;


    // Show the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userInfo.removeAttribute('hidden');
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    //this.navButtons.setAttribute('hidden', 'true');
    this.signInButton.setAttribute('hidden', 'true')

    // Load currently existing chat messages.
    this.loadMessages();
  } else {
    // If not the user, we will have to prompt the to create Google or Facebook Profile.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.userInfo.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');
    //this.navButtons.removeAttribute('hidden');
    this.signInButton.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
TempoApp.prototype.checkSignedInWithMessage = function() {
  if (this.auth.currentUser) {
    return true;
  }

  // Must determine what to do
}

// Resets the given MaterialTextField
TempoApp.prototype.resetMaterialTextfield = function(element) {
  console.log("This is working")
  element.value = '';

//  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
TempoApp.prototype.MESSAGE_TEMPLATE =
  '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
  '</div>';


TempoApp.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';






// Displays a message in the UI.
TempoApp.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = this.MESSAGE_TEMPLATE;
    console.log(container.innerHTML)
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messagesList.appendChild(div);
  }
  if(picUrl) {

    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }

  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
}




    // Enables or disables the submit button depending on the values of the input
    // fields.
    TempoApp.prototype.toggleButton = function() {
      if (this.messageInput.value) {
        this.submitButton.removeAttribute('disabled');
      } else {
        this.submitButton.setAttribute('disabled', 'true');
      }
    };

    TempoApp.prototype.checkSetup = function() {
      if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
      }
    };


window.onload = function() {
  window.TempoApp = new TempoApp();
};
