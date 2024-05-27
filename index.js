require( "dotenv" ).config();
const express = require( "express" );
const app = express();
const ejs = require( "ejs" );
const fs = require( "fs" );
const cors = require( "cors" );
// const timeFormatter = require( './unix-time/formatter' )
// const stripe = require( "stripe" )( process.env.SECRET_KEY );
// const Razorpay = require( 'razorpay' )
// const crypto = require( 'crypto' )
// const key_id = process.env.key_id
// const key_secret = process.env.key_secret
const sheet = require( './routes/methods/sheet' )
const drive = require( './routes/methods/imglink' )
const commonData = require( './routes/getCommonData' )
const getMoonData = require( './routes/methods/getmoon' );
const getJumaList = require( './routes/methods/getJumaList' );
const getSlides = require( './routes/methods/getHomeSlide' )
const masajidData = require( './routes/methods/getMasajidForSearch' );
const youtubeLink = require( "./routes/methods/youtube" );
const AdminPage = require( './routes/dbApis/fetchRegisterationData' )
const adminLogin = require( './routes/dbApis/adminLogin' )
const session = require( 'express-session' )
const getNoticeImg = require( './routes/methods/ImpNotice' )
const FikhWFatawaRouter = require( './routes/fikh-w-fatawa/renderFikhFatawa' )
const uploadVideo = require( './routes/UploadVideo/upload-video' )
// const englishRouter = require( './routes/englishLang/en.js' )
const TadribiyaRouter = require( './routes/clientAndAdmin/tadribiya/tadribiya.js' )
const masjidRegisterationRouter = require( './routes/clientAndAdmin/masjidRegisteration/masjidRegisteration.js' )
const tausiaRouter = require( './routes/clientAndAdmin/tausia/tausia.js' )
const tausiaTalabaRouter = require( './routes/clientAndAdmin/tausiaTalaba/tausiaTalaba.js' )
const quizRouter = require( './routes/clientAndAdmin/quiz/quiz.js' );
const { upload } = require( "./routes/RegisterationMulter/RegisterationMulter.js" );

app.use( session( {
  secret: 'sj_session_storage_Zambeel#7012',
  resave: false,
  saveUninitialized: false
} ) )

app.use( function ( req, res, next ) {
  res.set( 'cache-control', 'no-store' )
  next()
} )

app.use( express.static( __dirname + "/public" ) );
app.set( "view engine", "ejs" );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cors() )

// const razorpay = new Razorpay( {
//   key_id,
//   key_secret
// } )

//using english router
// app.use( englishRouter )
//using fikh-w-fatawa router
app.use( FikhWFatawaRouter.router )
//using tadribiya client and admin router
app.use( TadribiyaRouter )
//using masjid registeration client and admin router
app.use( masjidRegisterationRouter )
//using tausia client and admin router
app.use( tausiaRouter )
//using tausia talaba client and admin router
app.use( tausiaTalabaRouter )
//using quiz client and admin router
// app.use( quizRouter )

