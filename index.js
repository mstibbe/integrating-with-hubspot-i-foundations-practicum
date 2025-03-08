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

console.log('PRIVATE_APP_ACCESS:', PRIVATE_APP_ACCESS); // Add this line to debug


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', (request, response)=>{
    response.send('Hello World - you are on the home page');
});

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


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));