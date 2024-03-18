const { quiz, tadribiyaRegDb } = require( '../../db/db' )
const { quizQuestionListDb, quizRegisterationDb, quizResultDb } = quiz
const { ObjectId } = require( 'mongodb' );
//all rendering functions are here

async function renderQuizPage ( req, res ) {

    try {

        const QuizData = await quizQuestionListDb.findOne( { active: true } );
        let isLoggedIn = req.session.quizLoggedIn

        if ( isLoggedIn ) {

            if ( QuizData ) {
                let userId = req.session.quizUserId;
                let quizId = QuizData._id.toString();

                let isAlreadyPlayed = await quizResultDb.findOne( { quizRegisterationId: userId, quizId: quizId } );


                if ( isAlreadyPlayed ) {
                    return res.redirect( '/quiz-result' );
                }

            }
        }

        if ( QuizData ) {
            res.render( "quiz/quiz", { isQuizAvailable: true, quizId: QuizData._id, QuizData: QuizData.quizQuestions, QuizTitle: QuizData.quizTitle } )
            // res.render( "tadribiyaRegisteration/tadribiyaQuiz/quiz", { QuizData } )
        } else {
            res.render( "quiz/quiz", { isQuizAvailable: false } );
        }
    } catch ( error ) {
        console.log( error )
        res.redirect( '/error' );
    }

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

// async function renderQuizResultPage ( req, res ) {
//     const userData = await tadribiyaRegDb.findOne( { rollno: req.session.quizId } )
//     res.render( 'tadribiyaRegisteration/tadribiyaQuiz/quizResult', { userData } )
// }



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

            let userId = isExist._id.toString();
            let QuizData = req.session.quizData;

            req.session.quizLoggedIn = true
            req.session.quizUserId = userId;

            if ( QuizData ) {

                let isAlreadyPlayed = await quizResultDb.findOne( { quizRegisterationId: userId, quizId: QuizData.quizId } );

                if ( isAlreadyPlayed ) {
                    return res.status( 200 ).json( { status: "success", saved: "already" } );
                }

                await saveQuizDataToDb( req.session.quizData, req.session.quizUserId );

                res.status( 200 ).json( { status: "success", saved: "current" } );
            } else {
                res.status( 200 ).json( { status: "success", saved: "unknown" } );
            }

        } else {
            res.send( { status: "no-exist" } )
        }

    } catch ( error ) {
        console.log( error )
        res.send( { status: "failure" } )
    }

}

async function saveQuizDataToDb ( quizData, userId ) {

    // let quizData = req.session.quizData
    let quizPlayedData = quizData.data
    let dataKeys = Object.keys( quizPlayedData )

    let data = dataKeys.map( value => {
        let key = value.substring( 1 )
        return { questionNo: parseInt( key ), correct_option: quizPlayedData[ value ] }
    } )

    //total questions in quiz
    let totalQuestions = data.length
    //correct questions which answer is given by the user
    // let questionList = await quizQuestionListDb.find( { _id: new ObjectId( quizData.quizId ), quizQuestions: { $elemMatch: { $or: data } } } ).toArray()
    // let userId = req.session.quizUserId

    let questionList = await quizQuestionListDb.findOne( { _id: new ObjectId( quizData.quizId ) } )

    let { quizQuestions } = questionList;

    let userCorrectOptions = 0;

    for ( let i = 0; i < quizQuestions.length; i++ ) {
        if ( quizQuestions[ i ].questionNo == data[ i ].questionNo && quizQuestions[ i ].correct_option == data[ i ].correct_option ) {
            userCorrectOptions++;
        }
    }

    quizResultDb.insertOne( { quizRegisterationId: userId, quizId: quizData.quizId, totalQuestions: totalQuestions, result: userCorrectOptions, choicedQuestions: quizPlayedData } )

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
        if ( req.session.quizLoggedIn == true ) {
            saveQuizDataToDb( req.body, req.session.quizUserId );
            return res.status( 200 ).json( { status: "success", isLoggedIn: true } );
        }
        req.session.quizData = data
        return res.status( 200 ).json( { status: "success", isLoggedIn: false } )
    } catch ( error ) {
        res.send( { status: "failure" } )
    }
}



//all quiz admin methods
function renderAddQuizpage ( req, res ) {
    res.render( "dashboard/quiz/add-quiz" );
}

async function renderShowQuizPage ( req, res ) {

    //if admin wants to start or stop the quiz then the following code will work
    let QuizId = req.query.quizId;
    let action = req.query.action;
    let Result = req.query.result;

    if ( QuizId && action ) {
        return startStopQuiz( QuizId, action, res );
    }

    if ( QuizId && Result ) {
        return releaseResult( QuizId, Result, res );
    }

    let AllQuiz = await quizQuestionListDb.find().toArray()
    return res.render( 'dashboard/quiz/show-quiz', { AllQuiz } );
}

async function renderQuizDetailsPage ( req, res ) {
    let quizId = req.query.quizId;
    if ( quizId ) {
        let data = await quizQuestionListDb.findOne( { _id: new ObjectId( quizId ) } );
        if ( data != null ) {
            return res.render( "dashboard/quiz/quiz-details", { data } );
        }
    }
    return res.redirect( '/show-quiz' );
}

async function startStopQuiz ( QuizId, action, res ) {
    try {
        let active = action == "start" ? true : false;
        if ( active == true ) {
            await quizQuestionListDb.updateOne( { active: true }, { $set: { active: false } } );
        }
        await quizQuestionListDb.updateOne( { _id: new ObjectId( QuizId ) }, { $set: { active: active } } );
        return res.redirect( '/show-quiz' );
    } catch ( error ) {
        return res.redirect( '/show-quiz' );
    }
}

async function releaseResult ( QuizId, Result, res ) {
    try {
        let result = Result == "enable" ? "enable" : "disable";
        await quizQuestionListDb.updateOne( { _id: new ObjectId( QuizId ) }, { $set: { result: result } } )
        return res.redirect( "/show-quiz" );
    } catch ( error ) {
        return res.redirect( '/show-quiz' );
    }
}

async function renderQuizResultPage ( req, res ) {
    try {
        let userId = req.session.quizUserId.toString()
        let AllQuizResult = await quizResultDb.find( { quizRegisterationId: userId } ).toArray();
        let QuizResult = [];

        for ( i = 0; i < AllQuizResult.length; i++ ) {
            let result = AllQuizResult[i];
            let quizId = result.quizId;
            let quiz = await quizQuestionListDb.findOne( { _id: new ObjectId( quizId ) } );
            if ( quiz.result == 'enable' ) {
                let temp = result;
                temp.quizTitle = quiz.quizTitle;
                QuizResult.push( temp );
            }
        }

        res.render( "quiz/quiz-result", { QuizResult } );
    } catch ( error ) {
        console.log( error )
        res.redirect( "/error" );
    }
}

//add quiz api controller
async function addQuiz ( req, res ) {
    try {
        let data = req.body;
        console.log( data );
        await quizQuestionListDb.updateMany( { active: true }, { $set: { active: false } } );
        await quizQuestionListDb.insertOne( data );
        res.status( 200 ).json( { status: "success" } );
    } catch ( error ) {
        res.status( 500 ).json( { status: "failure", message: "Internal Server Error" } );
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
    saveQuizDataToSession: saveQuizDataToSession,
    renderAddQuizpage: renderAddQuizpage,
    addQuiz: addQuiz,
    renderShowQuizPage: renderShowQuizPage,
    renderQuizDetailsPage: renderQuizDetailsPage
}