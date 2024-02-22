const dropOpen = document.querySelectorAll( '.main-container .left .dropdown .drop-open' )
const mainContainer = document.querySelector( '.main-container' )
const menu = document.querySelector( '.main-container .right header .menu' )
const expand = document.querySelector( '.main-container .right header .expand' )
const sidebar = document.querySelector( '.main-container .left' )
const profile = document.querySelector( '.main-container .right header .profile' )
const logout = document.querySelector( '.main-container .right header .profile .logout' )
const mobileDashboard = document.querySelector( '.main-container .mobile-dashboard' )
const dashboardLinks = document.querySelectorAll( '[data-page]' )
const body = document.querySelector( 'body' )

//adding active class on links of current page
dashboardLinks.forEach( link => {
    let dataAttr = link.getAttribute( 'data-page' )
    if ( dataAttr == body.getAttribute( 'data-page' ) ) {
        link.classList.add( 'active' )
        let dropdownMenu = link.parentElement
        if ( dropdownMenu.classList.contains( 'dropdown-menu' ) ) {
            let Dlink = dropdownMenu.previousElementSibling
            Dlink.classList.add( 'active' )
        }
    }
} )

dropOpen.forEach( drop => {
    drop.onclick = () => {
        const dropdown = drop.parentElement
        dropdown.classList.toggle( 'active' )
    }
} )

// responsive dropdown close
menu.onclick = () => {
    mainContainer.classList.toggle( 'active' )
}

mobileDashboard.onclick = () => {
    mainContainer.classList.remove( 'active' )
}

// profile onclick profile setting code here

profile.onclick = () => {
    profile.classList.toggle( 'active' )
}

// logout code is here
logout.onclick = () => {

    fetch( '/admin-logout', {
        method: 'post',
        body: JSON.stringify( {
            logout: true
        } ),
        headers: {
            'Content-Type': 'application/json'
        }
    } ).then( response => {
        return response.json()
    } ).then( response => {
        location.href = response.url
    } )

}
//this code is for  fullscreen the window
expand.onclick = () => {
    let html = document.querySelector( 'html' )
    if ( html.classList.contains( 'no-fs' ) ) {
        let elem = document.documentElement
        if ( elem.requestFullscreen ) {
            elem.requestFullscreen()
            html.classList.replace( 'no-fs', 'fs' )
        } else if ( elem.webkitRequestFullscreen ) { /* Safari */
            elem.webkitRequestFullscreen()
            html.classList.replace( ( 'no-fs', 'fs' ) )
        } else if ( elem.msRequestFullscreen ) { /* IE11 */
            elem.msRequestFullscreen()
            html.classList.replace( 'no-fs', 'fs' )
        }
    } else if ( html.classList.contains( 'fs' ) ) {
        if ( document.exitFullscreen ) {
            document.exitFullscreen()
            html.classList.replace( 'fs', 'no-fs' )
        } else if ( document.webkitExitFullscreen ) { /* Safari */
            document.webkitExitFullscreen()
            html.classList.replace( 'fs', 'no-fs' )
        } else if ( document.msExitFullscreen ) { /* IE11 */
            document.msExitFullscreen()
            html.classList.replace( 'fs', 'no-fs' )
        }
    }

}