const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MJS Using dotenv to hide the private key
require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_KEY;

// MJS Add following line to debug private key
// console.log('PRIVATE_APP_ACCESS:', PRIVATE_APP_ACCESS); 

// First, create an app.get route for “/update-cobj (AKA /update-film”.
app.get('/update-film', (req, res) => {
    try {
      res.render('update-film', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum', message: 'Welcome to the editing page'  });
    } catch (err) {
      console.error(err);
    }
  });


// Next, let’s focus on the code you’ll write inside of the app.post route.
app.post('/update-film', async (req, res) => {
    const filmsEndpoint = 'https://api.hubspot.com/crm/v3/objects/p_films';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const data = {
        properties: {
            "film_name": req.body.film_name,
            "director": req.body.director,
            "genre": req.body.genre,
            }
    }

    try { 
        const resp = await axios.post(filmsEndpoint, data, { headers } );
        console.log('Film added:', resp.data); // Debug log
        res.redirect('/'); // Redirect to the homepage
    } catch(err) {
        console.error(err);
    }

});

// Finally, let’s focus on the app.get homepage ("/") route
app.get('/', async (req, res) => {

        const films = 'https://api.hubspot.com/crm/v3/objects/p_films?properties=film_name,director,genre';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }

        try {
            const resp = await axios.get(films, { headers });
            const data = resp.data.results;
            // console.log('Fetched data:', data); // Debug log
            res.render('homepage', { title: 'Film Table', data });      
        } catch (error) {
            console.error(error);
        }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));