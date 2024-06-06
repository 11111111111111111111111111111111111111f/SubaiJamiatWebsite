const body = document.querySelector( 'body' );
const links = document.querySelectorAll( '.nav a' )
const menu = document.querySelector( '.header .menu' )
const language = document.querySelector( '.header .language' )
const menubar = document.querySelector( '.navbar .menubar .bar-icon' )
const nav = document.querySelector( '.navbar .nav' )
const socialIcon = document.querySelector( '.social-icon' )
const arrow = document.querySelector( '.social-icon-arrow .arrow' )
const arrowClose = socialIcon.querySelector( '.arrow-close' )
const search = document.querySelector( '.navbar .search' )
const searchIcon = document.querySelector( '.navbar .menubar .search-icon' )
const calenderIcon = document.querySelector( '.header .calender i' )
const date = document.querySelector( '.header .date' )
// const chat_icon = document.querySelector( '.chat-icon' )
// const chat_container = document.querySelector( '.chat-container' )
// const chat_close = document.querySelector( '.chat-container .head .close' )
// const chat_wrapper = document.querySelector( '.chat-container .chat-wrapper' )
// const chat_input = document.querySelector( '.chat-container .chat-input input' )
const dropdown = document.querySelectorAll( '.navbar .nav .dropdown' )


// chat script starts here
// chat_icon.onclick = () => {

//     chat_container.classList.add( 'active' )

// }

// chat_close.onclick = () => {

//     chat_container.classList.remove( 'active' )

// }

// chat_input.onkeyup = ( e ) => {

//     if ( e.key == 'Enter' ) {

//         let value = chat_input.value.trim()
//         let today = new Date()
//         let hours = today.getHours()
//         let minute = today.getMinutes()
//         let ampm = hours >= 12 ? 'PM' : 'AM'
//         hours = hours > 12 ? hours - 12 : hours
//         let time = `${ hours } : ${ minute } ${ ampm }`

//         let btn = `<div class="chat user">
//         <div class="message-container">

//             <div class="message">
//                 <p>
//                     ${ value }
//                 </p>
//             </div>
//             <span class="time">${ time }</span>
//         </div>
//     </div>`

//         chat_wrapper.insertAdjacentHTML( 'beforeend', btn )
//         chat_wrapper.scrollTo( 0, chat_wrapper.offsetHeight )
//         chat_input.value = ''

//         setTimeout( async () => {

//             removeChatBtn()
//             autoReply()

//         }, 2000 )



//     }

// }

// function removeChatBtn () {

//     let chat_btn = document.querySelectorAll( '.chat-container .chat-btn' )

//     chat_btn.forEach( ( btn ) => {

//         if ( !btn.getAttribute( 'data-click' ) ) {

//             chat_wrapper.removeChild( btn )

//         }

//     } )
// }
// function autoReply () {

//     let today = new Date()
//     let hours = today.getHours()
//     let minute = today.getMinutes()
//     let ampm = hours >= 12 ? 'PM' : 'AM'
//     hours = hours > 12 ? hours - 12 : hours
//     let time = `${ hours } : ${ minute } ${ ampm }`

//     let reply = `<div class="chat bot">
//                         <div class="message-container">

//                             <div class="message">
//                                 <p>
//                                     اھلا و سھلا مرحبا اسلام علیکم ورحمت اللہ وبرکاتہ
//                                 </p>
//                             </div>
//                             <!-- <span class="time">8:27PM</span> -->
//                         </div>
//                         <img src="./images/bot.png" alt="">
//                     </div>

//                     <div class="chat-btn">
//                         آگے بڑھنے کے لیے یہاں کلک کریں۔
//                     </div>`


//     chat_wrapper.insertAdjacentHTML( 'beforeend', reply )

// }

// chat_wrapper.onclick = ( e ) => {

//     let btn = e.target;

//     if ( btn.classList.contains( 'chat-btn' ) ) {

//         let alreadyClicked = btn.getAttribute( 'data-click' );

//         if ( alreadyClicked ) {

//             return

//         }

//         btn.classList.add( 'active' )
//         btn.setAttribute( 'data-click', '1' )
//         removeChatBtn()
//         autoReply()
//     }


// }


function activePage () {

    const activePage = body.getAttribute( 'data-active' );

    links.forEach( link => {

        if ( link.getAttribute( 'data-active' ) == activePage ) {

            link.classList.add( 'active' );

        }

    } )

}

