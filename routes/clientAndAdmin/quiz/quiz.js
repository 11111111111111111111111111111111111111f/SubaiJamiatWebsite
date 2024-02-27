const express = require( 'express' )
const router = express.Router()
const quizControllers = require( '../../quizControllers/quizControllers' )

//all get apis are here

//quiz registeration route

//with middleware
// router.get( '/quiz-registeration', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizRegisterationPage )
//without middleware

//after submittion of quiz logic
router.get( '/quiz-registeration', quizControllers.renderQuizRegisterationPage )
// router.post('/quiz-submittion' , quizControllers.quizSubmittion)


//quiz login route
//with middleware
// router.get( '/quiz-login', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizLoginPage )
//without middleware
router.get( '/quiz-login', quizControllers.renderQuizLoginPage )

//quiz rules page
router.get( '/quiz-rules', quizControllers.quizPageMiddleware , quizControllers.renderQuizRules )
//quiz page
router.get( '/quiz', quizControllers.quizPageMiddleware , quizControllers.renderQuizPage )
// all post apis are here
router.post( '/quiz-registeration', quizControllers.saveQuizRegisterationData )
router.post( '/quiz-login', quizControllers.QuizLoginAuthorization )

//save the quiz data to session
router.post('/save-quiz-data' , quizControllers.saveQuizDataToSession)

module.exports = router