const express = require( 'express' )
const router = express.Router()
const quizControllers = require( '../../quizControllers/quizControllers' )
const AdminPage = require( '../../dbApis/fetchRegisterationData' )

//all get apis are here

//quiz registeration route

//with middleware
// router.get( '/quiz-registeration', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizRegisterationPage )
//without middleware

//quiz registeration page
//with middleware
router.get( '/quiz-registeration', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizRegisterationPage )
//without middleware
router.get( '/quiz-registeration', quizControllers.renderQuizRegisterationPage )
//after submittion  quiz logic
// router.post('/quiz-submittion' , quizControllers.quizSubmittion)


//quiz login route
//with middleware
router.get( '/quiz-login', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizLoginPage )
//without middleware
// router.get( '/quiz-login', quizControllers.renderQuizLoginPage )

//quiz rules page
//with middleware
// router.get( '/quiz-rules', quizControllers.quizPageMiddleware, quizControllers.renderQuizRules )
//without middleware
router.get( '/quiz-rules', quizControllers.renderQuizRules )
//quiz page
//with middleware
// router.get( '/quiz', quizControllers.quizPageMiddleware , quizControllers.renderQuizPage )
router.get( '/quiz', quizControllers.renderQuizPage );

//quiz result page
router.get('/quiz-result' , quizControllers.quizPageMiddleware , quizControllers.renderQuizResultPage);

// all post apis are here
router.post( '/quiz-registeration', quizControllers.saveQuizRegisterationData );
router.post( '/quiz-login', quizControllers.QuizLoginAuthorization );

//save the quiz data to session if user is not logged in and redirecting the user to registeration page and then redirecting that user to login page . or if user is already loggedIn then saving it's data to database
router.post( '/save-quiz-data', quizControllers.saveQuizDataToSession );

//all admin code is here

//ad quiz page
router.get( '/add-quiz', AdminPage.middleware, quizControllers.renderAddQuizpage );
router.post( '/add-quiz', AdminPage.middleware, quizControllers.addQuiz );

//show quiz page
router.get('/show-quiz' , AdminPage.middleware , quizControllers.renderShowQuizPage);

//quiz details page
router.get('/quiz-details' , AdminPage.middleware , quizControllers.renderQuizDetailsPage);


module.exports = router