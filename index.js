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
    const films = 'https://api.hubspot.com/crm/v3/objects/p_films';
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

    const email = req.query.email;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
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


// ************************************************************************************************
// Below is tested template code for the contacts-based version 
// ************************************************************************************************


// Note that I'm using British English spelling of Favourite
// Test to trigger a git push
// Added some code to pull in the book in the listing view as well
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=firstname,lastname,email,favourite_book';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        //console.log('Fetched data:', data); // Debug log
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }


});


app.get('/update', async (req, res) => {
    // Go to this page to update a live record - http://localhost:3000/update?email=matthew@articulatemarketing.com
    const email = req.query.email;

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favourite_book`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {userEmail: data.properties.email, favouriteBook: data.properties.favourite_book});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favourite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

//app.get('/update-cobj', async (req, res) => {
//    res.render('update-cobj', { title: 'Edit films', message: 'Welcome to the editing page' });
//});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));