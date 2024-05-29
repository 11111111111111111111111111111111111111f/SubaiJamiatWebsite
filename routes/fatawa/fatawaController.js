const { getFatawaTitles } = require( '../methods/fatawa-title' )
const { getFatawaList } = require( '../methods/getFatawaList' )
const commonData = require( '../getCommonData' )
const puppeteer = require( 'puppeteer' )
const fatawaTitle = require( '../methods/fatawa-title' )
const fs = require( 'fs' )
const { Fatawa } = require( '../../db/db' )
const { title } = require( 'process' )
const { FatawaQuestionCollection, FatawaAnswerCollection } = Fatawa
const { body, validationResult } = require( 'express-validator' );
const { pagination } = require( '../dbApis/pagination' )
const { ObjectId } = require( 'mongodb' )
const moment = require( 'moment' );
const ejs = require( "ejs" )
const path = require( "path" )

//client urdu
//rendering all fatawa questions list on urdu page
const renderFatawaAnsListPage = async ( req, res ) => {

    try {
        let data = await FatawaAnswerCollection.find().toArray()
        const DynamicData = await commonData.getData()
        res.render( 'urdu/fatawaList', { data, DynamicData } )
    } catch ( error ) {
        res.redirect( '/error' );
    }

}

//rendering fatawa answer page
const renderFatawaAnswerPage = async ( req, res ) => {
    try {
        let { id } = req.params
        if ( !id ) return res.redirect( '/error' )
        let ans = await FatawaAnswerCollection.findOne( { questionerId: id } )
        if ( !ans ) return res.redirect( "/error" )
        const DynamicData = await commonData.getData()
        res.render( "urdu/fatawa-jawab", { ans, DynamicData } )
    } catch ( error ) {
        res.redirect( "/error" )
    }
}


//client arabic
//rendering all fatawa questions list on arabic page
const renderArabicFatawaAnsListPage = async ( req, res ) => {

    try {
        let data = await FatawaAnswerCollection.find().toArray()
        const DynamicData = await commonData.getData()
        res.render( 'arabic/fatawaList', { data, DynamicData } )
    } catch ( error ) {
        res.redirect( '/error' );
    }


}

//api's

//middleware for validation for fatawa question given by user
const FatawaQuestionValidation = [
    body( 'name' ).notEmpty().withMessage( 'Name is required' ),
    body( 'email' ).isEmail().withMessage( 'Invalid email format' ),
    body( 'phoneNo' ).isMobilePhone().withMessage( 'Invalid phone number' ),
    body( 'title' ).notEmpty().withMessage( 'Title is required' ),
    body( 'question' ).notEmpty().withMessage( 'Question is required' ),
    body( 'date' ).custom( ( value ) => {

        const parsedDate = moment( value, 'MM/DD/YYYY', true );
        if ( !parsedDate.isValid() ) {
            throw new Error( 'Invalid date format' );
        }
        // Validation succeeded
        return true;
    } )
]

//getting fatawa question and other data from user and storing to database

const getFatawaQuestionFromUser = async ( req, res ) => {
    try {

        const errors = validationResult( req );

        if ( !errors.isEmpty() ) {
            return res.status( 400 ).json( {
                status: "error",
                message: "You filled something wrong.",
                errors: errors.array()
            } );
        }

        let { date, name, email, phoneNo, title, question } = req.body

        await FatawaQuestionCollection.insertOne( { date, name, email, phoneNo, title, question, isAnswered: false } )

        res.status( 200 ).json( { status: "success", message: "Fatawa question submitted successfully" } );

    } catch ( error ) {
        // console.log( error )
        res.status( 500 ).json( { status: "error", message: "Internal server error" } )
    }
}


