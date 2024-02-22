const middleware = require( '../methods/getTausia' )
const { tausiaDb } = require( '../../db/db' )
const db = require( '../../db/db' )

async function getTausiaData ( req, res ) {

    try {


        if ( !req.files.SafeerImage || !req.files.document ) {

            res.send( { status: 'error' } )
            return
        }

        let SafeerImage = req.files.SafeerImage[ 0 ].filename //this variables previous name was image

        let document = req.files.document[ 0 ].filename

        let { Qism, Braye, MasjidMadarsaName, MasjidMadarsaAddress, SocietyTrustName, TotalNumberOfStudents, TotalNumberOfAqamtiStudents, SocietyTrustPresidentNameNumber, SocietyTrustSecretarieNameNumber, SafeerName, SafeerNumber, DistrictJamiatAmirNazimNameNumber, SubaiJamiatAmirNazimNameNumber, TausiaReason } = req.body

        // getting date when user submitted tausia
        let curr = new Date()
        let year = curr.getFullYear()
        let month = curr.getMonth() + 1
        let date = curr.getDate()
        let today = date + "-" + month + '-' + year

        let userId = await GenerateUserId()

        let dataSend = await tausiaDb.insertOne( { userId, date: today, Qism, Braye, MasjidMadarsaName, MasjidMadarsaAddress, SocietyTrustName, TotalNumberOfStudents, TotalNumberOfAqamtiStudents, SocietyTrustPresidentNameNumber, SocietyTrustSecretarieNameNumber, SafeerName, SafeerNumber, DistrictJamiatAmirNazimNameNumber, SubaiJamiatAmirNazimNameNumber, SafeerImage, Document: document, status: 'pending', query: 'pending', TausiaReason } )


        res.send( { status: 'success' } )
    } catch ( error ) {
        console.log( error )
        res.send( { status: 'error' } )
    }

}

function getTausiaImage ( req, res ) {

    //     if ( !req.file ) {
    //         res.send( { status: 'error' } )
    //         return
    //     }
    //     let image = req.file.filename
    //     let imgUrl = `https://www.ahlehadeesmumbai.com/tausia-images/${ image }`

    //     res.send( { status: 'success', imgUrl: imgUrl } )
}

// async function tausiaMiddleware ( req, res, next ) {
//     let tausiaData = await middleware.getTausiaData()
//     let curr = new Date()
//     let year = curr.getFullYear()
//     let month = curr.getMonth() + 1
//     let curr_Month_Tausia = tausiaData.filter( value => {
//         let filterDate = new Date( value.Date )
//         if ( filterDate.getFullYear() == year && filterDate.getMonth() + 1 == month ) {
//             return value
//         }
//     } )
//     if ( curr_Month_Tausia.length >= 20 ) {
//         res.send( { status: 'full' } )
//         return
//     }
//     next()
// }

async function tausiaMiddleware ( req, res, next ) {

    let tausiaData = await tausiaDb.find().toArray()
    let curr = new Date()
    let year = curr.getFullYear()
    let month = curr.getMonth()
    let currMonthTausiaList = tausiaData.filter( value => {

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


//generating userId for tausia
async function GenerateUserId () {

    let previousData = await tausiaDb.find().toArray()
    let currentYear = new Date().getFullYear()

    if ( previousData.length == 0 ) {

        let userId = `Tausia-${currentYear}-` + 1
        return userId

    } else if ( previousData.length > 0 ) {

        let userId = parseInt( previousData[ previousData.length - 1 ].userId.slice( 12 ) ) + 1
        userId = `Tausia-${currentYear}-` + userId
        return userId

    }

}


module.exports = {

    getTausiaImage: getTausiaImage,
    tausiaMiddleware: tausiaMiddleware,
    getTausia: getTausiaData,

}