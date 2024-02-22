const multer = require( 'multer' )
const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        if ( file.fieldname == 'SafeerImage' ) {
            cb( null, './public/tausia-images' )
        } else if ( file.fieldname == 'document' ) {
            cb( null, './public/tausia-documents' )
        }
    },
    filename: ( req, file, cb ) => {
        if ( file.fieldname == 'SafeerImage' ) {
            let fileExtension = file.originalname.split( '.' ).pop()
            cb( null, `tausia-image-${ Date.now() }.${ fileExtension }` )
        } else if ( file.fieldname == 'document' ) {
            let fileExtension = file.originalname.split( '.' ).pop()
            cb( null, `tausia-document-${ Date.now() }.${ fileExtension }` )
        }
    }
} )

const upload = multer( { storage: storage } )
module.exports = {
    upload: upload
}