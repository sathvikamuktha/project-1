I built an Express.js web application using the MVC (Model-View-Controller) pattern and the EJS template engine. The application simulates a marketplace where users can manage items for sale. The project includes functionality to view, add, edit, delete, and search items.
## Tech Stack:
- Backend: Express.js
- Template Engine: EJS
- Data Storage: Hard-coded JavaScript objects (using an array to store items)
- Routing: RESTful routes to manage items (using Express routes and controller functions)
## Installation
1. Clone the repository:
   ``
   git clone https://github.com/sathvikamuktha/project-1.git
   cd project-1
   ``
2. Install dependencies:
   ``
   npm install
   ``

## File Structure
- app.js: Main application file that sets up the Express server.
- routes: Contains route modules to handle requests.
- controllers: Includes controller functions for each route.
- views: EJS templates that render the pages.
- partials: Reusable components like headers and footers.
- models: Contains data models representing items.

## Available Routes:
``/`` : Landing page that displays all active items.

``/items`` : View all items for sale (can also be used for searching).

``/items/:id`` : View details of a specific item.

``/items/new`` : Display form to create a new item.

``/items/edit/:id`` : Form to edit an existing item.

``/items/delete/:id`` : Delete an existing item.


** This project is developed as part of a course assignment **
