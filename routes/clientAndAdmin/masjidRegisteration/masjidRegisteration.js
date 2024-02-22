const express = require( 'express' )
const router = express.Router()
const masjidRegisteration = require( '../../masjidRegisteration/masjidControllers' )

//masjid registeration form
router.get( '/masjid-registeration', masjidRegisteration.masjidRegisterationPage )
//masjid login form
router.get( '/masjid-login', masjidRegisteration.masjidLoginMiddleware, masjidRegisteration.masjidLogin )
//after login show tausia authentication form
router.get( '/tausia-authentication', masjidRegisteration.tausiaAuthenticationMiddleware, masjidRegisteration.renderTausiaAuthentication )

//masjid admin
router.get( '/masjid-registeration-admin', masjidRegisteration.masjidRegisterationAdminPage )
router.get( '/masjid-registeration-approved', masjidRegisteration.masjidRegisterationApproved )
router.get( '/masjid-registeration-rejected', masjidRegisteration.masjidRegisterationRejected )


//masjid registeration post methods (api's)
router.post( '/masjid-registeration', masjidRegisteration.masjidRegisterationMulter.single( "document" ), masjidRegisteration.MasjidRegisterationPostController )
router.post( '/approve-masjid-registeration', masjidRegisteration.approveMasjidRegisteration )
router.post( '/reject-masjid-registeration', masjidRegisteration.rejectMasjidRegisteration )
router.post( '/tausia-authentication-image', masjidRegisteration.TausiaAuthenticationMulter.single( 'image' ), masjidRegisteration.TausiaAuthenticationImage )
router.post( '/masjid-login', masjidRegisteration.masjidLoginAuthentication )
router.post( '/authenticate-Tausia', masjidRegisteration.authenticateTausia )

module.exports = router