activePage();

function today () {

    const englishDate = document.querySelector( '.calender .date span.english-date' )



    let today = new Date()
    let date = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    let day = today.getDay()
    let dayName = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]

    if ( month < 10 ) {

        month = '0' + month;

    }

    if ( date < 10 ) {

        date = '0' + date;

    }

    englishDate.innerHTML = `${ dayName[ day ] }  &nbsp;&nbsp;${ date }/${ month }/${ year }`

    // const arabicDate = document.querySelector( '.calender .date span.arabic-date' )
    // let todayAr = new Intl.DateTimeFormat( 'ar-TN-u-ca-islamic', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' } ).format( Date.now() )
    // let todayAr = new Intl.DateTimeFormat( 'ar-FR-u-ca-islamicc', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' } ).format( Date.now() );
    // arabicDate.innerHTML = todayAr

}

today()

dropdown.forEach( drop => {
    let link = drop.querySelector( 'a:first-child' )
    link.onclick = () => {
        drop.classList.toggle( 'active' )
    }
} )

menu.onclick = () => {

    date.classList.remove( 'active' )
    language.classList.toggle( 'active' )

}

menubar.onclick = () => {

    nav.classList.toggle( 'active' )

}

arrow.onclick = () => {

    socialIcon.classList.add( 'active' )
    arrow.classList.remove( 'active' )
    socialIcon.style.transitionDelay = '0.3s'
    arrow.style.transitionDelay = '0'

}

arrowClose.onclick = () => {

    socialIcon.classList.remove( 'active' )
    arrow.classList.add( 'active' )
    socialIcon.style.transitionDelay = '0'
    arrow.style.transitionDelay = '0.3s'

}

searchIcon.onclick = () => {

    search.classList.toggle( 'active' )

}

calenderIcon.onclick = () => {

    date.classList.toggle( 'active' )
    language.classList.remove( 'active' )

}

window.onload = () => {

    socialIcon.classList.add( 'active' )
    arrow.classList.remove( 'active' )
    setTimeout( () => {

        arrow.classList.add( 'active' )
        socialIcon.classList.remove( 'active' )

    }, 3000 )

}

// viewers code starts here

function viewers () {

    const view = document.querySelector( '.column .card .view' )

    if ( view == null ) return

    if ( sessionStorage.getItem( 'viewer' ) != 'true' ) {


        fetch( '/viewers', {

            method: "post",
            body: JSON.stringify( {

                person: "new"

            } ),
            headers: {

                'Content-Type': 'application/json'
            }

        } )
            .then( ( res ) => {
                return res.json()
            } )
            .then( ( res ) => {

                view.innerText = res.view
                sessionStorage.setItem( 'viewer', 'true' )

            } )

    } else {

        fetch( '/viewers', {

            method: "post",
            body: JSON.stringify( {

                person: "old"

            } ),
            headers: {

                'Content-Type': 'application/json'
            }

        } )
            .then( ( res ) => { return res.json() } )
            .then( ( res ) => {
                view.innerText = res.view

            } )


    }

}

viewers()

//footer design starts here
let up = document.querySelector( 'footer .up' )
up.onclick = () => {

    window.scrollTo( 0, 0 )

}

//upcoming events all code is here
const upcomingEventPara = document.querySelector( '.flow .upcoming-event' )
const sheetId = '1Fl6Gce7xQevnHZ3FvGh7aU62LNZbnyewgk7Q3l28vd0'
const sheetName = encodeURIComponent( "upcoming events" )
const sheetURL = `https://docs.google.com/sp

readsheets/d/${ sheetId }/gviz/tq?tqx=out:csv&sheet=${ sheetName }`

fetch( sheetURL ).then( response => response.text() )
    .then( response => {
        data = textToObject( response )
        upcomingEventPara.innerText = data.urdu
        // heading row
        // let tr = document.createElement( 'tr' )
        // // inserting heading columns in rows
        // data.headings.forEach( heading => {
        //     let td = document.createElement( 'td' )
        //     td.innerText = heading
        //     tr.appendChild( td )
        // } )
        // table.appendChild( tr )

        // data.rows.forEach( row => {
        //     let tr = document.createElement( 'tr' )
        //     row.forEach( col => {
        //         let td = document.createElement( 'td' )
        //         td.innerText = col
        //         tr.appendChild( td )
        //     } )
        //     table.appendChild( tr )
        // } )

    } )

