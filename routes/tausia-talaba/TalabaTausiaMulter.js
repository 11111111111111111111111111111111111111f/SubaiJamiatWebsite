const multer = require( 'multer' )

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, './public/TausiaTalabaImages' )
    },
    filename: ( req, file, cb ) => {
        let fileExtension = file.originalname.split( '.' ).pop()
        cb( null, `tausia-talaba-${ Date.now() }.${ fileExtension }` )
    }
} )

const upload = multer( { storage: storage } )

module.exports = {
    upload: upload
}