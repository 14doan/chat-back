import mongoose from 'mongoose';
import chatSchema from './chatModel.js';

// Create a model for the first collection using the common schema
const vietCo = mongoose.model('vietCo', chatSchema);

// Export the model for the first collection
export default vietCo;
