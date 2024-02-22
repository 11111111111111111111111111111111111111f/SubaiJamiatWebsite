//loading animation code
//body is already declared in script.js file that's why i am not declaring it again
const loading = document.querySelector( '.loading' )

if ( body.getAttribute( 'data-active' ).toLocaleLowerCase() == 'home' ) {
    setTimeout( () => {
        body.style.overflowY = 'auto'
        loading.style.display = 'none'
    }, 5000 )
} else {
    setTimeout( () => {
        body.style.overflowY = 'auto'
        loading.style.display = 'none'
    }, 2000 )
}


$( 'document' ).ready( function () {

    // $( '.welcome-container' ).waypoint( () => {

    //     $( '.welcome-container' ).addClass( 'animate__animated animate__fadeOutLeft' )

    // }, {
    //     offset: '13%'
    // } )

    // $( '.header' ).waypoint( () => {

    //     $( '.header' ).addClass( 'animate__animated animate__fadeIn' );

    // }, {

    //     offset: '30%',

    // } )


    // $( '.logo-1' ).waypoint( () => {

    //     $( '.logo-1' ).addClass( 'animate__animated animate__fadeInLeft' );

    // }, {

    //     offset: '30%',

    // } )

    // $( '.logo-2' ).waypoint( () => {

    //     $( '.logo-2' ).addClass( 'animate__animated animate__fadeInUp' );

    // }, {

    //     offset: '30%',

    // } )

    // $( '.logo-3' ).waypoint( () => {

    //     $( '.logo-3' ).addClass( 'animate__animated animate__fadeInRight' );

    // }, {

    //     offset: '30%',

    // } )

    // $( '.navbar' ).waypoint( () => {

    //     $( '.navbar' ).addClass( 'animate__animated animate__flipInX' );

    // }, {

    //     offset: '100%',

    // } )

    // $( '#home' ).waypoint( () => {

    //     $( '#home' ).addClass( 'animate__animated animate__fadeIn' );

    // }, {

    //     offset: '30%',

    // } )

    $( '.column-left' ).waypoint( () => {

        $( '.column-left' ).addClass( 'animate__animated animate__fadeInLeft' );

    }, {

        offset: '30%',

    } )

    // $( '.column-center' ).waypoint( () => {

    //     $( '.column-center' ).addClass( 'animate__animated animate__fadeInUp' );

    // }, {

    //     offset: '30%',

    // } )

    $( '.column-right' ).waypoint( () => {

        $( '.column-right' ).addClass( 'animate__animated animate__fadeInRight' );

    }, {

        offset: '30%',

    } )



    $( 'footer' ).waypoint( () => {

        $( 'footer' ).addClass( 'animate__animated animate__fadeInUp' );

    }, {

        offset: '50%',

    } )


    // $( '.footer-1' ).waypoint( () => {

    //     $( '.footer-1' ).addClass( 'animate__animated animate__fadeInLeft' );

    // }, {

    //     offset: '30%',

    // } )


    // $( '.footer-2' ).waypoint( () => {

    //     $( '.footer-2' ).addClass( 'animate__animated animate__fadeInUp' );

    // }, {

    //     offset: '30%',

    // } )

    // $( '.footer-3' ).waypoint( () => {

    //     $( '.footer-3' ).addClass( 'animate__animated animate__fadeInUp' );

    // }, {

    //     offset: '30%',

    // } )



    // $( '.footer-4' ).waypoint( () => {

    //     $( '.footer-4' ).addClass( 'animate__animated animate__fadeInRight' );

    // }, {

    //     offset: '30%',

    // } )

    $( '.copyright' ).waypoint( () => {

        $( '.copyright' ).addClass( 'animate__animated animate__fadeIn' )

    }, {

        offset: '',

    } )



} )