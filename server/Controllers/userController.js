const User = require('../Models/UserSchema')

// here is the get function
exports.getUser = (request, response, next) => {
  // console.log(request)
  const id = request.body.User._id
  User.findOne({ _id: id })
    .then(data => {
      response.status(200).json({ message: 'user is here', data: data })
    })
    .catch(error => {
      next(error)
    })
}

//here is the delete function
exports.deleteUser = (request, response, next) => {
  const id = request.User._id
  User.deleteOne({ _id: id })
    .then(data => {
      if (data == null) throw new Error('the user is not Found!')
      response.status(200).json({ message: 'deleted', data })
    })
    .catch(error => next(error))
}
