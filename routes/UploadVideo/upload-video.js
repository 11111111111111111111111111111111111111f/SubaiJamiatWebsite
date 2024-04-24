const multer = require( 'multer' )
const fs = require( 'fs' )

function renderVideoUploadPage ( req, res ) {

    res.render( 'dashboard/video/upload-video' )

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

function formatFileSize ( size ) {
    if ( size < 1024 ) {
        return size + ' B';
    } else if ( size < 1024 * 1024 ) {
        return ( size / 1024 ).toFixed( 2 ) + ' KB';
    } else if ( size < 1024 * 1024 * 1024 ) {
        return ( size / ( 1024 * 1024 ) ).toFixed( 2 ) + ' MB';
    } else {
        return ( size / ( 1024 * 1024 * 1024 ) ).toFixed( 2 ) + ' GB';
    }
}

async function allVideos ( req, res ) {
    try {
        const videoDir = "public/upload-video";
        const videoFiles = await fs.promises.readdir( videoDir );
        const videos = await Promise.all( videoFiles.map( async ( file ) => {
            const stats = await fs.promises.stat( `${ videoDir }/${ file }` );
            return {
                name: file,
                size: formatFileSize( stats.size )
            };
        } ) );
        res.render( "dashboard/video/allVideos", { videos } )
    } catch ( err ) {
        console.log( err )
        res.redirect( '/error' );
    }
}

async function deleteVideo ( req, res ) {
    try {
        let video = req.params.video
        await fs.promises.unlink( `public/upload-video/${ video }` )
        res.status( 200 ).json( { status: "success" } )
    } catch ( err ) {
        console.log( err )
        res.status( 500 ).json( { status: "error" } )
    }
}

module.exports = {
    renderVideoUploadPage: renderVideoUploadPage,
    getVideoFromUser: getVideoFromUser,
    videoMulter: videoMulter(),
    allVideos: allVideos,
    deleteVideo: deleteVideo

}