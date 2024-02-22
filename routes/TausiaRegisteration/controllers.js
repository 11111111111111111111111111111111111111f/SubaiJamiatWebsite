const { tausiaDb, offlineApprovedTausiaCollection } = require( '../../db/db' )
const ObjectId = require( 'mongodb' ).ObjectId
const puppeteer = require( 'puppeteer' )
const PDFMerger = require( 'pdf-merger-js' )
const fs = require( 'fs' )
const { pagination } = require( '../dbApis/pagination' )
const multer = require( 'multer' )

async function AdminPage ( req, res ) {

    try {
        // let search = req.query.search
        // if ( search == null || search == undefined ) {
        //     let TausiaData = await tausiaDb.find().toArray()
        //     res.render( 'admin/tausia/tausia-admin', { TausiaData } )
        // } else {
        //     res.render( 'admin/tausia/tausia-admin', { TausiaData: [ { message: 'user searched something' } ] } )
        // }

        const data = await tausiaDb.find( { query: 'pending' } ).toArray()
        const { start, end, endPage, page } = pagination( data, req.query.page )


        let TausiaData = []

        for ( i = start; i < end; i++ ) {
            TausiaData.push( data[ i ] )
        }

        // res.render( 'admin/tausia/tausia-admin', { TausiaData, pagination: { endPage, page } } )
        res.render( 'dashboard/tausia/pending', { TausiaData, pagination: { endPage, page } } )

    } catch ( error ) {
        res.redirect( '/error' )
    }

}

async function approvePage ( req, res ) {

    try {

        let data = await tausiaDb.find( { query: 'approved' } ).toArray()
        const { start, end, endPage, page } = pagination( data, req.query.page )


        let TausiaData = []

        for ( i = start; i < end; i++ ) {
            TausiaData.push( data[ i ] )
        }

        // res.render( 'admin/tausia/tausia-approved', { TausiaData, pagination: { endPage, page } } )
        res.render( 'dashboard/tausia/approved', { TausiaData, pagination: { endPage, page } } )

    } catch ( error ) {
        res.redirect( '/error' )
    }

}

async function rejectPage ( req, res ) {

    try {

        let data = await tausiaDb.find( { query: 'rejected' } ).toArray()

        const { start, end, endPage, page } = pagination( data, req.query.page )


        let TausiaData = []

        for ( i = start; i < end; i++ ) {
            TausiaData.push( data[ i ] )
        }

        // res.render( 'admin/tausia/tausia-rejected', { TausiaData, pagination: { endPage, page } } )
        res.render( 'dashboard/tausia/rejected', { TausiaData, pagination: { endPage, page } } )

    } catch ( error ) {
        res.redirect( '/error' )
    }

}



//approval and rejection of tausia

