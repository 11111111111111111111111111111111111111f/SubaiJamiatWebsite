let { tadribiyaRegDb } = require( '../../db/db' )

async function getRegisterationData ( req, res ) {
    const { name, number, qualification, masjid_name_address, masjid_president, masjid_seceratory, coming_reason } = req.body
    let imageName = req.files.image[ 0 ].filename
    let FileName = req.files.file[ 0 ].filename
    let fetchData = await tadribiyaRegDb.find().toArray()
    if ( fetchData.length == 0 ) {

        const insertedData = await tadribiyaRegDb.insertOne( { rollno: '23T701', name, number, qualification, masjid_name_address, masjid_president, masjid_seceratory, coming_reason, image: imageName, pdf: FileName, status: 'pending', isQuizPlayed: false } )

    } else {

        // let rollno = parseInt( fetchData[ fetchData.length - 1 ].rollno.slice( '5' ) ) + 1
        // rollno = '23T70' + rollno
        //const insertedData = await tadribiyaRegDb.insertOne( { rollno: rollno, name, number, qualification, masjid_name_address, masjid_president, masjid_seceratory, coming_reason, image: imageName, pdf: FileName, status: 'pending' } )

        let rollno = parseInt( fetchData[ fetchData.length - 1 ].rollno.slice( '3' ) )

        if ( rollno >= 70100 ) {
            rollno = '23T' + 801
            const insertedData = await tadribiyaRegDb.insertOne( { rollno: rollno, name, number, qualification, masjid_name_address, masjid_president, masjid_seceratory, coming_reason, image: imageName, pdf: FileName, status: 'pending', isQuizPlayed: false } )
        } else {

            rollno++
            rollno = '23T' + rollno
            const insertedData = await tadribiyaRegDb.insertOne( { rollno: rollno, name, number, qualification, masjid_name_address, masjid_president, masjid_seceratory, coming_reason, image: imageName, pdf: FileName, status: 'pending' } )

        }

    }


    res.json( { status: 'success' } )

}

async function tadribiyaLogin ( req, res ) {

    let { userId, password } = req.body

    let matched = await tadribiyaRegDb.findOne( { rollno: userId, password } )

    if ( matched ) {


        req.session.quizLoggedIn = true
        req.session.quizId = matched.rollno
        req.session.isQuizPlayed = matched.isQuizPlayed

        res.send( { status: "success" } )
        return

    } else {
        res.send( { status: "error", message: "Please enter valid credentials" } )
        return
    }

}

function isLoggedIn ( req, res ) {
    if ( req.session.quizLoggedIn == true ) {
        return true
    } else {
        return false
    }
}

function tadribiyaRegAndLogInMiddleware ( req, res, next ) {
    let loggedIn = isLoggedIn( req, res )
    if ( loggedIn == true ) {
        res.redirect( "/tadribiya-quiz" )
        return
    } else {
        next()
    }
}

function tadribiyaQuizMiddleware ( req, res, next ) {
    let loggedIn = isLoggedIn( req, res )
    if ( loggedIn == true ) {
        next()

    } else {
        res.redirect( "/tadribiya-login" )
        return
    }
}

function isQuizPlayed ( req, res ) {

    let isQuizPlayed = req.session.isQuizPlayed
    if ( isQuizPlayed == true ) {
        return true
    } else {
        return false
    }
}

function QuizPageMiddleware ( req, res, next ) {
    if ( isQuizPlayed( req, res ) == true ) {
        return res.redirect( "/quiz-result" )
    }
    next()
}

function QuizResultMiddleware ( req, res, next ) {
    if ( !isQuizPlayed( req, res ) ) {
        return res.redirect( "/tadribiya-quiz" )
    }
    next()
}

module.exports = {
    getRegisterationData: getRegisterationData,
    tadribiyaLogin: tadribiyaLogin,
    tadribiyaRegAndLogInMiddleware: tadribiyaRegAndLogInMiddleware,
    tadribiyaQuizMiddleware: tadribiyaQuizMiddleware,
    QuizPageMiddleware: QuizPageMiddleware,
    QuizResultMiddleware: QuizResultMiddleware
}