function textToObject ( text ) {
    const data = text.split( '\n' )
    const headings = data[ 0 ].split( "," )
    const headObj = headings.map( head => {
        return head.replaceAll( `"`, "" )
    } )

    const rows = []

    data.forEach( ( value, index ) => {
        if ( index > 0 ) {
            let col = value.split( ',' )
            let columns = col.map( val => {
                return val.replaceAll( `"`, "" )
            } )
            rows.push( columns )
        }
    } )

    return {
        urdu: rows[ 0 ][ 0 ]
    }
}

// mujallah search script starts here
// const searchInput = document.querySelector( '.navbar .search input' )
// searchInput.onkeyup = ( e ) => {

//     let curr_location = ( location.pathname.includes( '/ar-' ) ) ? 'ar-' : ''
//     if ( e.key == 'Enter' && searchInput.value.trim().length > 1 ) {

//         fetch( '/search', {
//             method: 'post',
//             body: JSON.stringify( { value: searchInput.value.trim(), curr_location: curr_location } ),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         } ).then( response => response.json() )
//             .then( response => {
//                 console.log( response )
//                 if ( response.status == 'success' ) {
//                     location.href = response.redirecting
//                 } else {
//                     alert( 'match not found' )
//                 }
//             } )

//     }

// }

// disable inspect element dev tools
body.oncontextmenu = () => false

document.onkeydown = ( e ) => {

    if ( e.key == 'F12' ) {


        return false;

    }

    if ( e.ctrlKey && e.shiftKey && ( e.key == 'J' || e.key == 'I' || e.key == 'C' ) ) {

        return false

    }

    if ( e.ctrlKey && ( e.key == 'u' || e.key == 'U' ) ) {

        return false

    }

}

//moon curve design starts here 
const root = document.querySelector( ':root' )

function generateMoonAccordingDate () {

    const DateForMoon = document.querySelector( '.MoonAccordingDate' ).getAttribute( "data-DateForMoon" )
    const date = parseInt( UrduToEnglishNumber( DateForMoon.toString() ) )

    if ( date <= 15 && date > 0 ) {

        let MoonCurve = date * 1.66
        MoonCurve = ( MoonCurve > 25 ) ? 25 : MoonCurve
        root.style.setProperty( "--curve", MoonCurve + "px" )

    } else if ( date > 15 && date <= 30 ) {

        let MoonCurve = ( ( 30 - date ) * 1.66 )
        MoonCurve = ( MoonCurve < 1.66 ) ? 1.66 : MoonCurve
        root.style.setProperty( "--curve", "-" + MoonCurve + "px" )

    } else {
        root.style.setProperty( "--curve", "1.66px" );
    }


}

generateMoonAccordingDate()

function UrduToEnglishNumber ( NumberInUrdu ) {

    let urduNumbers = [ '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ]
    let EnglishUrduPair = {}

    for ( i = 0; i < urduNumbers.length; i++ ) {
        EnglishUrduPair[ urduNumbers[ i ] ] = i;
    }

    const EnglishNumber = NumberInUrdu.replace( /[۰-۹]/g, ( matchedValue ) => {
        return EnglishUrduPair[ matchedValue ]
    } )

    return EnglishNumber



}

//integrated tawk to chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();

//this is for custom icon when user click on custom icon it will open
Tawk_API.onStatusChange = function ( status ) {
    if ( status === 'online' ) {
        document.getElementById( 'status' ).innerHTML = '<a href="javascript:void(Tawk_API.toggle())">Online - Click to chat</a>';
    }
    else if ( status === 'away' ) {
        document.getElementById( 'status' ).innerHTML = 'We are currently away';
    }
    else if ( status === 'offline' ) {
        document.getElementById( 'status' ).innerHTML = 'Live chat is Offline';
    }
};

( function () {
    var s1 = document.createElement( "script" ), s0 = document.getElementsByTagName( "script" )[ 0 ];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/665d8904981b6c564777e399/1hvelueoq';
    s1.charset = 'UTF-8';
    s1.setAttribute( 'crossorigin', '*' );
    s0.parentNode.insertBefore( s1, s0 );
} )();