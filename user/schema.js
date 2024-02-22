const userSchema = new Schema({
    // ... other fields
    role: {
      type: String,
      enum: ['user', 'admin'], // You can define allowed roles here
      default: 'user' // Default role for new users
    }
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;
  