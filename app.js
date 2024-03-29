const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const exphbs = require('express-handlebars')
const methodOverride = require("method-override")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const connectDB = require("./config/db")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// Load config
dotenv.config({ path: './config/config.env' })
const mongoURI = process.env.MONGO_URI

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer and cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowedFormats: ["jpeg", "png", "jpg"],
  }
})

const upload = multer({ storage: storage })

module.exports = upload;

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

//Handlebars Helpers

const { formatDate, truncate, stripTags, editIcon, select } = require("./helpers/hbs")

// Handlebars
app.engine('.hbs',
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: '.hbs'
  }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Sessions (must go above passport middleware)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI })
}))


// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//Static Folder
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use('/', require("./routes/index"))
app.use('/auth', require("./routes/auth"))
app.use('/stories', require("./routes/stories"))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))