//generating answer pdf
const generateFatawaAnswerPdf = async ( req, res ) => {
    try {
        let { id } = req.params
        let data = await FatawaAnswerCollection.findOne( { questionerId: id } )
        if ( !data ) return res.redirect( "/error" )

        const headerImagePath = path.resolve( 'public/images/fatawaJawabPdf/fatawa-header.jpeg' );
        const footerImagePath = path.resolve( 'public/images/fatawaJawabPdf/fatawa-footer.jpeg' );


        const getBase64Image = ( filePath ) => {
            return fs.readFileSync( filePath, { encoding: 'base64' } );
        };

        // Convert images to Base64
        const headerImageBase64 = getBase64Image( headerImagePath );
        const footerImageBase64 = getBase64Image( footerImagePath );

        const browser = await puppeteer.launch( {
            headless: 'new',
            // executablePath: '/usr/bin/chromium-browser',
        } )

        const page = await browser.newPage();

        const html = await ejs.renderFile( "views/fatawa-jawab-pdf-page.ejs", { data: data } )

        await page.setContent( html )

        // await page.addStyleTag( {
        //     content: "@page:first {margin-top: 200px;}"
        // } );


        const pdf = await page.pdf( {
            format: "A4",
            displayHeaderFooter: true,
            headerTemplate: `
            <div style="width: 100%; text-align: center;">
                <img src="data:image/jpeg;base64,${ headerImageBase64 }" style="width:100%;" />
            </div>`,
            footerTemplate: `
            <div style="width: 100%; text-align: center;">
                <img src="data:image/jpeg;base64,${ footerImageBase64 }" style="width: 100%;" />
            </div>
            `,
            margin: {
                top: 220,
                bottom: 150,
            }
        } );



        await browser.close()

        res.contentType( "application/pdf" );
        res.send( pdf );

    } catch ( error ) {
        console.log( error )
        res.redirect( "/error" )
    }
}

//admin

// render fatawa question list on admin page
const renderFatawaQuestionListOnAdmin = async ( req, res ) => {
    try {
        let data = await FatawaQuestionCollection.find( { isAnswered: false } ).toArray()
        const { start, end, endPage, page } = pagination( data, req.query.page )

        let fatawaData = []

        for ( i = start; i < end; i++ ) {
            fatawaData.push( data[ i ] )
        }

        // res.render( 'admin/tausia/tausia-approved', { TausiaData, pagination: { endPage, page } } )
        res.render( 'dashboard/fatawa/fatawa-questions', { fatawaData, pagination: { endPage, page } } )
    } catch ( error ) {
        res.redirect( '/error' )
    }
}

const renderFatawaAnswerListOnAdmin = async ( req, res ) => {

    try {

        let data = await FatawaAnswerCollection.find().toArray()

        const { start, end, endPage, page } = pagination( data, req.query.page )

        let fatawaData = []

        for ( i = start; i < end; i++ ) {
            fatawaData.push( data[ i ] )
        }

        res.render( 'dashboard/fatawa/fatawa-answers', { fatawaData, pagination: { endPage, page } } )

    } catch ( error ) {
        res.redirect( '/error' )
    }

}

// render answer form on admin side
const renderAnswerPageOnAdmin = async ( req, res ) => {
    try {
        let { id } = req.query
        if ( !id ) return res.redirect( '/error' )
        let data = await FatawaQuestionCollection.findOne( { _id: new ObjectId( id ) } )
        if ( !data ) return res.redirect( "/error" )
        res.render( "dashboard/fatawa/fatawa-answer-form", { data } )
    }
    catch ( error ) {
        console.log( 'error occured' )
        res.redirect( '/error' )
    }
}

//render fatawa update form page on admin
const renderFatawaUpdateForm = async ( req, res ) => {
    try {
        let { id } = req.query
        if ( !id ) return res.redirect( "/error" )
        let data = await FatawaAnswerCollection.findOne( { _id: new ObjectId( id ) } )
        if ( !data ) return res.redirect( "/error" )
        res.render( "dashboard/fatawa/update-fatawa-form", { data } )
    } catch ( error ) {
        res.redirect( "/error" )
    }
}

