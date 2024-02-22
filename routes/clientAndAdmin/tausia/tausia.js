const express = require( 'express' )
const router = express.Router()
const tausiaMulter = require( '../../Bara-e-Tausia/tausiaMulterCode' )
const AdminPage = require( '../../dbApis/fetchRegisterationData' )
const TausiaAdmin = require( '../../TausiaRegisteration/controllers' )
const UpdateTausia = require( '../../TausiaRegisteration/update-tausia' )

const getTausiaImage = require( '../../Bara-e-Tausia/GetTausiaFormData' )

//tausia status checked by the user using this route
router.get( '/check-tausia-status', TausiaAdmin.checkStatus )

//tausia admin

router.get( '/tausia-admin', AdminPage.middleware, TausiaAdmin.AdminPage )
router.get( '/tausia-approved', AdminPage.middleware, TausiaAdmin.approvePage )
router.get( '/tausia-rejected', AdminPage.middleware, TausiaAdmin.rejectPage )
router.get('/tausia-offline-approval-form' , AdminPage.middleware , TausiaAdmin.ApproveOfflineTausia)

// router.get( '/tausia-update-registeration-login', UpdateTausia.LoggedInMiddleware, UpdateTausia.tausiaUpdateLoginPage )
// router.get( '/update-tausia-registeration', UpdateTausia.LoggedOutMiddleware, UpdateTausia.updatePage )

//////////////////////////////tausia api's are here

//authentication of the tausia done with this route
router.get( '/tausia-authenticated-users', AdminPage.middleware, TausiaAdmin.tausiaAuthenticatedUsers )
//offline approved users list
router.get('/tausia-offline-authenticated-users' , AdminPage.middleware , TausiaAdmin.OfflineApprovedTausiaList)

// api for getting tausia image
// router.post( '/tausia-img', getTausiaImage.tausiaMiddleware, tausiaMulter.upload.single( "image" ), getTausiaImage.getTausiaImage )

//approving and rejecting api's for tausia registeration

//tausia registeration api data inserting in db
router.post( '/tausia-registeration',
    getTausiaImage.tausiaMiddleware,
    tausiaMulter.upload.fields( [
        { name: "SafeerImage", maxCount: 1 },
        { name: "document", maxCount: 1 }
    ] ), getTausiaImage.getTausia )

//offline approved tausia api
router.post('/upload-offline-released-tausia' , TausiaAdmin.uploadOfflineReleasedTausiaMulter.single("Image") , TausiaAdmin.uploadOfflineReleasedTausia )

//tausia approve api
router.post( '/tausia-approve', TausiaAdmin.ApproveTausia )
//tausia reject api
router.post( '/tausia-reject', TausiaAdmin.RejectTausia )
//updating tausia status api
router.put( '/update-tausia-status/:id', TausiaAdmin.updateTausiaStatus )
//generating pdf tausia api
router.post( '/generate-tausia-pdf', TausiaAdmin.GenerateTausiaPdf )
//sending tausia status api
router.post( '/send-tausia-status', TausiaAdmin.sendStatus )

//updating tausia registeration data api (it was created for by chance user make mistake in registeration then it can login and update it's registeration details but it is removed)
router.post( '/update-tausia-registeration-data', UpdateTausia.getUpdateTausiaRegisterationData )
//updating tausia registeration files
router.post( '/update-tausia-data', UpdateTausia.updateTausiaFiles.fields( [
    { name: "SafeerImage", maxCount: 1 },
    { name: "document", maxCount: 1 }

] ), UpdateTausia.updateTausiaData )

module.exports = router