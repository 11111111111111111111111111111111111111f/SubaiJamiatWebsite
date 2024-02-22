const { tadribiyaRegDb } = require( '../../db/db' )
const { pagination } = require( './pagination' )
// const pdf = require( 'pdf-creator-node' )
const puppeteer = require( 'puppeteer' )
const fs = require( 'fs' )
const { ObjectId } = require( 'mongodb' )
// const twilio = require( 'twilio' )

async function fetchRegisterationData () {
    let data = await tadribiyaRegDb.find().toArray()
    return data
}

async function AdminPage ( req, res ) {

    const data = await tadribiyaRegDb.find( { status: 'pending' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )
    let adminData = []

    for ( i = start; i < end; i++ ) { //because data is in array i am used less than for condition

        adminData.push( data[ i ] )

    }

    // res.render( 'admin/admin', {
    //     adminData, pagination: {
    //         endPage,
    //         page
    //     }
    // } )
    res.render( 'dashboard/tadribiya/pending', {
        adminData, pagination: {
            endPage,
            page
        }
    } )

}

async function ApprovedPage ( req, res ) {

    const data = await tadribiyaRegDb.find( { status: 'approved' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )

    let adminData = []


    for ( i = start; i < end; i++ ) { //because data is in array i am used less than for condition

        adminData.push( data[ i ] )

    }

    // res.render( 'admin/approved', {
    //     adminData, pagination: {
    //         endPage,
    //         page
    //     }
    // } )
    res.render( 'dashboard/tadribiya/approved', {
        adminData, pagination: {
            endPage,
            page
        }
    } )
}

async function RejectedPage ( req, res ) {
    const data = await tadribiyaRegDb.find( { status: 'rejected' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )

    let adminData = []

    for ( i = start; i < end; i++ ) { //because data is in array i am used less than for condition

        adminData.push( data[ i ] )

    }
    // res.render( 'admin/rejected', {
    //     adminData, pagination: {
    //         endPage,
    //         page
    //     }
    // } )
    res.render( 'dashboard/tadribiya/rejected', {
        adminData, pagination: {
            endPage,
            page
        }
    } )
}



function getRegisterationDataMiddleware ( req, res, next ) {
    if ( req.session.loggedIn != true ) {
        res.redirect( '/adminLogin' )
        return
    }
    next()
}

async function sendMsg ( req, res ) {

    let { id } = req.body

    let password = ''

    for ( i = 1; i <= 6; i++ ) {

        password += Math.floor( Math.random() * 10 )

    }

    await tadribiyaRegDb.updateOne( { _id: new ObjectId( id ) }, { $set: { password: password, status: 'approved' } } )

    let data = await tadribiyaRegDb.findOne( { _id: new ObjectId( id ) } )

    let details = {

        '<%= rollno %>': data.rollno,
        '<%= image %>': data.image,
        // '<%= qualification %>': data.qualification,
        '<%= name %>': data.name,
        // '<%= number %>': data.number,
        // '<%= masjid_name_address %>': data.masjid_name_address

    }
    // |<%= image %
    let html = fs.readFileSync( 'views/pdf.ejs', 'utf-8' )
    html = html.replace( /<%= rollno %>|<%= image %>|<%= name %>/g, ( matched ) => {

        return details[ matched ]

    } )

    const browser = await puppeteer.launch( {
        headless: true,
        // executablePath: '/usr/bin/chromium-browser',
        // headless: 'new'
    } )

    const page = await browser.newPage()

    let pdfName = `${ data.rollno }.pdf`

    await page.setContent( html )

    let generatedPdf = await page.pdf(
        {
            path: `./public/approvedPdf/${ pdfName }`,
            format: 'A6',
            printBackground: true
        }, { waitUntil: '' } )

    await browser.close()


    res.send( {
        status: 'success', to: {
            phone: `${ data.number }`,
            // url: `http://192.168.1.140:5000/approvedPdf/${ pdfName }`,
            url: `https:www.ahlehadeesmumbai.com/approvedPdf/${ pdfName }`,
            message: 'مبارک ہو! دورہ تدریبیہ میں آپ کا اندارج ہوچکا ہے،  نیچے دئے گئے لنک سے آپ اپنا آئی کارڈ ڈاؤنلوڈ کرلیں اور اسے محفوظ رکھیں۔',
            IdAndPassword: `Quiz Id : ${ data.rollno }
             Password : ${ data.password }`
        }
    } )

}

async function rejectMsg ( req, res ) {
    try {
        let { id } = req.body
        await tadribiyaRegDb.updateOne( { _id: new ObjectId( id ) }, { $set: { status: 'rejected' } } )
        let data = await tadribiyaRegDb.findOne( { _id: new ObjectId( id ) } )
        res.send( {
            status: 'success',
            phone: data.number,
            message: 'you are rejected for tadribiya event because of some reasons'

        } )
    } catch ( error ) {
        console.log( error )
        res.send( { status: 'error' } )
    }
}

async function RegisterationData ( req, res ) {
    let adminData = await tadribiyaRegDb.find( { status: 'approved' } ).toArray()
    res.send( adminData )
}

async function RegisterationAllData ( req, res ) {
    let adminData = await fetchRegisterationData()
    res.send( adminData )
}

module.exports = {
    AdminPage: AdminPage,
    middleware: getRegisterationDataMiddleware,
    RejectedPage: RejectedPage,
    ApprovedPage: ApprovedPage,
    sendMsg: sendMsg,
    rejectMsg: rejectMsg,
    RegisterationData: RegisterationData,
    RegisterationAllData: RegisterationAllData
}