// importing...
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import thaiCo from './thaiCo.js';
import vietCo from './vietCo.js';

// app config..
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: '1581198',
  key: '78ff701f11668f966776',
  secret: '41dd236bff31ce13de0f',
  cluster: 'eu',
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Orgin', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
// });

// db config
const connection_url =
  'mongodb+srv://admin:blueBerry@cluster1.wmitr4v.mongodb.net/?retryWrites=true&w=majority';
mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

//pusher config
const collections = ['thaicos', 'vietcos'];
const db = mongoose.connection;
db.once('open', () => {
  console.log('connection open baby');

  collections.forEach((collection) => {
    const msgCo = db.collection(collection);
    const changeStream = msgCo.watch();

    changeStream.on('change', (change) => {
      console.log('stream changed:', change);

      if (change.operationType === 'insert') {
        const msgDetails = change.fullDocument;

        pusher.trigger(collection, 'inserted', {
          name: msgDetails.name,
          message: msgDetails.message,
          timestamp: msgDetails.timestamp,
          received: msgDetails.received,
        });
      } else {
        console.log('something aint pushing');
      }
    });
  });
});

// api routes
app.get('/', (req, res) => res.status(200).send('Heyy'));

app.get('/messages/sync', (req, res) => {
  thaiCo
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/vietmessages/sync', (req, res) => {
  vietCo
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/collections', async (req, res) => {
  try {
    // Get all collection names using Mongoose
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Extract the collection names from the result
    // const collectionNames = collections.map((collection) => collection.name);

    // Return the collection names as response
    res.status(200).send(collections);
  } catch (err) {
    // Handle any errors
    console.error('Failed to get collection names:', err);
    res.status(500).send('Failed to get collection names');
  }
});

const createMessage = (collectionObj) => (req, res) => {
  const dbmessage = req.body;
  // const collection = mongoose.connection.collection(collectionName); // Use the collection name as parameter
  collectionObj
    .create(dbmessage)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

app.post('/thairoom/new', createMessage(thaiCo));
app.post('/vietroom/new', createMessage(vietCo));

//listen
app.listen(port, () => console.log(`listening to port: ${port}`));

// const msgCo = db.collection('thaicos');
// const changeStream = msgCo.watch();

// changeStream.on('change', (change) => {
//   console.log('stream changed:', change);

//   if (change.operationType === 'insert') {
//     const msgDetails = change.fullDocument;

//     pusher.trigger('lang-pusher', 'inserted', {
//       name: msgDetails.name,
//       message: msgDetails.message,
//       timestamp: msgDetails.timestamp,
//       received: msgDetails.received,
//     });
//   } else {
//     console.log('something aint pushing');
//   }
// });

// app.post('/messages/new', (req, res) => {
//   const dbmessage = req.body;
//   thaiCo
//     .create(dbmessage)
//     .then((data) => {
//       res.status(201).send(data);
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });
