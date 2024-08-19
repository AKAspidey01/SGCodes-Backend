const express = require("express");

require("dotenv").config()


const mongooseConfig = require("./config/mongoose")
const userRoutes = require("./routes/user.routes")
const contactRoutes = require('./routes/contact.routes')


const bodyParser = require('body-parser')
const app = express();
const port = process.env.APP_PORT;


const cors = require("cors");
app.use(cors())

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000" , "http://localhost:3001"];
  // const allowedOrigins = [""];

  const origin = req.headers.origin;
  // console.log(origin, "data");
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  //   res.header("Access-Control-Allow-Origin", ["http://localhost:3000"]);
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Welcome Online Shopping - API Home'));
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/contact' , contactRoutes)
app.use(express.static(`${__dirname}/`));


  app.use((req, res, next) => {
      const error = new Error('Not found');
      error.message = 'Invalid route';
      error.status = 404;
      next(error);
  });


  app.use((error, req, res, next) => {
      res.status(error.status || 500);
      return res.json({
          error: {
              message: error.message,
          },
      });
  });

  async function dbConnect() {
      try {
          await mongooseConfig.connectToServer();
          // saleforceClientQueue.queue.add({ date: new Date() });
          console.log('connected now to mongo db');
      }
      catch (error) {
          console.log('error in mongo connection', error);
      }
  }


  dbConnect();

  app.listen(port, () => {
      console.log(`App listening on port ${port}`);
  }); 