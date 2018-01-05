
console.log("It is working")
function TempoApp() {
  // Shortcut to DOM Elements.
  this.googleSignInButton = document.getElementById('google');
  this.facebookSignInButton = document.getElementById('facebook')
  this.userPic = document.querySelector('.user-pic');
  this.userName = document.querySelector('.user-name');
  this.signOutButton = document.querySelector('.sign-out');
  this.navButtons = document.querySelector('.nav-buttons');
  this.userInfo = document.querySelector('.user-info');
  this.messageInput = document.querySelector('.input');
  this.submitButton = document.querySelector('.submit-button');
  this.messagesList = document.querySelector('.messages');





// Saves messages on form submit.
this.submitButton.addEventListener('click', this.saveMessage.bind(this));




  this.googleSignInButton.addEventListener('click', this.signInWithGoogle.bind(this));
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

    this.navButtons.setAttribute('hidden', 'true');
  } else {
    // If not the user, we will have to prompt the to create Google or Facebook Profile.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.userInfo.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');
    this.navButtons.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
TempoApp.prototype.checkSignedInWithMessage = function() {
  if (this.auth.currentUser) {
    return true;
  }

  // Must determine what to do
}

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
  console.log("You are attempting to save a message.")
}



// Displays a message in the UI.
TempoApp.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = TempoApp.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messagesList.appendChild(div);
  }
}

TempoApp.MESSAGE_TEMPLATE =
  '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';




window.onload = function() {
  window.TempoApp = new TempoApp();
};
