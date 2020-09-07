const expect = require('chai').expect
const request = require('supertest')
const server = request('http://localhost:3000')

describe('API - todos', () => {
    var id
    describe('GET /api/todos', () => {
        it('It should GET a list of todos', (done) => {
            server.get('/api/todos')
            .expect(200)
            .end((error, result) => {
                if(error) return done(error)
                expect(result.body).to.be.a('array')
                done()
            })
        })
    })
        
    describe('POST /api/todos', () => {
        it('It should POST a new todo', (done) => {
            const todo = {message: "Test todo"}
            server.post('/api/todos')
            .send(todo)
            .expect(201)
            .end((error, response) => {
                if(error) return done(error)
                expect(response.body).to.be.a('object')
                expect(response.body).to.have.property('_id')
                expect(response.body).have.property('message').eq('Test todo')
                id = response.body._id
                done()
            })
        })
    })

    describe('PUT /api/todos', () => {
        it('It should PUT an existing todo', (done) => {
            const updatedMsg = {message: "updated test todo"}
            server.put('/api/todos?id=' + id)
            .send(updatedMsg)
            .expect(200)
            .end((error, response) => {
                if(error) return done(error)
                expect(response.body).to.be.a('object')
                expect(response.body).to.have.property('_id')
                expect(response.body).have.property('message').eq('Test todo')
                done()
            })
        })
    })

    // describe('DELETE /api/todos', () => {
    //     it('It should PUT an existing todo', (done) => {
    //         server.delete('/api/todos?id=' + id)
    //         .expect(200)
    //         .end((error, response) => {
    //             if(error) return done(error)
    //             expect(response.body).to.be.a('object')
    //             expect(response.body).to.have.property('_id')
    //             expect(response.body).have.property('message').eq('updated test todo')
    //             done()
    //         })
    //     })
    // })
})