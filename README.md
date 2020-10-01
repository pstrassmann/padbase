##  About

### Overview

PadBase is a record management web application for The Animal Pad, an all-breed dog rescue in San Diego, CA. The application provides an intuitive interface for navigating and maintaining records for all dogs that move through the rescue, including each dogs’ connection to the many Animal Pad volunteers responsible for their individual vetting, fostering, and adoption. Padbase is designed as a single-page web application hoping to make the bloated and typically cumbersome process of record maintenance fast, lean, and bug-free.

### Technical details

The frontend is built with React, using entirely functional components. Redux is used for managing app-level state. App styling uses custom CSS, with react-spring v9 for many of the UI animations. The backend was built with Node.js and Express. MongoDB is used for the database, with mongoose.js as the ODM library.

![Home screenshot](demo/home.png) 
## Usage

### Expanding dog cards

PadBase displays dog records as expandable cards that can be viewed in three degrees of detail. Expand dog cards by clicking the angle down icon on the right of the card. To view additional supplementary details, expand further with the angle down icon on the bottom right. 

![Expanded card gif](demo/screenshots/expand_card_gif.gif)

### Searching and filtering records

Expanding the dropdown within the search bar allows dog cards to be searched by a number of fields, like name, group, origin, etc., or by the dogs’ associated foster or Animal Pad coordinators. Dog records can additionally be filtered by one or more tags, like sex, vaccine status, cleared-for-adoption, etc. Active filters are displayed under the search bar; they can be removed in bulk by clicking ‘clear all’, or individually by clicking the ‘x’ button next to the filter.

### Editing records

Clicking the edit icon in the expanded dog card transforms the record into a form; fields can then be updated, and coordinators and fosters can be searched in a dropdown for easy selection and auto-population of details. Adding a new foster in this edit mode adds the foster to the database when the dog record is updated. This foster can subsequently be searched for and associated with other dogs, and their contact details auto-populated on selection.

### Adding records

New dogs can be added by clicking the Add New Dogs button to the right of the search bar. Dogs can be added individually (‘Add Single Dog’) with their full record editable, or in bulk as a group (‘Add New Dog Group’) or a litter (‘Add New Litter’).

When dogs are added in bulk as a group or litter, shared details are entered only once at the top (e.g group name, origin, mom’s name, DOB, etc.), and unique details for individual dogs are entered on their respective line. The number of dogs in the group can be set in the # of dogs field or by adding a new dog line with the ‘+’ button.

### Deleting records

If a record needs to be removed, click the edit button on the expanded dog card, followed by the trash button on the lower right. Click ‘Delete Forever’ to remove the record from database.