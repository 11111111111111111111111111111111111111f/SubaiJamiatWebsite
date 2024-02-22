const multer = require( 'multer' )

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        if ( file.fieldname == 'image' ) {
            cb( null, './public/RegisterationFiles/Images' )
        } else if ( file.fieldname == 'file' ) {
            cb( null, './public/RegisterationFiles/Files' )
        }
    },

    filename: ( req, file, cb ) => {
        let fileExtension = file.originalname.split( '.' ).pop()
        if ( file.fieldname == 'image' ) {
            cb( null, `RegisterationImage-${ Date.now() }.${ fileExtension }` )
        } else if ( file.fieldname == 'file' ) {
            cb( null, `RegisterationFile-${ Date.now() }.${ fileExtension }` )
        }
    }
} )

const upload = multer( { storage: storage } )

module.exports = {
    upload: upload
}