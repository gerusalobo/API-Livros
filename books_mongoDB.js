use books

db.createCollection("bookslist") 

//select count(*)
db.bookslist.countDocuments()

//selects

db.getCollection('bookslist').find({})

db.bookslist.find({})

db.getCollection('bookslist').find({'editora': 'Wiley'})