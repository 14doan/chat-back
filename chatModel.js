import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  name: String,
  message: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model('Message', chatSchema);
