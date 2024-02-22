const getBookData = require( './methods/book' )
const getMagazineData = require( './methods/magazine' )
const posters = require( './methods/posters' )
const getVideos = require( './methods/videos' )
const getmoonData = require( './methods/getmoon' )
const getDate = require( './methods/getDate' )

async function MergeData () {
    const bookData = await getBookData.getBook()
    const magazineData = await getMagazineData.getMagazine()
    const postersData = await posters.getPosters()
    const videos = await getVideos.getVideos()
    const moon = await getmoonData.getMoonData()
    const arabicDate = await getDate.getDate()
    const merged = {
        bookData, magazineData, postersData, videos, moon, arabicDate
    }
    return merged
}

module.exports = {
    getData: MergeData
}