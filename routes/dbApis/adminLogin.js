function adminLogin ( req, res ) {
    let { name, password } = req.body
    if ( name === 'sj_admin' && password === 'Zambeel#7012' ) {
        req.session.loggedIn = true
        res.send( { status: 'valid' } )
    } else {
        res.send( { status: 'invalid' } )
    }
}

function adminLoginMiddleware ( req, res, next ) {
    if ( req.session.loggedIn == true ) {
        res.redirect( '/admin' )
        return
    }
    next()
}

module.exports = {
    adminLogin: adminLogin,
    middleware: adminLoginMiddleware
}