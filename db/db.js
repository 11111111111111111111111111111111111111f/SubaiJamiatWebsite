const { MongoClient } = require( 'mongodb' )
const url = 'mongodb://127.0.0.1:27017' //for local system
// const url = "mongodb://sj_registeration:Zambeel7012@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.0"
const client = new MongoClient( url )

function createConnection () {
    const db = client.db( 'sj_registeration' )
    const collection = db.collection( 'Registeration_Details' )
    return collection
}

function tausiaCollectionConnection () {
    const db = client.db( 'sj_registeration' )
    const collection = db.collection( 'tausia' )
    return collection
}

function masjidRegisterationCollection () {
    const db = client.db( 'sj_registeration' )
    const collection = db.collection( 'masjid_registeration' )
    return collection
}

function tausiaTalabaCollectionConnection () {
    const db = client.db( 'sj_registeration' )
    const collection = db.collection( 'tausia_talaba' )
    return collection
}

function quizQuestionListCollection () {

    const db = client.db( 'sj_registeration' )
    const collection = db.collection( 'QuizQuestionList' )
    return collection

}

function quizRegisterationCollection(){
    const db = client.db('sj_registeration')
    const collection = db.collection('QuizRegisteration')
    return collection
}

function offlineApprovedTausiaCollection(){

    const db = client.db('sj_registeration')
    const collection = db.collection('OfflineApprovedTausia')
    return collection

}

module.exports = {
    tadribiyaRegDb: createConnection(),
    tausiaDb: tausiaCollectionConnection(),
    masjidDb: masjidRegisterationCollection(),
    tausiaTalabaDb: tausiaTalabaCollectionConnection(),
    quiz : {
        quizQuestionListDb: quizQuestionListCollection(),
        quizRegisterationDb : quizRegisterationCollection()
    },
    offlineApprovedTausiaCollection: offlineApprovedTausiaCollection()
}