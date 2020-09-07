const mongoose = require('mongoose')
const Todo = require('../../model/todo')
require('dotenv').config()
console.log(process.env.MONGO_URL)
if(process.env.TESTING === 'true') {
  const Mockgoose = require('mockgoose').Mockgoose
  const mockgoose = new Mockgoose(mongoose)
  mockgoose.prepareStorage()
    .then(() => {
      mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => {
        console.log('Connected to mock DB')
      })
    })
} else {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => {
    console.log('Connected to DB')
  })
}

const db = mongoose.connection

export default async (req, res) => {
  switch(req.method) {
    case 'GET':
      try {
        const {id} = req.query
        if(id) {
          const todo = await Todo.findById(id)
          res.json(todo)
        } else {
          const todos = await Todo.find()
          res.json(todos)
        }
      } catch(err) {
        res.json({message: 'error'})
      }
      break
    case 'POST':
      const todo = new Todo({message: req.body.message})
      try {
        const savedTodo = await todo.save()
        res.status(201).json(savedTodo)
      } catch(err) {
        res.json({ message: err})
      }
      break
    case 'PUT':
      try {
        const {id} = req.query
        const {message} = req.body
        if(!id) {
          throw "No ID given"
        }
        if(!message) {
          throw "No message provided"
        }
        const updatedTodo = await Todo.findByIdAndUpdate(id, {message: message})
        res.json(updatedTodo)
      } catch(err) {
        res.json({message: err})
      }
      break
    case 'DELETE':
      try {
        const {id} = req.query
        if(!id) {
          throw "No ID given"
        }
        const removedTodo = await Todo.findByIdAndDelete(id)
        res.json(removedTodo)
      } catch(err) {
        res.json({message: err})
      }
  }
  
}

// export default (req, res) => {
//   if(req.method === 'GET') {
//     const id = parseInt(req.query.id)
//     if(id) {
//       const todo = db.get('todos').find({ id: id }).value()
//       if(todo) {
//         res.json(todo)
//       } else {
//         res.statusCode = 404
//         res.json({message: 'Cannot find todo'})
//       }
//     } else {
//       const todos = db.get('todos').value()
//       res.statusCode = 200
//       res.json(todos)
//     }
//   } else if(req.method === 'POST') {
//     db.update('count', n => n+1).write()
//     const id = db.get('count').value()
//     const newtodo = {
//       id: id,
//       message: req.body.message
//     }
//     db.get('todos').push(newtodo).write()
//     res.statusCode = 201
//     res.json(newtodo)
//   } else if(req.method === 'PUT') {
//     const id = parseInt(req.query.id)
//     const { message } = req.body
//     let todo = db.get('todos').find({ id: id }).value()
//     if(todo && message) {
//       todo['message'] = message
//       db.get('todos').find({ id: id}).assign(todo).write()
//       res.json(todo)
//     } else {
//       res.statusCode = 404
//       res.json({ message: 'Cannot find todo' })
//     }
//   } else if(req.method === 'DELETE') {
//     const id = parseInt(req.query.id)
//     const response = db.get('todos').remove({id: id}).write()
//     res.json(response)
//   }
// }