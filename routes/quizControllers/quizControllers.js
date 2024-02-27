const { quiz, tadribiyaRegDb } = require( '../../db/db' )
const { quizQuestionListDb, quizRegisterationDb } = quiz
//all rendering functions are here

async function renderQuizPage ( req, res ) {

    const QuizData = await quizQuestionListDb.find().toArray()

    res.render( "quiz/quiz", { QuizData } )
    // res.render( "tadribiyaRegisteration/tadribiyaQuiz/quiz", { QuizData } )

}

function renderQuizRegisterationPage ( req, res ) {
    res.render( "quiz/quiz-registeration" )
}

function renderQuizLoginPage ( req, res ) {
    res.render( "quiz/quiz-login" )
}

function renderQuizRules ( req, res ) {
    res.render( "quiz/quiz-rules" )
}

async function renderQuizResultPage ( req, res ) {
    const userData = await tadribiyaRegDb.findOne( { rollno: req.session.quizId } )
    res.render( 'tadribiyaRegisteration/tadribiyaQuiz/quizResult', { userData } )
}



// all logic methods are here

async function saveQuizRegisterationData ( req, res ) {

    try {
        let data = req.body

        let isExist = await quizRegisterationDb.findOne( { number: data.number } )

        if ( isExist == null ) {
            let inserted = await quizRegisterationDb.insertOne( data )
            if ( inserted.acknowledged == true ) {
                res.send( { status: "success" } )
            } else {
                res.send( { status: "failure" } )
            }
        } else {
            res.send( { status: "exist" } )
        }

    } catch ( error ) {
        res.send( { status: "failure" } )
    }

}

async function QuizLoginAuthorization ( req, res ) {

    try {

        let data = req.body

        let isExist = await quizRegisterationDb.findOne( { number: data.number, password: data.password } )

        if ( isExist != null ) {
            req.session.quizLoggedIn = true
            res.send( { status: "success" } )

        } else {
            res.send( { status: "no-exist" } )
        }

    } catch ( error ) {
        res.send( { status: "failure" } )
    }

}

function saveQuizDataSessionToDb(){

}

function isLoggedIn ( req ) {

    if ( req.session.quizLoggedIn == true ) {
        return true;
    } else {
        return false;
    }

}

function loginRegPageMiddleware ( req, res, next ) {
    if ( isLoggedIn( req ) ) {

        return res.redirect( '/quiz-rules' )

    }
    next()
}

function quizPageMiddleware ( req, res, next ) {

    if ( !isLoggedIn( req ) ) {
        return res.redirect( '/quiz-login' )
    }

    next()
}

async function quizResult ( req, res ) {

    let data = req.body
    let dataKeys = Object.keys( data )

    data = dataKeys.map( value => {

        let key = value.substring( 1 )
        return { questionNo: parseInt( key ), correct_option: data[ value ] }
    } )

    //total questions in quiz
    let totalQuestions = data.length
    //correct questions which answer is given by the user
    let questionList = await quizQuestionListDb.find( { $or: data } ).toArray()

    let userId = req.session.quizId

    tadribiyaRegDb.updateOne( { rollno: userId }, { $set: { totalQuestions: totalQuestions, result: questionList.length, isQuizPlayed: true } } )

    req.session.isQuizPlayed = true

    res.redirect( '/quiz-result' )

}

function saveQuizDataToSession ( req, res ) {

    try {
        let data = req.body
        console.log( data )
        req.session.quizData = data
        res.send( { status: "success" } )
    } catch ( error ) {
        res.send( { status: "failure" } )
    }
}

module.exports = {
    renderQuizPage: renderQuizPage,
    quizResult: quizResult,
    renderQuizResultPage: renderQuizResultPage,
    renderQuizRegisterationPage: renderQuizRegisterationPage,
    saveQuizRegisterationData: saveQuizRegisterationData,
    renderQuizLoginPage: renderQuizLoginPage,
    QuizLoginAuthorization: QuizLoginAuthorization,
    quizPageMiddleware: quizPageMiddleware,
    loginRegPageMiddleware: loginRegPageMiddleware,
    renderQuizRules: renderQuizRules,
    saveQuizDataToSession : saveQuizDataToSession
}