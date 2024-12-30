const firebaseConfig = {
  apiKey: "AIzaSyBvijRdN6wZ6xYWtjJWkXERFJTb1BGAhX8",
  authDomain: "fir-project-8efba.firebaseapp.com",
  projectId: "fir-project-8efba",
  storageBucket: "fir-project-8efba.firebasestorage.app",
  messagingSenderId: "121208450144",
  appId: "1:121208450144:web:3c33b33395848d6d6ca705"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.signOut();
const db = firebase.firestore();

const loginForm = document.getElementById('login-form');
const addressForm = document.getElementById('address-form');
const addressDisplay = document.getElementById('address-display');
const addressContent = document.getElementById('address-content');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const logoutBtnSaved = document.getElementById('logout-btn-saved');
const saveAddressBtn = document.getElementById('save-address-btn');
const loginError = document.getElementById('login-error');
const addressError = document.getElementById('address-error');

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user)
    loginForm.style.display = 'none';
    checkAddressAndUpdateUI(user.uid);
  } else {
    loginForm.style.display = 'block';
    addressForm.style.display = 'none';
    addressDisplay.style.display = 'none';
  }
});

function checkAddressAndUpdateUI(userId) {
  db.collection('addresses').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const address = doc.data();
        addressContent.textContent = `Street: ${address.street}, City: ${address.city}, State: ${address.state}, Zip: ${address.zip}`;
        addressForm.style.display = 'none';
        addressDisplay.style.display = 'block';
      } else {
        addressForm.style.display = 'block';
        addressDisplay.style.display = 'none';
      }
    })
    .catch((error) => {
      console.error('Error checking address:', error);
    });
}

saveAddressBtn.addEventListener('click', () => {
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zip = document.getElementById('zip').value;

  const address = { street, city, state, zip };

  const user = auth.currentUser;
  if (user) {
    db.collection('addresses').doc(user.uid).set(address)
      .then(() => {
        alert('Address saved successfully!');
        checkAddressAndUpdateUI(user.uid); 
      })
      .catch((error) => {
        addressError.textContent = 'Error saving address: ' + error.message;
      });
  } else {
    addressError.textContent = 'User not logged in.';
  }
});

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginError.textContent = '';
  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

signupBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginError.textContent = '';
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Signup successful:', userCredential.user);
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    loginForm.style.display = 'block';
    addressForm.style.display = 'none';
    addressDisplay.style.display = 'none';
  });
});

logoutBtnSaved.addEventListener('click', () => {
  auth.signOut().then(() => {
    loginForm.style.display = 'block';
    addressForm.style.display = 'none';
    addressDisplay.style.display = 'none';
  });
});


