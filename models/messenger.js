var mongoose =require('mongoose');
/**
  * @name name of the messenger-String
  * @loc location where a messenger can pick up the cargo-String
  * @dest destination where a messenger can drop the cargo-String
*/

var messengerSchema = mongoose.Schema({
    name: String,
    origin:Array,
    dest:Array
});
var Messenger=mongoose.model('Messenger',messengerSchema);

module.exports.Messenger=Messenger;