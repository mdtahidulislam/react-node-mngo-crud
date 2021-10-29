const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 5000;

// user: mydb1
// pass: HCk78BcQyt2Cbi55

// middlewire
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydb1:HCk78BcQyt2Cbi55@cluster0.apq2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//insert data using promise

// client.connect(err => {
//     const collection = client.db("foodMaster").collection("users");
//     // perform actions on the collection object
//     console.log('hitting db');
//     // insert data into db
//     const user = { name: 'Opu Biswas', email: 'opu@gmail.com', phone: 12356789 };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert seccessfully');
//         })
//     // client.close();
// });

// insert data using async

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");
        // GET API
        app.get('/users', async (req, res) => {
            // search query
            const query = {};
            // point cursor to colletion
            const cursor = usersCollection.find(query);
            // tell cursor give data as array 
            const users = await cursor.toArray();
            // get data to ui
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
        })

        // UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedUser = req.body;
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })


        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running port my CRUD server');
})

app.listen(port, () => {
    console.log('runnig port', port);
})