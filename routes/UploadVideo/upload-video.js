const multer = require( 'multer' )

function renderVideoUploadPage ( req, res ) {

    res.render( 'upload-video' )

}

function getVideoFromUser ( req, res ) {

    if ( !req.file ) {

        res.send( { status: 'error' } )
        return
    }

    const videoName = req.file.filename
    const link = 'https://ahlehadeesmumbai.com/upload-video/' + videoName

    res.send( { status: 'success', link } )

}

function videoMulter () {

    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => {

            cb( null, './public/upload-video' )

        },
        filename: ( req, file, cb ) => {
            cb( null, file.originalname )
        }
    } )

    const upload = multer( { storage: storage } )
    return upload

}

module.exports = {
    renderVideoUploadPage: renderVideoUploadPage,
    getVideoFromUser: getVideoFromUser,
    videoMulter: videoMulter()

}