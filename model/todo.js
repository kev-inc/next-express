const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  }
})

const Todo = new mongoose.model('Todo', todoSchema)

module.exports = Todo