app.get( "", async ( req, res ) => {

  try {
    const DynamicData = await commonData.getData()
    const slides = await getSlides.getSlides()
    res.render( "urdu/home", { DynamicData, slides } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/introduction", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/introduction", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/press-release", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/release", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/aina-e-jamiat", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/aina-e-jamiat", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

// app.get('/sub-units' , (req , res)=>{

//     res.render('urdu/sub-units')

// })



app.get( "/aljama", async ( req, res ) => {

  let page = Math.floor( req.query.page ) || 1
  let limit = 10
  let start = ( page > 1 ) ? ( page * limit ) - 9 : page
  let end = ( start == 1 ) ? 10 : start + 9

  const DynamicData = await commonData.getData()

  sheet.getSheetData( {
    sheetID: '18BEPDao7OUUy-2c5f9FMmR_z36gdcq1L3lTVqv1ZaL8',
    sheetName: 'mujallah aljama collection',
    query: 'SELECT *',
    callback: ( data ) => {
      try {

        end = ( end > data.length ) ? data.length : end
        let dataLength = Math.ceil( data.length / limit )

        if ( end <= start ) {
          res.redirect( '/error' )
          return
        }

        let images = []

        data.forEach( value => {
          let url = value.Image
          const imgUrl = drive.getImgUrl( url )
          images.push( imgUrl )

        } )

        res.render( "urdu/mujallah", {
          data, img: images, pagination: {
            start, end
          }, dataLength, page, DynamicData
        } )

      } catch ( error ) {
        // console.log( 'error occured' )
        res.redirect( 'error' )
      }
    }
  } )

} );

// app.get( "/aljama-2", ( req, res ) => {
//   res.render( "urdu/mujallah2" );
// } );

// app.get( "/aljama-3", ( req, res ) => {
//   res.render( "urdu/mujallah3" );
// } );

app.get( "/book", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/book1", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/book-2", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/book2", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/book-3", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/book3", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

// app.get("/book-4", (req, res) => {
//   res.render("urdu/book4");
// });

// app.get("/book-5", (req, res) => {
//   res.render("urdu/book5");
// });

// app.get( "/photo-gallery", async ( req, res ) => {
//   try {
//     const DynamicData = await commonData.getData()
//     res.render( "urdu/photo-gallery", { DynamicData } );
//   } catch {
//     res.redirect( '/error' )
//   }
// } );

app.get( "/posters", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/posters", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/moon", async ( req, res ) => {

  try {

    const DynamicData = await commonData.getData()
    const moonData = await getMoonData.getMoonData()
    let Hijri = new Set()
    moonData.forEach( value => {
      Hijri.add( value.Hijri )
    } )
    res.render( "urdu/moon", { Hijri, moonData, DynamicData } )

  } catch ( error ) {

    // console.log( 'error occured' )
    res.redirect( '/error' )

  }


} );


app.get( "/jamati-activities", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/jamati-activities", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/juma-list", async ( req, res ) => {

  try {

    const DynamicData = await commonData.getData()
    const JumaList = await getJumaList.getJumaList()
    let MonthList = new Set()
    JumaList.forEach( value => {
      MonthList.add( value.Month )
    } )
    res.render( "urdu/khutba-e-juma", { MonthList, JumaList, DynamicData } )

  } catch ( error ) {

    // console.log( 'error occured' )
    res.redirect( '/error' )

  }

} )



app.get( "/video-gallery", async ( req, res ) => {

  let page = Math.floor( req.query.page ) || 1
  let limit = 10
  let start = ( page > 1 ) ? ( page * limit ) - 9 : page
  let end = ( start == 1 ) ? 10 : start + 9
  try {
    const youtubeData = await youtubeLink.getYoutube()
    const DynamicData = await commonData.getData()
    end = ( end > youtubeData.length ) ? youtubeData.length : end
    let dataLength = Math.ceil( youtubeData.length / limit )

    if ( end <= start ) {
      res.redirect( '/error' )
      return
    }

    res.render( "urdu/video-gallery", {
      youtubeData, pagination: {
        start, end
      }, dataLength, page, DynamicData
    } )

  } catch ( error ) {
    // console.log( error )
    res.redirect( '/error' )
  }

} );

app.get( "/fatawa", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/fatawa", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

// app.get( "/fikh-w-fatawa", async ( req, res ) => {
//   try {
//     const DynamicData = await commonData.getData()
//     const fatawaList = await getFatawaList.getFatawaList()
//     res.render( "urdu/fatawaList", { DynamicData, fatawaList } );
//   } catch ( error ) {
//     // console.log( error )
//     res.redirect( '/error' )
//   }
// } )

app.get( "/tausia", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/tausia", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/contact", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/contact", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( '/tausia-talaba', async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( 'urdu/barae-talaba', { DynamicData } )
  } catch ( error ) {
    console.log( error )
    res.redirect( '/error' )
  }
} )

app.get( "/unicode", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/unicode", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/donate", ( req, res ) => {
  res.render( "urdu/donate" );
} );

app.get( "/imp-notice", async ( req, res ) => {
  let data = await getNoticeImg.getNoticeImg()
  res.render( "imp-notice", { image: data[ 0 ].image } );
} )

app.get( "/tausia-rules", ( req, res ) => {
  res.render( 'tausia-rules' )
} )


app.get( "/district-jamiat", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/district-jamiat", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} )

app.get( "/masajid", async ( req, res ) => {


  const DynamicData = await commonData.getData()


  sheet.getSheetData( {
    sheetID: '1GJfACildObCdNzQX8_tA4dtlg_pKr7dCRSmYzpX-P9o',
    sheetName: 'Masajid',
    query: 'SELECT *',
    callback: ( data ) => {
      try {
        let places = new Set()
        data.forEach( value => {
          places.add( value.Place )
        } )
        res.render( "urdu/masajid", { places, data, DynamicData } )
      } catch ( error ) {
        // console.log( 'error occured' )
        res.redirect( '/error' )
      }
    }
  } )

} )

app.post( "/purchase-book", async ( req, res ) => {

  let data = req.body;
  let book = data.bookName;

  try {
    const DynamicData = await commonData.getData()
    res.render( "urdu/purchase-book", { DynamicData, book } );
  } catch {
    res.redirect( '/error' )
  }

} );

//----------------------------------------------------------------
//  arabic routes
//----------------------------------------------------------------

app.get( "/ar", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    const slides = await getSlides.getSlides()
    res.render( "arabic/home", { DynamicData, slides } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/ar-introduction", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/introduction", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );


app.get( "/ar-posters", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/posters", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );


app.get( "/ar-aina-e-jamiat", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/aina-e-jamiat", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );


app.get( "/ar-moon", async ( req, res ) => {

  try {

    const DynamicData = await commonData.getData()
    const moonData = await getMoonData.getMoonData()
    let Hijri = new Set()
    moonData.forEach( value => {
      Hijri.add( value.Hijri )
    } )
    res.render( "arabic/moon", { Hijri, moonData, DynamicData } )

  } catch ( error ) {

    // console.log( 'error occured' )
    res.redirect( '/error' )

  }


} );



app.get( "/ar-juma-list", async ( req, res ) => {

  try {

    const DynamicData = await commonData.getData()
    const JumaList = await getJumaList.getJumaList()
    let MonthList = new Set()
    JumaList.forEach( value => {
      MonthList.add( value.Month )
    } )
    res.render( "arabic/khutba-e-juma", { MonthList, JumaList, DynamicData } )

  } catch ( error ) {

    // console.log( 'error occured' )
    res.redirect( '/error' )

  }

} )


app.get( "/ar-district-jamiat", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/district-jamiat", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} )



app.get( "/ar-masajid", async ( req, res ) => {


  const DynamicData = await commonData.getData()


  sheet.getSheetData( {
    sheetID: '1GJfACildObCdNzQX8_tA4dtlg_pKr7dCRSmYzpX-P9o',
    sheetName: 'Masajid',
    query: 'SELECT *',
    callback: ( data ) => {
      try {
        let places = new Set()
        data.forEach( value => {
          places.add( value.Place )
        } )
        res.render( "arabic/masajid", { places, data, DynamicData } )
      } catch ( error ) {
        // console.log( 'error occured' )
        res.redirect( '/error' )
      }
    }
  } )

} )


app.get( "/ar-press-release", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/release", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );
// app.get('/ar-sub-units' , (req , res)=>{

//     res.render('urdu/sub-units')

// })

app.get( "/ar-aljama", async ( req, res ) => {

  let page = Math.floor( req.query.page ) || 1
  let limit = 10
  let start = ( page > 1 ) ? ( page * limit ) - 9 : page
  let end = ( start == 1 ) ? 10 : start + 9

  const DynamicData = await commonData.getData()

  sheet.getSheetData( {
    sheetID: '18BEPDao7OUUy-2c5f9FMmR_z36gdcq1L3lTVqv1ZaL8',
    sheetName: 'mujallah aljama collection',
    query: 'SELECT *',
    callback: ( data ) => {
      try {

        end = ( end > data.length ) ? data.length : end
        let dataLength = Math.ceil( data.length / limit )

        if ( end <= start ) {
          res.redirect( '/error' )
          return
        }

        let images = []

        data.forEach( value => {
          let url = value.Image
          const imgUrl = drive.getImgUrl( url )
          images.push( imgUrl )

        } )

        res.render( "arabic/mujallah", {
          data, img: images, pagination: {
            start, end
          }, dataLength, page, DynamicData
        } )
      } catch ( error ) {
        // console.log( 'error occured' )
        res.redirect( 'error' )
      }
    }
  } )

} )

// app.get( "/ar-aljama-2", ( req, res ) => {
//   res.render( "arabic/mujallah2" );
// } );

app.get( "/ar-book", ( req, res ) => {
  res.render( "arabic/book1" );
} );

app.get( "/ar-book-2", ( req, res ) => {
  res.render( "arabic/book2" );
} );

app.get( "/ar-book-3", ( req, res ) => {
  res.render( "arabic/book3" );
} );

// app.get("/ar-book-4", (req, res) => {
//   res.render("arabic/book4");
// });

// app.get("/ar-book-5", (req, res) => {
//   res.render("arabic/book5");
// });

// app.get( "/ar-photo-gallery", ( req, res ) => {
//   res.render( "arabic/photo-gallery" );
// } );

app.get( '/ar-jamati-activities', async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/jamati-activities", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }

} )

app.get( "/ar-video-gallery", async ( req, res ) => {
  let page = Math.floor( req.query.page ) || 1
  let limit = 10
  let start = ( page > 1 ) ? ( page * limit ) - 9 : page
  let end = ( start == 1 ) ? 10 : start + 9
  try {
    const youtubeData = await youtubeLink.getYoutube()
    const DynamicData = await commonData.getData()
    end = ( end > youtubeData.length ) ? youtubeData.length : end
    let dataLength = Math.ceil( youtubeData.length / limit )

    if ( end <= start ) {
      res.redirect( '/error' )
      return
    }

    res.render( "arabic/video-gallery", {
      youtubeData, pagination: {
        start, end
      }, dataLength, page, DynamicData
    } )

  } catch ( error ) {
    // console.log( error )
    res.redirect( '/error' )
  }
} );

app.get( "/ar-fatawa", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/fatawa", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );


// app.get( "/ar-fikh-w-fatawa", async ( req, res ) => {
//   try {
//     const DynamicData = await commonData.getData()
//     const fatawaList = await getFatawaList.getFatawaList()
//     res.render( "arabic/fatawaList", { DynamicData, fatawaList } );
//   } catch ( error ) {
//     res.redirect( '/error' )
//   }
// } )


app.get( "/ar-tausia", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/tausia", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( "/ar-contact", async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( "arabic/contact", { DynamicData } );
  } catch {
    res.redirect( '/error' )
  }
} );

app.get( '/ar-tausia-talaba', async ( req, res ) => {
  try {
    const DynamicData = await commonData.getData()
    res.render( 'arabic/barae-talaba', { DynamicData } )
  } catch ( error ) {
    console.log( error )
    res.redirect( '/error' )
  }
} )


// api for viewers
app.post( "/viewers", ( req, res ) => {
  let count = fs.readFileSync( "count.json", "utf-8" );
  let countObj = JSON.parse( count );

  if ( req.body.person == "new" ) {
    countObj.view = countObj.view + 1;
    let jsonObj = JSON.stringify( countObj );

    fs.writeFile( "count.json", jsonObj, ( err ) => {
      if ( err ) {
        res.redirect( '/error' )
        return;
      }
    } );

    res.send( jsonObj );
  } else {
    let jsonObj = JSON.stringify( countObj );
    res.send( jsonObj );
  }
} );

//api for stripe
// app.post( "/checkout", async ( req, res ) => {
//   let { name, email, number, amount, donation } = req.body

//   try {
//     const options = {
//       amount: amount * 100,
//       currency: 'INR'
//     }
//     let order = await razorpay.orders.create( options )
//     order.key = key_id
//     order.name = name
//     order.contact = number
//     order.description = donation
//     order.email = email

//     res.json( order )
//   } catch ( err ) {
//     res.status( 500 ).json( { error: 'something went wrong' } )
//   }

// } );


// app.post( '/verify-payment', async ( req, res ) => {
//   const { paymentId, orderId, signature } = req.body
//   const hmac = crypto.createHmac( "sha256", key_secret )
//   hmac.update( orderId + "|" + paymentId )
//   const digest = hmac.digest( "hex" )
//   if ( digest === signature ) {
//     res.json( { message: 'success' } )
//   } else {
//     res.status( 500 ).json( { message: 'failure' } )
//   }
// } )

//success and failure page of payment gateway
// app.get( "/success", async ( req, res ) => {
//   let { name, description, order_id, amount, unixTime } = req.query
//   let time = timeFormatter.timeConverter( unixTime )
//   let data = { name, description, order_id, amount, time }
//   res.render( 'urdu/success', { data } )

// } );

app.get( '/failure', ( req, res ) => {
  res.render( 'urdu/failure' )
} )


//search input api
app.post( '/search', async ( req, res ) => {

  let search = req.body.value
  let user_location = req.body.curr_location
  let masjidData = await masajidData.getMasajid()

  // console.log( masajidData )
  sheet.getSheetData( {
    sheetID: '18BEPDao7OUUy-2c5f9FMmR_z36gdcq1L3lTVqv1ZaL8',
    sheetName: 'mujallah aljama collection',
    query: 'SELECT *',
    callback: ( data ) => {
      try {

        function matchData () {
          for ( i = 0; i < data.length; i++ ) {

            if ( data[ i ].Name == search ) {
              let page = Math.ceil( data[ i ].No / 10 )
              let redirecting = `${ user_location }aljama?page=${ page }#${ data[ i ].No }`
              let response = { status: 'success', redirecting }
              return response

            }
          }

          for ( i = 0; i < data.length; i++ ) {

            if ( data[ i ].Name.includes( search ) || data[ i ].Name.startsWith( search ) || data[ i ].Name.endsWith( search ) ) {

              let page = Math.ceil( data[ i ].No / 10 )
              let redirecting = `${ user_location }aljama?page=${ page }#${ data[ i ].No }`
              let response = { status: 'success', redirecting }
              return response

            }


          }

        }

        let response = matchData()

        if ( response != undefined && response != null ) {
          res.json( response )
        } else {
          res.json( { status: 'error' } )
        }

      } catch ( error ) {
        // console.log( error )
        // res.redirect( '/error' )
      }

    }
  } )
} )

///////////////////////differentiating//////////////////////////////


//admin login
app.get( '/adminLogin', adminLogin.middleware, ( req, res ) => {
  res.render( 'adminLogin' )
} )

//admin login api
app.post( '/adminLogin', adminLogin.adminLogin )

app.get( '/video-upload', AdminPage.middleware, uploadVideo.renderVideoUploadPage )
app.get( '/all-videos', AdminPage.middleware, uploadVideo.allVideos )
app.post( '/upload-video', AdminPage.middleware, uploadVideo.videoMulter.single( "video" ), uploadVideo.getVideoFromUser )
app.delete( '/delete-video/:video', AdminPage.middleware, uploadVideo.deleteVideo )
//404 page
app.get( '/pending', ( req, res ) => {
  res.render( 'pending' )
} )

app.get( "*", ( req, res ) => {
  res.render( '404' );
} );

// app.listen( 5000 );
app.listen( 5000, '0.0.0.0' )//0.0.0.0
