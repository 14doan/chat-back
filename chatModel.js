import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  room: String,
  name: String,
  message: String,
  timestamp: String,
  received: Boolean,
});

export default chatSchema;
// export default mongoose.model('Message', chatSchema);
