var mongo = require('mongodb');
var mongoose = require('mongoose');


const Schema = mongoose.Schema;
const urlsSchema = new Schema({
    longUrl:  String,
    shortUrl: Number
});

const URL = mongoose.model('urls', urlsSchema);


exports.createNew = function(longUrl,done){
    // return done(null,"shortURL")
    isCollEmpty(function(err,res){
        if (err) return done(err);
        if(res){
            const url = new URL({ longUrl: longUrl, shortUrl: 1})
            url.save(function(err,data){
                if(err) return done(err, null)
                else{
                    return done(null, data.shortUrl)
                }
            })
        }else{
            isUrlinDB(longUrl, function(err,res){
                if(err) return done(err)
                if(res){
                    console.log("already present")
                    return done(null, res)
                }else{
                    findLargestUrl(function(err,res){
                        const shortID = res + 1;
                        const url = new URL({longUrl:longUrl, shortUrl:shortID})

                        url.save(function(err,data){
                            if(err) return done(err)
                            if(data){
                                return done(null,data.shortUrl)
                            }
                        })
                    })
                }
            })
        }
    });
}


function isCollEmpty(done){
    URL.countDocuments(function(err,count){
        if(!err && count === 0){
            return done(null,true);
        }else if (err){
            return done(err)
        }else{
            return done(null, false)
        }
    });
}

function isUrlinDB(url,callback){
    URL.findOne({longUrl:url}, function(err,data){
        if(err) return callback(err)
        if(data){
            return callback(null,data.shortUrl)
        }else{
            return callback(null, null)
        }
    })
}

function findLargestUrl(callback){
    URL.find().sort({ shortUrl:-1 }).limit(1)
        .exec(function(err, data) {
        if (err) return callback(err, null); 
        return callback(null, data[0].shortUrl);
    });
}