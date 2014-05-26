var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  superuser: { type: Boolean, default: false }
 
},{ versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

//JSON format
UserSchema.virtual('id').get(function () {
  return this._id;
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj._id;
  return obj;
}

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};








UserSchema.statics.validUsername = function validateUsername(username){
  //check blank
  if(username == "") {
    return {
      isValid:false,
      message:"Username cannot be blank!"
    };
  }

  //check length
  var length = username.length;
  if(length < 6){
    return {
      isValid:false,
      message:"username should be at least 6 character long"
    };
  }

  //check characters
  var re = new RegExp(/^\w+$/);
  if(!re.test(username)) {
    return {
      isValid:false,
      message:"Username must contain only letters, numbers and underscores"
    };
  }

  return {
    isValid:true
  };
}

UserSchema.statics.validPassword = function validateUsername(password){
  var length = password.length;
  if(length < 8){
    return {
      isValid:false,
      message:"password should be at least 8 character long"
    };
  }

  var re = new RegExp(/[0-9]/);
  if(!re.test(password)) {
    return {
      isValid:false,
      message:"password must contain at least one number (0-9)"
    };
  }
  re = new RegExp(/[a-z]/);
  if(!re.test(password)) {
    return {
      isValid:false,
      message:"password must contain at least one lowercase letter (a-z)"
    };
  }
  re = new RegExp(/[A-Z]/);
  if(!re.test(password)) {
    return {
      isValid:false,
      message:"password must contain at least one uppercase letter (A-Z)"
    };
  }

  return {
    isValid:true
  };
}








module.exports = mongoose.model('User', UserSchema);