async function ApproveTausia ( req, res ) {

    try {

        let data = req.body

        // let password = ''
        // for ( i = 1; i <= 6; i++ ) {

        //     let randomNo = Math.floor( Math.random() * 10 )
        //     password += randomNo
        // }

        // let ApprovedData = await tausiaDb.findOneAndUpdate( { _id: new ObjectId( data.id ) }, { $set: { query: 'approved', password: password } } )

        // let message = `محترم! الحمدللہ آپ کے توصیہ کا اندارج ہو گیا ہے، توصیہ کا اپڈیٹ چیک کرنے کے لئے آپ کو ایک آئی ڈی اور پاسورڈ دیا جارہا ہے، اسے محفوظ رکھیں، کیونکہ اسی کے ذریعہ آپ لاگ ان ہوکر اپنے توصیہ کے متعلق اپڈیٹ چیک کرسکیں گے۔ مزید یہ کہ فارم میں کچھ تصحیح اور ایڈٹ کرنے کی ضرورت ہو تو یہیں سے کرسکیں گے۔
        // %0A%0A Id:${ ApprovedData.userId } %0A Pwd:${ password } %0A لاگ ان کے لئے اس لنک پر کلک کریں:
        // %0A https://www.ahlehadeesmumbai.com/update-tausia-registeration`

        let ApprovedData = await tausiaDb.findOneAndUpdate( { _id: new ObjectId( data.id ) }, { $set: { query: 'approved' } } )


        let message = `محترم! الحمداللہ آپ کے توصیہ کا اندراج ہو گیا ہے، توصیہ کا اپڈیٹ چیک کرنے کے لئے آپ کو ، ایک آئی ڈی دیا جا رہا ہے، جسکے ذریعے آپ اپنے توصیہ کے متعلق اپڈیٹ چیک کرسکتے ہیں۔
            %0A%0A Id:${ ApprovedData.userId }
            %0A اپڈیٹ چیک کرنے کے لئے اس لنک پر کلک کریں:
            %0A https://ahlehadeesmumbai.com/check-tausia-status
        `

        res.send( { status: 'success', number: ApprovedData.SafeerNumber, message } )


    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

//form for uploading tausia online of offline given tausia
function ApproveOfflineTausia ( req, res ) {

    res.render( 'dashboard/tausia/approve-offline-tausia' )

}

async function OfflineApprovedTausiaList ( req, res ) {
    let data = await offlineApprovedTausiaCollection.find().toArray()
    res.render( 'dashboard/tausia/offline-approved-tausia-list', { data } )
}

async function uploadOfflineReleasedTausia ( req, res ) {
    if ( !req.file ) {
        return res.send( { status: "error", message: "Please upload file properly" } )
    }

    try {

        let { Date, tausiaId, expiryDate } = req.body
        let filename = req.file.filename

        let isExist = await offlineApprovedTausiaCollection.findOne( { tausiaId: tausiaId } )
        console.log(isExist)

        if ( isExist != null ) {
            await offlineApprovedTausiaCollection.updateOne( { tausiaId }, { $set: { Date, tausiaId, expiryDate, authenticationImage: filename } } )
        }else{
            await offlineApprovedTausiaCollection.insertOne( { Date, tausiaId, expiryDate, authenticationImage: filename } )
        }


        res.send( { status: "success" } )


    } catch ( error ) {

        res.send( { status: "error", message: "Something went wrong" } )

    }


}

function uploadOfflineReleasedTausiaMulter () {

    const storage = multer.diskStorage( {
        destination: ( req, file, cb ) => {

            cb( null, './public/offlineApprovedTausiaImage' )

        },
        filename: ( req, file, cb ) => {

            let fileExtension = file.originalname.split( '.' ).pop()
            cb( null, `authentication-image-${ Date.now() }.${ fileExtension }` )

        }
    } )

    const upload = multer( { storage: storage } )
    return upload

}

async function RejectTausia ( req, res ) {

    try {

        let data = req.body

        let rejectedData = await tausiaDb.findOneAndUpdate( { _id: new ObjectId( data.id ) }, { $set: { query: 'rejected' } } )

        let message = `شرائط کے مطابق نہ ہونے کی وجہ سے آپ کا اپلیکشن ریجیکٹ ہوگیا ہے`

        res.send( { status: 'success', number: rejectedData.SafeerNumber, message } )

    } catch ( error ) {
        res.send( { status: 'error' } )
    }

}

async function updateTausiaStatus ( req, res ) {

    try {
        let id = req.params.id
        let { status } = req.body
        await tausiaDb.updateOne( { _id: new ObjectId( id ) }, { $set: { status: status } } )
        res.send( { status: 'success' } )

    } catch ( error ) {

        res.send( { status: 'error' } )

    }
}

async function GenerateTausiaPdf ( req, res ) {

    try {
        let id = req.body.id

        let data = await tausiaDb.findOne( { _id: new ObjectId( id ) } )


        // let html = fs.readFileSync( './views/admin/tausia/generate-pdf.ejs', 'utf-8' )
        let html = fs.readFileSync( './views/dashboard/tausia/generate-pdf.ejs', 'utf-8' )

        let details = {
            '<%= userId %>': data.userId,
            '<%= date %>': data.date,
            '<%= SafeerImage %>': data.SafeerImage,
            '<%= Qism %>': data.Qism,
            '<%= Braye %>': data.Braye,
            '<%= MasjidMadarsaName %>': data.MasjidMadarsaName,
            '<%= MasjidMadarsaAddress %>': data.MasjidMadarsaAddress,
            '<%= SocietyTrustName %>': data.SocietyTrustName,
            '<%= TotalNumberOfStudents %>': data.TotalNumberOfStudents,
            '<%= TotalNumberOfAqamtiStudents %>': data.TotalNumberOfAqamtiStudents,
            '<%= SocietyTrustPresidentNameNumber %>': data.SocietyTrustPresidentNameNumber,
            '<%= SocietyTrustSecretarieNameNumber %>': data.SocietyTrustSecretarieNameNumber,
            '<%= SafeerName %>': data.SafeerName,
            '<%= SafeerNumber %>': data.SafeerNumber,
            '<%= DistrictJamiatAmirNazimNameNumber %>': data.DistrictJamiatAmirNazimNameNumber,
            '<%= SubaiJamiatAmirNazimNameNumber %>': data.SubaiJamiatAmirNazimNameNumber,
            '<%= TausiaReason %>': data.TausiaReason
        }

        html = html.replace( /<%= userId %>|<%= date %>|<%= SafeerImage %>|<%= Qism %>|<%= Braye %>|<%= MasjidMadarsaName %>|<%= MasjidMadarsaAddress %>|<%= SocietyTrustName %>|<%= TotalNumberOfStudents %>|<%= TotalNumberOfAqamtiStudents %>|<%= SocietyTrustPresidentNameNumber %>|<%= SocietyTrustSecretarieNameNumber %>|<%= SafeerName %>|<%= SafeerNumber %>|<%= DistrictJamiatAmirNazimNameNumber %>|<%= SubaiJamiatAmirNazimNameNumber %>|<%= TausiaReason %>/g, ( matched ) => {
            return details[ matched ]
        } )

        const browser = await puppeteer.launch( {
            headless: 'new',
            // executablePath: '/usr/bin/chromium-browser',
        } )

        const page = await browser.newPage()

        let pdfName = `Tausia-Approved-${ data.userId }.pdf`

        // await page.setContent( html )
        await page.goto( 'data:text/html;charset=UTF-8,' + html, { waitUntil: 'networkidle0' } )

        // await page.pdf( {
        //     path: `./public/TausiaApproved/${ pdfName }`,
        //     format: 'A4',
        //     scale: 0.8
        // } )
        const bufferPdf = await page.pdf()

        await browser.close()

        attachmentPdf = fs.readFileSync( `./public/tausia-documents/${ data.Document }` )

        const merger = new PDFMerger()
        await merger.add( bufferPdf )
        await merger.add( attachmentPdf )
        const mergedBuffer = await merger.saveAsBuffer()
        fs.writeFileSync( `./public/TausiaApproved/${ pdfName }`, mergedBuffer )

        res.send( { status: 'success', pdf: pdfName } )
    } catch ( error ) {
        console.log( error )
        res.send( { status: 'error' } )
    }

}

async function checkStatus ( req, res ) {

    // res.render( 'admin/tausia/view-status' )
    res.render( 'dashboard/tausia/view-status' )

}

async function sendStatus ( req, res ) {

    let { userId } = req.body
    try {
        let status = await tausiaDb.findOne( { userId: userId } )

        if ( !status ) {

            res.send( { status: 'invalid' } )

        } else if ( status.query == 'approved' ) {

            res.send( { status: 'approved', message: status.status } )

        } else {

            res.send( { status: 'not-approved', message: "This userId is not approved for tausia" } )

        }
    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}


//display uploaded images by admin to admin on tausia-authenticated-users page
async function tausiaAuthenticatedUsers ( req, res ) {

    let TausiaData = await tausiaDb.find( { authenticationImage: { $exists: true, $ne: null } } ).toArray()

    // res.render( 'admin/tausia/tausia-authenticated-users', { TausiaData } )
    res.render( 'dashboard/tausia/authenticated-users', { TausiaData } )

}

module.exports = {

    AdminPage: AdminPage,
    approvePage: approvePage,
    rejectPage: rejectPage,
    ApproveTausia: ApproveTausia,
    RejectTausia: RejectTausia,
    updateTausiaStatus: updateTausiaStatus,
    GenerateTausiaPdf: GenerateTausiaPdf,
    checkStatus: checkStatus,
    sendStatus: sendStatus,
    tausiaAuthenticatedUsers: tausiaAuthenticatedUsers,
    ApproveOfflineTausia: ApproveOfflineTausia,
    uploadOfflineReleasedTausia: uploadOfflineReleasedTausia,
    uploadOfflineReleasedTausiaMulter: uploadOfflineReleasedTausiaMulter(),
    OfflineApprovedTausiaList: OfflineApprovedTausiaList

}