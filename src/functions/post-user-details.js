const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

let conn = null;

exports.handler = async function(event, context, callback) {
  console.log('trying');
  const body = JSON.parse(event.body);
  console.log(body);
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
  const User = mongoose.model('User', PersonSchema);
  const uri = process.env.MONGO_URL

  if (conn == null) {
    try {
      console.log('trying to connect');
      conn = await mongoose.connect(
        uri,
        {
          bufferCommands: false, // Disable mongoose buffering
          bufferMaxEntries: 0, // and MongoDB driver buffering
          useNewUrlParser: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  const user = new User({
    Email: 'testing_from_function@tested.com',
    Address: '123 fake st. New York City, NY 10023',
    IdentityID: '798f2522-aab3-4e01-84ee-8331f3b83e6b',
  });
  const newUser = await user.save();
  console.log(newUser);

  console.log('done');

  const doc = await User.findOne({ email: 'testing_from_function@tested.com' });
  console.log(doc);

  return doc;
};
