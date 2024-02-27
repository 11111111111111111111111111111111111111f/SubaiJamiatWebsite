const { getFatawaTitles } = require( '../methods/fatawa-title' )
const { getFatawaList } = require( '../methods/getFatawaList' )
const commonData = require( '../getCommonData' )
const express = require( 'express' )
const app = express.Router()
const puppeteer = require( 'puppeteer' )
const fatawaTitle = require( '../methods/fatawa-title' )
const fs = require('fs')


app.get( '/fikh-w-fatawa', async ( req, res ) => {

    try {
        let FatawaTitles = await getFatawaTitles()
        const DynamicData = await commonData.getData()
        res.render( 'urdu/fatawaList', { FatawaTitles, DynamicData } )
    } catch ( error ) {
        res.redirect( '/error' );
    }

} )


function readFiles ( path, callback ) {
    fs.readdir( path, ( err, fileNames ) => {
        if ( err ) {
            callback( err, null )
            return
        }
        callback( null, fileNames )
    } )
}

async function renderPageForAllFatawa () {

    let FatawaTitles = await getFatawaTitles()
    FatawaTitles.forEach( value => {

        app.get( `/${ value.No }`, async ( req, res ) => {

            const DynamicData = await commonData.getData()
            let FatawaList = await getFatawaList()

            res.render( 'urdu/fatawa-jawab', { FatawaList, FatawaNumber: value.No, FatawaTitle: value.Title, DynamicData } )

        } )

        //creating a route(web page) for fatawa answer pdf

        app.get( `/fatawa-jawab-${ value.No }`, async ( req, res ) => {
            try {
                let FatawaList = await getFatawaList()
                res.render( 'fatawa-jawab-pdf-page', { FatawaList, FatawaNumber: value.No, FatawaTitle: value.Title } )
            } catch ( er ) {
                console.log( "error occured in temp page", er )
            }
        } )

    } )



}

async function generateAllFatawaJawabPdf () {

    let FatawaTitles = await getFatawaTitles()

    readFiles( './public/fatawaJawabPdf', async ( err, fileNames ) => {
        if ( err ) {
            console.log( "error occured while reading files from public/fatawaJawabPdf" )
            return
        }

        for ( i = 0; i < FatawaTitles.length; i++ ) {

            let pdfName = `fatawa-jawab-${ FatawaTitles[ i ].No }.pdf`;

            if(fileNames.includes(pdfName)){
                console.log(pdfName + " is already created")
                continue ;
            }


            const browser = await puppeteer.launch( {
                headless: 'new',
                // executablePath: '/usr/bin/chromium-browser',
            } )

            const page = await browser.newPage()
            await page.goto( `https://www.ahlehadeesmumbai.com/fatawa-jawab-${ FatawaTitles[ i ].No }`, { waitUntil: 'networkidle0' } )
            await page.emulateMediaType( 'screen' )
            let GeneratedPdf = await page.pdf( {
                path: `./public/fatawaJawabPdf/${ pdfName }`,
                format: 'A4',
                printBackground: true
            } )

            await browser.close()
            console.log( FatawaTitles[ i ].No, "pdf created" )

        }

    } )

}

renderPageForAllFatawa()
generateAllFatawaJawabPdf()



//for arabic page

app.get( '/ar-fikh-w-fatawa', async ( req, res ) => {

    try {
        let FatawaTitles = await getFatawaTitles()
        const DynamicData = await commonData.getData()
        res.render( 'arabic/fatawaList', { FatawaTitles, DynamicData } )
    } catch ( error ) {
        res.redirect( '/error' );
    }

} )

async function renderPageForAllFatawaArabic () {

    let FatawaTitles = await getFatawaTitles()
    FatawaTitles.forEach( value => {

        app.get( `/ar-${ value.No }`, async ( req, res ) => {

            const DynamicData = await commonData.getData()
            let FatawaList = await getFatawaList()


            res.render( 'arabic/fatawa-jawab', { FatawaList, FatawaNumber: value.No, FatawaTitle: value.Title, DynamicData } )

        } )

    } )

}

renderPageForAllFatawaArabic()

module.exports = {
    router: app
}