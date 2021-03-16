### Sign in to FireBase

> Add firebase extensions to vsode for better view

- sign into fire base
- create a project
- create an app [ android , ios , webApp]
- Paste cdn link into a public/index.html file on the root dir
- Get extensions to use in app ie fireStore, Authentication, analytics
- **npm i -g firebase for** firebase cli
- run **firebase login** to connect terminals to google account
- run **firebase init** in the root dir of the app
- select emulators and hosting as a starter
- Do not override existing index.html if it exist
- The rest should stay default
  > Note new files will be created  
-run **firebase serve** to open live-reload serve
-run **firebase deploy** to run a live production deploy

## User Authentication

- first create a dummy user in the Firebase Authentication console and grant sign=in option methods to desired providers like google ,apple etc
- create two divs for whenSignedIn and whenSignedOut to display something
- Place a button to trigger our firebase events
- Open up app.js
>> const auth = firebase.auth()
-- this returns the google provider popup
>const provider = new firebase.auth.GoogleAuthProvider()

>onSignin = () => auth.signInWithPopup(provider)
>onsignOut = () => auth.signOut()

### Interact with users after signin

-- check firebase storage in console to view users signed in suesfully


