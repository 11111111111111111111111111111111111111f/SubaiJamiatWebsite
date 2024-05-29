const express = require( 'express' )
const router = express.Router()
const { client, admin } = require( '../../fatawa/fatawaController' )
const { renderFatawaAnsListPage, renderArabicFatawaAnsListPage, FatawaQuestionValidation, getFatawaQuestionFromUser, renderFatawaAnswerPage, generateFatawaAnswerPdf } = client
const { renderFatawaQuestionListOnAdmin, renderAnswerPageOnAdmin, getAnswerFromAdmin, FatawaAnswerValidation, renderFatawaAnswerListOnAdmin, renderFatawaUpdateForm, updateAnswer, deleteAnswer } = admin
const AdminPage = require( '../../dbApis/fetchRegisterationData' )
const path = require( 'path' )

router.use( '/fatawa', express.static( path.join( __dirname, "../../../public" ) ) );

//urdu client route
router.get( '/fikh-w-fatawa', renderFatawaAnsListPage )
router.get( '/fatawa/:id', renderFatawaAnswerPage )

//arabic client route
router.get( '/ar-fikh-w-fatawa', renderArabicFatawaAnsListPage )

// getting fatawa question from user
router.post( '/fatawa-question', FatawaQuestionValidation, getFatawaQuestionFromUser )
router.get( '/generate-fatawa-jawab-pdf/:id', generateFatawaAnswerPdf )


//admin
//page's
router.get( '/fatawa-question-admin', AdminPage.middleware, renderFatawaQuestionListOnAdmin )
//rendering answer form
router.get( '/fatawa-answer', AdminPage.middleware, renderAnswerPageOnAdmin )
//rendering all answers list given by admin
router.get( '/fatawa-answers-list', AdminPage.middleware, renderFatawaAnswerListOnAdmin )
//rendering update answer form
router.get( '/update-fatawa-answer', AdminPage.middleware, renderFatawaUpdateForm )
//api's
//getting answer from admin and storing to database
router.post( '/fatawa-answer', AdminPage.middleware, FatawaAnswerValidation, getAnswerFromAdmin )
router.get( '/delete-fatawa-answer', AdminPage.middleware, deleteAnswer )
router.put( '/update-fatawa-answer/:id', AdminPage.middleware, updateAnswer )


module.exports = router