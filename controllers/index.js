const eventModels = require('../models/events.js');


// Create a function which is a "controller", it
// handles a request, writing the response.
function index(request, response) {
    const contextData = {
        title: 'Listings',
        salutation: "Browse all listings and see what you'd like to rent",
        events: eventModels.all,
    };
    response.render('index', contextData);
}

function homepage(request, response) {
    const contextData = {
        title: 'Welcome!',
        salutation: 'Welcome to Y-Circular!',

    };
    response.render('homepage', contextData);
}

function formSubmit(request, response) {
    // The form data are in `request.body`. We need to get
    // these data out and use them to create a new event,
    // or return some kind of error to the user if they
    // submitted invalid data.

    // Start with an empty array of errors
    const contextData = {
        title: 'Create event',
        salutation: 'Let\'s create a new event!',
        errors: [],
    };

    if (request.method === 'POST') {
        const errors = [];

        if (!request.body.title_event || request.body.title_event.length > 51) {
            errors.push('Bad title for event!');
        }

        if (errors.length === 0) {
        // Create a new event! Find a good id (e.g. max existing id + 1)
            const newEvent = {
                title: request.body.title_event,
                date: request.body.date_event,
                location: request.body.loc,
            };
            newEvent.id = eventModels.getMaxId() + 1;
            // Push it on to our list of all events
            console.log('The new event\'s info:', newEvent);
            eventModels.all.push(newEvent);
            // return response.redirect('/events/'+ newEvent.id);
            return response.redirect(`/events/${newEvent.id}`);
        }

        contextData.errors = errors;
    } else {
        console.log('This is a GET request');
    }

    return response.render('form', contextData);
}


function itemDetails(req, res) {
    const eventID = parseInt(req.params.eventID, 10);
    const theEvent = eventModels.getById(eventID);
    const contextData = {
        title: 'Event\'s Details',
        salutation: 'RSVP to this event',
        evTitle: theEvent.title,
        date: theEvent.date,
        location: theEvent.location,
        attending: theEvent.attending,
        image: theEvent.image,
    };
    theEvent.salutation = 'These are the details of the event! RSVP to attend. You can also make a donation!';
    if (!theEvent) {
        res.send('could not find event! should send 404');
    } else {
        res.render('item_details', contextData);
    }
}


module.exports = {
    index,
    homepage,
    formSubmit,
    itemDetails,
};
