const express = require( 'express' )
const router = express.Router()
const TausiaTalaba = require( '../../tausia-talaba/tausia-talaba-methods' )
const TausiaTalabaMulter = require( '../../tausia-talaba/TalabaTausiaMulter' )
const tausiaTalaba = require( '../../Bara-e-Talaba/getTalabaData' )
const talabaControllers = require( "../../Bara-e-Talaba/talabaControllers" )
const AdminPage = require( '../../dbApis/fetchRegisterationData' )

//tausia talaba status checked by the client using this route
router.get( '/check-talaba-status', talabaControllers.renderCheckTalabaStatus )


//tausia talaba admin code here

//display admin page for tausia talaba
router.get( '/tausia-talaba-admin', AdminPage.middleware, talabaControllers.renderAdminPage )
router.get( '/tausia-talaba-approved', AdminPage.middleware, talabaControllers.renderApprovePage )
router.get( '/tausia-talaba-rejected', AdminPage.middleware, talabaControllers.renderRejectPage )

//tausia talaba post api's

//sending tausia talaba status
router.post( '/check-talaba-status', talabaControllers.checkTalabaStatus )

//getting tausia talaba registeration data
router.post( '/tausia-talaba-registeration', tausiaTalaba.TausiaTalabaLimitationMiddleware, tausiaTalaba.talabaDocumentMulter.fields( [
    {
        name: "image",
        maxCount: 1
    }, {
        name: "document",
        maxCount: 1
    }
] ), tausiaTalaba.getTalabaData )

//tausia talaba admin page api's
router.post( '/tausia-talaba-approve', talabaControllers.approveTalabaTausia )
router.post( '/tausia-talaba-reject', talabaControllers.rejectTalabaTausia )
router.post( '/generate-tausia-talaba-pdf', talabaControllers.GeneratePdf )

//updating talaba status
router.put( '/update-talaba-status/:id', talabaControllers.updateTalabaStatus )

//tausia talaba apis
router.post( '/bara-e-talaba', TausiaTalabaMulter.upload.single( 'image' ), TausiaTalaba.getTalabaTausiaData )

module.exports = router