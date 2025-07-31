Visage

Visage is a workout tracking app designed to help users manage their exercise routines. Users can create and follow workout collections, marking them as completed to automatically cycle through their schedule. Built with React and powered by Node.js with MongoDB, the app ensures a seamless and user-friendly experience.

## 🚀 Live Demo
👉 Click here to visit the website  

https://gymtracker-jt83.onrender.com/


## 📸 Screenshot
[![Visage]([https://github.com/lswebdevelops/GymTracker/uploads/screenshot.png](https://gymtracker-jt83.onrender.com/))](http://github.com/lswebdevelops/GymTracker/blob/main/frontend/src/assets/GymTracker-logo.png)

## 🛠️ Tech Stack
- **Frontend:** React, HTML, CSS  
- **Backend:** Node.js, MongoDB  
- **Authentication:** Google Login  
- **Hosting:** Render  

## 🎯 Features
✅ Users can create their own workout collections  
✅ Admin can create predefined workout plans  
✅ Users only see their own collections  
✅ Simple and intuitive interface  
✅ Responsive design for all devices  

## 📂 Setup
### Clone the repository
```sh
git clone https://github.com/yourusername/GymTracker.git
```
### Navigate to the project directory
```sh
cd GymTracker

### comment /server.js like: 
// uncomment for production build
// then add this script to the root package.json (   "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend") and to .env :> NODE_ENV=development change to production

// if (process.env.NODE_ENV === 'production') {
//   //  set static folder
//   app.use(express.static(path.join(__dirname, '/frontend/build')));

//   // any route that is not api will be redirected to index.html
//   app.get('*', (req, res) => 
//   res.sendFile(path.resolve(__dirname, 'frontend', 'build' , 'index.html')))
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }
// comment until here


```

### Install dependencies
```sh
npm install

npm start

### Navigate to the project frontend directory:
cd frontend

npm i 
npm start



## 💡 How to Contribute
Feel free to fork the repository and submit a pull request with your improvements!

## 📄 License
This project is licensed under the MIT License.

