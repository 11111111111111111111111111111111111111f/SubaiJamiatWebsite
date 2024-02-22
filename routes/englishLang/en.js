const express = require( 'express' )
const router = express.Router()
const commonData = require( '../getCommonData' )
const getSlides = require( '../methods/getHomeSlide' )



router.get( "/en", async ( req, res ) => {

    try {
        const DynamicData = await commonData.getData()
        const slides = await getSlides.getSlides()
        res.render( "english/home", { DynamicData, slides } );
    } catch {
        res.redirect( '/error' )
    }
} )

module.exports = router