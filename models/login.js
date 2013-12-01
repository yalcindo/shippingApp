var mongoose =require('mongoose');
/**
  * @name name of the messenger-String
  * @loc location where a messenger can pick up the cargo-String
  * @dest destination where a messenger can drop the cargo-String
*/

var userSchema = mongoose.Schema({
    facebookId: Number,
    name: String
});
var User=mongoose.model('User',userSchema);

module.exports.User=User;