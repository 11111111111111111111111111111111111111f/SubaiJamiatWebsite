function getTalabaTausiaData ( req, res, next ) {

    if ( !req.file ) {
        res.send( { status: 'error' } )
        return
    }

    res.send( {
        status: 'success',
        filename: req.file.filename
    } )

}

module.exports = {
    getTalabaTausiaData: getTalabaTausiaData
}