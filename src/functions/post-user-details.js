const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

let conn = null;

exports.handler = async function(event, context, callback) {
  const uri = process.env.MONGO_URL;
  console.log('trying');
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event.method);
  console.log(event.body);

  const PersonSchema = new mongoose.Schema({
    Email: {
      type: String,
      required: true,
      trime: true,
    },
    Address: {
      type: String,
      required: false,
      trime: true,
    },
    IdentityID: {
      type: String,
      required: true,
    },
    AvatarUrl: {
      type: String,
      required: false,
    },
  });

  PersonSchema.plugin(timestamp);

  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    conn.model('User', PersonSchema);
  }

  const UserModel = conn.model('User');
  const user = new UserModel({
    Email: 'testing2@tested.com',
    Address: '123 fake st. New York City, NY 10023',
    IdentityID: '798f2522-aab3-4e01-84ee-8331f3b83e6b',
    useNewUrlParser: true,
  });
  const newUser = await user.save();
  console.log(newUser);

  const doc = await UserModel.findOne({ Email: 'testing2@tested.com' });
  console.log(doc);

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(doc),
  });
};
