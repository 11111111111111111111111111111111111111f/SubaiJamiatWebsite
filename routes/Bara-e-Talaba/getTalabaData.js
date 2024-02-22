const multer = require( 'multer' )
const { tausiaTalabaDb } = require( '../../db/db' )

async function getTalabaData ( req, res ) {

    try {




        if ( !req.files ) {
            res.send( { status: 'error' } )

            return
        }

        // getting date when user submitted tausia
        let curr = new Date()
        let year = curr.getFullYear()
        let month = curr.getMonth() + 1
        let date = curr.getDate()
        let today = date + "-" + month + '-' + year

        const { StudentName, Address, StudentNumber, JamiaCollegeNameAddress, Degree, MarufShakhsName, MarufShakhsNumber, TausiaReason } = req.body

        const documentName = req.files.document[ 0 ].filename
        const imageName = req.files.image[ 0 ].filename

        const userId = await GenerateUserId()


        await tausiaTalabaDb.insertOne( { userId: userId, date: today, StudentName, Address, StudentNumber, JamiaCollegeNameAddress, Degree, MarufShakhsName, MarufShakhsNumber, TausiaReason, document: documentName, image: imageName, status: 'pending', query: 'pending' } )


        res.send( { status: 'success' } )

    } catch ( error ) {
        console.log( error )
        res.send( { status: "error" } )
    }


}

function talabaDocumentMulter () {

    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => {

            if ( file.fieldname == 'document' ) {

                cb( null, './public/TausiaTalaba/documents' )

            } else if ( file.fieldname == 'image' ) {

                cb( null, './public/TausiaTalaba/images' )

            }


        },
        filename: ( req, file, cb ) => {

            let fileExtension = file.originalname.split( '.' ).pop()
            let uniqueNumber = Date.now()
            if ( file.fieldname == 'document' ) {

                cb( null, `Tausia-Talaba-Document-${ uniqueNumber }.${ fileExtension }` )

            } else if ( file.fieldname == 'image' ) {

                cb( null, `Tausia-Talaba-Image-${ uniqueNumber }.${ fileExtension }` )

            }

        }


    } )

    const upload = multer( { storage: storage } )
    return upload

}

async function GenerateUserId () {

    let previousData = await tausiaTalabaDb.find().toArray()
    if ( previousData.length == 0 ) {

        let userId = 'Tausia-Talaba-2023-' + 1
        return userId

    } else if ( previousData.length > 0 ) {

        let userId = parseInt( previousData[ previousData.length - 1 ].userId.slice( 19 ) ) + 1
        userId = 'Tausia-Talaba-2023-' + userId
        return userId

    }

}


async function TausiaTalabaLimitationMiddleware ( req, res, next ) {

    let TausiaTalabaData = await tausiaTalabaDb.find().toArray()
    let curr = new Date()
    let year = curr.getFullYear()
    let month = curr.getMonth()
    let currMonthTausiaList = TausiaTalabaData.filter( value => {

        let dbDate = value.date.split( '-' )

        let DateToFiltered = new Date( `${ dbDate[ 1 ] }-${ dbDate[ 0 ] }-${ dbDate[ 2 ] }` )
        if ( DateToFiltered.getFullYear() == year && DateToFiltered.getMonth() == month ) {

            return value

        }

    } )

    if ( currMonthTausiaList.length >= 20 ) {

        res.send( { status: 'full' } )
        return

    }

    next()

}



module.exports = {

    getTalabaData: getTalabaData,
    talabaDocumentMulter: talabaDocumentMulter(),
    TausiaTalabaLimitationMiddleware: TausiaTalabaLimitationMiddleware

}