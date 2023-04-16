import mongoose from 'mongoose';
import chatSchema from './chatModel.js';

// Create a model for the first collection using the common schema
const thaiCo = mongoose.model('thaiCo', chatSchema);

// Export the model for the first collection
export default thaiCo;