// getting answer given by admin and storing in database
const FatawaAnswerValidation = [
    body( 'date' ).custom( ( value ) => {
        // Attempt to parse the date using moment.js
        const parsedDate = moment( value, 'MM/DD/YYYY', true );
        if ( !parsedDate.isValid() ) {
            throw new Error( 'Invalid date format' );
        }
        // Validation succeeded
        return true;
    } ),
    body( 'id' ).custom( value => {
        if ( !ObjectId.isValid( value ) ) {
            throw new Error( "Invalid id" )
        }
        return true
    } ),
    body( 'questionerName' ).notEmpty().withMessage( 'Name is required' ),
    body( 'questionTitle' ).notEmpty().withMessage( 'Title is required' ),
    body( 'question' ).notEmpty().withMessage( 'Question is required' ),
    body( 'muftiName' ).notEmpty().withMessage( 'Question is required' ),
    body( 'answer' ).notEmpty().withMessage( 'Question is required' ),
]


const getAnswerFromAdmin = async ( req, res ) => {
    try {

        const errors = validationResult( req );

        if ( !errors.isEmpty() ) {
            return res.status( 400 ).json( {
                status: "error",
                message: "You filled something wrong.",
                errors: errors.array()
            } );
        }

        let { date, id, questionerName, questionTitle, question, muftiName, answer } = req.body
        await FatawaAnswerCollection.insertOne( { date, questionerId: id, questionerName, questionTitle, question, muftiName, answer } )

        await FatawaQuestionCollection.updateOne( { _id: new ObjectId( id ) }, { $set: { isAnswered: true } } )
        res.status( 200 ).json( { status: "success", message: "Answer added successfully" } )
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json( { status: "error", message: "Internal server error" } )
    }
}

//delete answer
const deleteAnswer = async ( req, res ) => {
    try {
        let { id } = req.query
        if ( !id ) return res.redirect( "/error" )
        let data = await FatawaAnswerCollection.findOneAndDelete( { _id: new ObjectId( id ) } )
        await FatawaQuestionCollection.updateOne( { _id: new ObjectId( data.questionerId ) }, { $set: { isAnswered: false } } )
        res.redirect( '/fatawa-answers-list' )
    } catch ( error ) {
        res.redirect( "/error" )
    }
}

const updateAnswer = async ( req, res ) => {
    try {

        const errors = validationResult( req );

        if ( !errors.isEmpty() ) {
            return res.status( 400 ).json( {
                status: "error",
                message: "You filled something wrong.",
                errors: errors.array()
            } );
        }

        let { id } = req.params
        let { date, questionerName, questionTitle, question, muftiName, answer } = req.body

        await FatawaAnswerCollection.updateOne( { _id: new ObjectId( id ) }, { $set: { date, questionerName, questionTitle, question, muftiName, answer } } )

        res.status( 200 ).json( { status: "success", message: "Answer updated successfully" } )
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json( { status: "error", message: "Internal server error" } )
    }
}

module.exports = {
    client: {
        renderFatawaAnsListPage: renderFatawaAnsListPage,
        renderArabicFatawaAnsListPage: renderArabicFatawaAnsListPage,
        FatawaQuestionValidation,
        getFatawaQuestionFromUser: getFatawaQuestionFromUser,
        renderFatawaAnswerPage: renderFatawaAnswerPage,
        generateFatawaAnswerPdf: generateFatawaAnswerPdf
    },
    admin: {
        renderFatawaQuestionListOnAdmin: renderFatawaQuestionListOnAdmin,
        renderAnswerPageOnAdmin: renderAnswerPageOnAdmin,
        FatawaAnswerValidation,
        getAnswerFromAdmin: getAnswerFromAdmin,
        renderFatawaAnswerListOnAdmin: renderFatawaAnswerListOnAdmin,
        renderFatawaUpdateForm: renderFatawaUpdateForm,
        updateAnswer: updateAnswer,
        deleteAnswer: deleteAnswer
    }
}