const { tausiaDb } = require( '../../db/db' )
const { ObjectId } = require( 'mongodb' )
const commonData = require( '../getCommonData' )
const multer = require( 'multer' )

function tausiaUpdateLoginPage ( req, res ) {

    res.render( 'update-tausia-login' )

}

async function getUpdateTausiaRegisterationData ( req, res ) {


    let { userId, password } = req.body


    let valid = await tausiaDb.findOne( { userId: userId, password: password } )

    // console.log( valid )

    if ( valid == null ) {

        res.send( { status: 'invalid' } )

    } else {

        req.session.userLoggedIn = true
        req.session.dbId = valid._id
        res.send( { status: 'valid' } )

    }

}

async function updatePage ( req, res ) {

    try {
        let id = req.session.dbId
        let data = await tausiaDb.findOne( { _id: new ObjectId( id ) } )
        const DynamicData = await commonData.getData()
        //because id is already an object there for there is no need to  use new ObjectId(id) use id
        res.render( 'update-tausia-registeration', { data, DynamicData } )
    } catch ( error ) {
        res.redirect( '/error' )
    }

}

async function updateTausiaData ( req, res ) {

    try {
        let data = req.body
        id = req.session.dbId
        let updated = await tausiaDb.updateOne( { _id: new ObjectId( id ) }, { $set: data } )
        res.send( { status: 'success' } )
    } catch ( error ) {
        res.send( { status: 'error' } )
    }

}


//middlewares are here

function LoggedInMiddleware ( req, res, next ) {

    if ( req.session.userLoggedIn == true ) {
        res.redirect( '/update-tausia-registeration' )
        return
    }
    next()

}

function LoggedOutMiddleware ( req, res, next ) {

    if ( req.session.userLoggedIn != true ) {
        res.redirect( '/tausia-update-registeration-login' )
        return
    }
    next()

}

function updateTausiaFiles () {


    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => {
            if ( file.fieldname == 'SafeerImage' ) {

                cb( null, './public/tausia-images' )
            } else if ( file.fieldname == 'document' ) {
                cb( null, './public/tausia-documents' )
            }
        },
        filename: ( req, file, cb ) => {
            let filename = file.originalname
            cb( null, filename )
        }
    } )

    const upload = multer( { storage: storage } )

    return upload

}

module.exports = {
    tausiaUpdateLoginPage: tausiaUpdateLoginPage,
    getUpdateTausiaRegisterationData: getUpdateTausiaRegisterationData,
    updatePage: updatePage,
    updateTausiaFiles: updateTausiaFiles(),
    updateTausiaData: updateTausiaData,
    LoggedInMiddleware: LoggedInMiddleware,
    LoggedOutMiddleware: LoggedOutMiddleware
}