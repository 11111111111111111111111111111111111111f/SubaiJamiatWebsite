const express = require( 'express' )
const router = express.Router()
const AdminPage = require( '../../dbApis/fetchRegisterationData' )
const RegisterationMulter = require( '../../RegisterationMulter/RegisterationMulter' )
const registerationApi = require( '../../dbApis/getRegisterationData' )
// const quizControllers = require( '../../quizControllers/quizControllers' )

////////////client

// tadribiya registeration & login page //currently hided
router.get( '/tadribiya-registeration', registerationApi.tadribiyaRegAndLogInMiddleware, ( req, res ) => {
    res.render( 'tadribiyaRegisteration/registeration' )
} )

// router.get( '/tadribiya-login', registerationApi.tadribiyaRegAndLogInMiddleware, ( req, res ) => {
//     res.render( 'tadribiyaRegisteration/tadribiya-login' )
// } )

// router.get( "/tadribiya-quiz", registerationApi.tadribiyaQuizMiddleware, registerationApi.QuizPageMiddleware, quizControllers.renderQuizPage )

// router.get( '/quiz-result', registerationApi.tadribiyaQuizMiddleware, registerationApi.QuizResultMiddleware, quizControllers.renderQuizResultPage )

//////////////////api for quiz result
// router.post( "/quiz-submittion", quizControllers.quizResult )

//////////////////admin

//tadribiya registeration admin
router.get( '/admin', AdminPage.middleware, AdminPage.AdminPage )
router.get( '/approved', AdminPage.middleware, AdminPage.ApprovedPage )
router.get( '/rejected', AdminPage.middleware, AdminPage.RejectedPage )

///////////////////////////tadribiya api's

//getting and inserting data in db from registeration form
router.post( '/registeration',
    RegisterationMulter.upload.fields( [ {
        name: 'image', maxCount: 1
    },
    {
        name: 'file', maxCount: 1
    } ] ),
    registerationApi.getRegisterationData )

//getting data  and matching id(rollno) or password in database for login
router.post( '/tadribiya-login', registerationApi.tadribiyaLogin )

//tadribiya registeration data api
router.get( '/RegisterationData', AdminPage.RegisterationData )
router.get( '/RegisterationAllData', AdminPage.RegisterationAllData )

// tadribiya genereate pdf (approve) and reject api
router.post( '/generate-pdf', AdminPage.sendMsg )
router.post( '/reject', AdminPage.rejectMsg )

module.exports = router