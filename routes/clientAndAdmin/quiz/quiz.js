const express = require( 'express' )
const router = express.Router()
const quizControllers = require( '../../quizControllers/quizControllers' )

//all get apis are here

//quiz registeration route
router.get( '/quiz-registeration', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizRegisterationPage )
// router.post('/quiz-submittion' , quizControllers.quizSubmittion)
//quiz login route
router.get( '/quiz-login', quizControllers.loginRegPageMiddleware, quizControllers.renderQuizLoginPage )

//quiz rules page
router.get( '/quiz-rules', quizControllers.quizPageMiddleware , quizControllers.renderQuizRules )
//quiz page
router.get( '/quiz', quizControllers.quizPageMiddleware , quizControllers.renderQuizPage )
// all post apis are here
router.post( '/quiz-registeration', quizControllers.saveQuizRegisterationData )
router.post( '/quiz-login', quizControllers.QuizLoginAuthorization )
module.exports = router