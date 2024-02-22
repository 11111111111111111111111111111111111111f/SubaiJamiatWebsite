const { masjidDb, tausiaDb , offlineApprovedTausiaCollection } = require( '../../db/db' )
const { pagination } = require( '../dbApis/pagination' )

const multer = require( 'multer' )
const { ObjectId } = require( 'mongodb' )

function masjidRegisterationPage ( req, res ) {
    res.render( 'masjidRegisteration/masjid_registeration' )
    // res.render( 'dashboard/masjid/authentication/masjid_registeration' )
}

async function MasjidRegisterationPostController ( req, res ) {

    if ( !req.file ) {

        res.send( { status: 'error' } )
        return

    }

    let curr = new Date()
    let year = curr.getFullYear()
    let month = curr.getMonth() + 1
    let date = curr.getDate()
    let today = date + "-" + month + '-' + year
    let userId = await GenerateUserId()

    // let image = req.files.image[ 0 ].filename
    let document = req.file.filename

    try {

        let { MasjidName, MasjidAddress, MasjidLocationLink, MasjidPresidentName, MasjidPresidentNumber, MasjidSecretarieName, MasjidSecretarieNumber } = req.body

        await masjidDb.insertOne( { userId: userId, date: today, MasjidName, MasjidAddress, MasjidLocationLink, MasjidPresidentName, MasjidPresidentNumber, MasjidSecretarieName, MasjidSecretarieNumber, document, status: 'pending' } )

        res.send( { status: 'success' } )

    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

async function masjidRegisterationAdminPage ( req, res ) {


    const data = await masjidDb.find( { status: 'pending' } ).toArray()

    const { start, end, endPage, page } = pagination( data, req.query.page )

    let MasjidData = []

    for ( i = start; i < end; i++ ) {
        MasjidData.push( data[ i ] )
    }

    // res.render( 'masjidRegisteration/admin/masjidRegisterationAdmin', { MasjidData, pagination: { endPage, page } } )
    res.render( 'dashboard/masjid/pending', { MasjidData, pagination: { endPage, page } } )

}

async function masjidRegisterationApproved ( req, res ) {

    const data = await masjidDb.find( { status: 'approved' } ).toArray()

    const { start, end, endPage, page } = pagination( data, req.query.page )

    let MasjidData = []

    for ( i = start; i < end; i++ ) {
        MasjidData.push( data[ i ] )
    }

    // res.render( 'masjidRegisteration/admin/masjidRegisterationApproved', { MasjidData, pagination: { endPage, page } } )
    res.render( 'dashboard/masjid/approved', { MasjidData, pagination: { endPage, page } } )

}

async function masjidRegisterationRejected ( req, res ) {
    const data = await masjidDb.find( { status: 'rejected' } ).toArray()

    const { start, end, endPage, page } = pagination( data, req.query.page )

    let MasjidData = []

    for ( i = start; i < end; i++ ) {
        MasjidData.push( data[ i ] )
    }

    // res.render( 'masjidRegisteration/admin/masjidRegisterationRejected', { MasjidData, pagination: { endPage, page } } )
    res.render( 'dashboard/masjid/rejected', { MasjidData, pagination: { endPage, page } } )
}

function masjidRegisterationMulter () {

    const storage = multer.diskStorage( {

        destination: ( req, file, cb ) => {

            // if ( file.fieldname == 'image' ) {

            //     cb( null, './public/masjidRegisteration/images' )

            // } else if ( file.fieldname == 'document' ) {

            //     cb( null, './public/masjidRegisteration/documents' )

            // }
            cb( null, './public/masjidRegisteration/documents' )

        },

        filename: ( req, file, cb ) => {



            //     if ( file.fieldname == 'image' ) {

            //         let fileExtension = file.originalname.split( '.' ).pop()

            //         let name = `masjidRegisteration-image-${ Date.now() }.${ fileExtension }`
            //         cb( null, name )

            //     } else if ( file.fieldname == 'document' ) {

            //         let fileExtension = file.originalname.split( '.' ).pop()

            //         let name = `masjidRegisteration-document-${ Date.now() }.${ fileExtension }`
            //         cb( null, name )

            //     }

            let fileExtension = file.originalname.split( '.' ).pop()
            let name = `masjidRegisteration-document-${ Date.now() }.${ fileExtension }`
            cb( null, name )

        }
    } )

    const upload = multer( { storage: storage } )

    return upload

}


//approval rejection starts here

async function approveMasjidRegisteration ( req, res ) {

    try {

        let { id } = req.body

        let password = ''
        for ( i = 1; i <= 6; i++ ) {

            let randomNo = Math.floor( Math.random() * 10 )
            password += randomNo

        }

        let data = await masjidDb.findOneAndUpdate( { _id: new ObjectId( id ) }, { $set: { password: password, status: 'approved' } } )

        let number = data.MasjidPresidentNumber
        let message = `آنجناب! الحمدللہ آپ کے مسجد کا اندارج ہو گیا ہے، صوبائی جمعیت اہل حدیث ممبئی کا توصیہ چیک کرنے کے لئے آپ کو ایک آئی ڈی اور پاسورڈ دیا جارہا ہے، اسے محفوظ رکھیں، اور اس کے ذریعہ لاگ ان ہوکر آپ کے پاس آئے ہوئے سفیر کا توصیہ -اصلی ہے یا نقلی- چیک کریں، پھر اس کے بعد ہی اعلان کی اجازت دیں۔
        %0A%0A Id:${ data.userId } %0A Pwd:${ password } %0A%0A
        لاگ ان کے لئے اس لنک پر کلک کریں:
        %0A https://ahlehadeesmumbai.com/tausia-authentication
        `

        res.send( { status: 'success', number: number, message: message } )

    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

async function rejectMasjidRegisteration ( req, res ) {

    try {

        let { id } = req.body
        let data = await masjidDb.findOneAndUpdate( { _id: new ObjectId( id ) }, { $set: { status: 'rejected' } } )

        res.send( { status: 'success', number: data.MasjidPresidentNumber, message: "you're masjid is not approved. because of some reasons" } )

    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}


// render masjid login page
function masjidLogin ( req, res ) {

    // res.render( 'masjidRegisteration/masjid_login' )
    res.render( 'dashboard/masjid/authentication/masjid_login' )

}

//masjid login post method
async function masjidLoginAuthentication ( req, res ) {

    try {
        let { userId, password } = req.body
        let data = await masjidDb.findOne( { userId, password } )

        if ( data ) {

            req.session.masjidId = data._id
            res.send( { status: 'valid' } )

        } else {
            res.send( { status: 'invalid' } )
        }
    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

//middlware for masjid login
function masjidLoginMiddleware ( req, res, next ) {

    if ( req.session.masjidId ) {

        res.redirect( '/tausia-authentication' )
        return
    }
    next()

}

//middleware for user Logged in for tausia authentication form masjid userId and password

function tausiaAuthenticationMiddleware ( req, res, next ) {

    if ( !req.session.masjidId ) {

        res.redirect( '/masjid-login' )
        return

    }
    next()
}

//rendering tausia authentication page
function renderTausiaAuthentication ( req, res ) {

    // res.render( 'masjidRegisteration/tausia_authentication' )
    res.render( 'dashboard/masjid/authentication/tausia_authentication' )

}

//tausia authentication
async function TausiaAuthenticationImage ( req, res ) {

    if ( !req.file ) {
        res.send( { status: 'error' } )
        return
    }

    try {
        let { id, tausiaId, expiryDate } = req.body
        let filename = req.file.filename

        await tausiaDb.updateOne( { _id: new ObjectId( id ) }, { $set: { authenticationImage: filename, tausiaId, expiryDate } } )

        res.send( { status: 'success' } )

    } catch ( error ) {
        res.send( { status: 'error' } )
    }
}

//post method of tausia authentication which sends tausia is real or fake

async function authenticateTausia ( req, res ) {


    try{
        let { tausiaId } = req.body

        let onlineApprovedTausia = await tausiaDb.findOne( { tausiaId: tausiaId } )

        if ( onlineApprovedTausia != null ) {
    
            let imageLink = onlineApprovedTausia.authenticationImage;
    
            if ( imageLink ) {
    
                let currentDate = new Date();
                let expiryDate = new Date( onlineApprovedTausia.expiryDate );
                if ( currentDate <= expiryDate ) {
    
                    res.send( { status: 'valid', image: imageLink , mode : "online" } );
    
                } else {
    
                    res.send( { status: "expired" , mode : "online" } );
    
                }
    
    
            } else {
    
                res.send( { status: 'invalid' } )
    
            }
    
        } else {
    

            let offlineApprovedTausia = await offlineApprovedTausiaCollection.findOne( { tausiaId: tausiaId } )
    
    
            if ( offlineApprovedTausia != null ) {
    
                let imageLink = offlineApprovedTausia.authenticationImage;
    
                if ( imageLink ) {
    
                    let currentDate = new Date();
                    let expiryDate = new Date( offlineApprovedTausia.expiryDate );
                    if ( currentDate <= expiryDate ) {
    
                        res.send( { status: 'valid', image: imageLink , mode : "offline" } );
    
                    } else {
    
                        res.send( { status: "expired" , mode : "offline" } );
    
                    }
    
    
                } else {
    
                    res.send( { status: 'invalid' } )
    
                }
    
            } else {
                res.send( { status: 'no-exist' } )
            }
    
        }
    
    }catch(error){

        res.send({status : 'invalid'})
        
    }



}


//multer code for that image which is uploaded by admin for authentication for tausia
function TausiaAuthenticationMulter () {

    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => {

            cb( null, './public/tausiaAuthenticationImage' )

        },
        filename: ( req, file, cb ) => {

            let fileExtension = file.originalname.split( '.' ).pop()


            cb( null, `authentication-image-${ Date.now() }.${ fileExtension }` )

        }
    } )

    const upload = multer( { storage: storage } )
    return upload

}



//generating userId for masjid
async function GenerateUserId () {

    let previousData = await masjidDb.find().toArray()

    if ( previousData.length == 0 ) {

        let userId = 'M-SJAM-' + 101
        return userId

    } else if ( previousData.length > 0 ) {

        let userId = parseInt( previousData[ previousData.length - 1 ].userId.slice( 7 ) ) + 1
        userId = 'M-SJAM-' + userId
        return userId

    }

}


module.exports = {
    masjidRegisterationPage: masjidRegisterationPage,
    MasjidRegisterationPostController: MasjidRegisterationPostController,
    masjidRegisterationAdminPage: masjidRegisterationAdminPage,
    masjidRegisterationApproved: masjidRegisterationApproved,
    masjidRegisterationRejected: masjidRegisterationRejected,
    masjidRegisterationMulter: masjidRegisterationMulter(),
    approveMasjidRegisteration: approveMasjidRegisteration,
    rejectMasjidRegisteration: rejectMasjidRegisteration,
    TausiaAuthenticationMulter: TausiaAuthenticationMulter(),
    TausiaAuthenticationImage: TausiaAuthenticationImage,
    masjidLogin: masjidLogin,
    masjidLoginMiddleware: masjidLoginMiddleware,
    tausiaAuthenticationMiddleware: tausiaAuthenticationMiddleware,
    renderTausiaAuthentication: renderTausiaAuthentication,
    masjidLoginAuthentication: masjidLoginAuthentication,
    authenticateTausia: authenticateTausia

}