const { tausiaTalabaDb } = require( '../../db/db' )
const { pagination } = require( '../dbApis/pagination' )
const puppeteer = require( 'puppeteer' )
const PDFMerger = require( 'pdf-merger-js' )
const { ObjectId } = require( 'mongodb' )
const fs = require( 'fs' )

async function renderAdminPage ( req, res ) {

    const data = await tausiaTalabaDb.find( { query: 'pending' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )


    let TalabaData = []
    for ( i = start; i < end; i++ ) {

        TalabaData.push( data[ i ] )

    }

    // res.render( 'admin/tausiaTalaba/talaba-admin', { TalabaData, pagination: { endPage, page } } )
    res.render( 'dashboard/TausiaTalaba/pending', { TalabaData, pagination: { endPage, page } } )

}

async function renderApprovePage ( req, res ) {

    const data = await tausiaTalabaDb.find( { query: 'approved' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )


    let TalabaData = []
    for ( i = start; i < end; i++ ) {

        TalabaData.push( data[ i ] )

    }

    // res.render( 'admin/tausiaTalaba/talaba-approved', { TalabaData, pagination: { endPage, page } } )
    res.render( 'dashboard/TausiaTalaba/approved', { TalabaData, pagination: { endPage, page } } )

}

async function renderRejectPage ( req, res ) {

    const data = await tausiaTalabaDb.find( { query: 'rejected' } ).toArray()
    const { start, end, endPage, page } = pagination( data, req.query.page )


    let TalabaData = []
    for ( i = start; i < end; i++ ) {

        TalabaData.push( data[ i ] )

    }

    // res.render( 'admin/tausiaTalaba/talaba-rejected', { TalabaData, pagination: { endPage, page } } )
    res.render( 'dashboard/TausiaTalaba/rejected', { TalabaData, pagination: { endPage, page } } )

}

async function approveTalabaTausia ( req, res ) {

    try {

        let { id } = req.body
        let data = await tausiaTalabaDb.findOneAndUpdate( { _id: new ObjectId( id ) }, { $set: { query: 'approved' } } )

        let number = data.StudentNumber
        let message = `محترم! الحمداللہ آپ کے توصیہ کا اندراج ہو گیا ہے، توصیہ کا اپڈیٹ چیک کرنے کے لئے آپ کو ، ایک آئی ڈی دیا جا رہا ہے، جسکے ذریعے آپ اپنے توصیہ کے متع
            لق اپڈیٹ چیک کرسکتے ہیں۔
        %0A
        Id:${ data.userId }%0A
        اپڈیٹ چیک کرنے کے لئے اس لنک پر کلک کریں:
        %0A https://ahlehadeesmumbai.com/check-talaba-status
        `

        res.send( { status: 'success', message: message, number: number } )

    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

async function rejectTalabaTausia ( req, res ) {

    try {
        let { id } = req.body
        let data = await tausiaTalabaDb.findOneAndUpdate( { _id: new ObjectId( id ) }, { $set: { query: 'rejected' } } )

        let number = data.StudentNumber
        let message = `
        شرائط کے مطابق نہ ہونے کی وجہ سے آپ کا اپلیکشن ریجیکٹ ہوگیا ہے`

        res.send( { status: 'success', message: message, number: number } )
    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

async function updateTalabaStatus ( req, res ) {

    try {
        let { id } = req.params
        let { status } = req.body
        await tausiaTalabaDb.updateOne( { _id: new ObjectId( id ) }, { $set: { status: status } } )
        res.send( { status: 'success' } )
    } catch ( error ) {
        res.send( { status: 'error' } )
    }

}

function renderCheckTalabaStatus ( req, res ) {
    // res.render( 'admin/tausiaTalaba/view-talaba-status' )
    res.render( 'dashboard/TausiaTalaba/view-talaba-status' )
}

async function checkTalabaStatus ( req, res ) {

    let { userId } = req.body
    try {
        const status = await tausiaTalabaDb.findOne( { userId: userId } )

        if ( !status ) {
            res.send( { status: 'invalid' } )
        } else if ( status.query == 'approved' ) {
            res.send( { status: 'approved', message: status.status } )
        } else {
            res.send( { status: 'not-approved' } )
        }
    } catch ( error ) {

        res.send( { status: 'error' } )

    }

}

async function GeneratePdf ( req, res ) {

    try {
        let { id } = req.body

        let data = await tausiaTalabaDb.findOne( { _id: new ObjectId( id ) } )


        // let html = fs.readFileSync( './views/admin/tausiaTalaba/generate-pdf.ejs', 'utf-8' )
        let html = fs.readFileSync( './views/dashboard/TausiaTalaba/generate-pdf.ejs', 'utf-8' )

        let details = {
            '<%= userId %>': data.userId,
            '<%= date %>': data.date,
            '<%= StudentName %>': data.StudentName,
            '<%= Address %>': data.Address,
            '<%= StudentNumber %>': data.StudentNumber,
            '<%= JamiaCollegeNameAddress %>': data.JamiaCollegeNameAddress,
            '<%= Degree %>': data.Degree,
            '<%= MarufShakhsName %>': data.MarufShakhsName,
            '<%= MarufShakhsNumber %>': data.MarufShakhsNumber,
            '<%= TausiaReason %>': data.TausiaReason,
            '<%= image %>': data.image,

        }

        html = html.replace( /<%= userId %>|<%= date %>|<%= StudentName %>|<%= Address %>|<%= StudentNumber %>|<%= JamiaCollegeNameAddress %>|<%= Degree %>|<%= MarufShakhsName %>|<%= MarufShakhsNumber %>|<%= TausiaReason %>|<%= image %>/g, ( matched ) => {
            return details[ matched ]
        } )

        const browser = await puppeteer.launch( {
            headless: 'new',
            // executablePath: '/usr/bin/chromium-browser',
        } )

        const page = await browser.newPage()

        let pdfName = `Tausia-Talaba-Pdf-${ data.userId }.pdf`

        // await page.setContent( html )
        await page.goto( 'data:text/html;charset=UTF-8,' + html, { waitUntil: 'networkidle0' } )

        // await page.pdf( {
        //     path: `./public/TausiaApproved/${ pdfName }`,
        //     format: 'A4',
        //     scale: 0.8
        // } )
        const bufferPdf = await page.pdf()

        await browser.close()

        attachmentPdf = fs.readFileSync( `./public/TausiaTalaba/documents/${ data.document }` )

        const merger = new PDFMerger()
        await merger.add( bufferPdf )
        await merger.add( attachmentPdf )
        const mergedBuffer = await merger.saveAsBuffer()
        fs.writeFileSync( `./public/TausiaTalaba/pdf/${ pdfName }`, mergedBuffer )

        res.send( { status: 'success', pdf: pdfName } )
    } catch ( error ) {
        console.log( error )
        res.send( { status: 'error' } )
    }

}

module.exports = {
    renderAdminPage: renderAdminPage,
    approveTalabaTausia: approveTalabaTausia,
    rejectTalabaTausia: rejectTalabaTausia,
    renderApprovePage: renderApprovePage,
    renderRejectPage: renderRejectPage,
    updateTalabaStatus: updateTalabaStatus,
    renderCheckTalabaStatus: renderCheckTalabaStatus,
    checkTalabaStatus: checkTalabaStatus,
    GeneratePdf: GeneratePdf
}