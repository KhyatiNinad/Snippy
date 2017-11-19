// config/SnippetManager.js


// load up the model
var Snippet       		= require('../app/models/snippet');


// expose this function to our app using module.exports
module.exports = {

    saveSnippet: function(data, callback)
    {
        var snp = new Snippet(data);

        console.log("Save: " + data.id);
        var query = { 'id': data.id };
        
        Snippet.findOneAndUpdate(query, data, { upsert: true }, function (err, doc) {
            if (err)
                callback(err);

            callback([]);
        });

    },
    deleteSnippet: function (data, callback) {
        var snp = new Snippet(data);

        console.log("delete: " + data.id);
        var query = { 'id': data.id };

        Snippet
            .remove({ id: data.id }, function(err) {
                if (!err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });

    },
    getAllData: function (data, callback)
    {
        if (data.type === "mySnippets") {
            Snippet.find({userId: data.searchTerm}, function (err, docs) {
                // docs.forEach
                var records = [];
                if (!err)
                    records = docs;
                console.log("Recrods" + records.length);
                if (callback)
                    callback(records);
            });
        }
        else
        {
            var re = new RegExp(data.searchTerm, 'i');

            Snippet.find().or([{ 'title': { $regex: re } }, { 'tags': { $regex: re } }])
                .exec(function (err, docs) {
                // docs.forEach
                var records = [];
                if (!err)
                    records = docs;
                console.log("Recrods" + records.length);
                if (callback)
                    callback(records);
            });

        }
    }
};
