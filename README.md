# Schlosswochen Reservation

A simple Angular application for managing reservations for Schlosswochen (castle weeks). Users can select the number of children and choose which weeks they want to reserve, then submit the form.

## Features

- **Kids Selector**: Increment/decrement the number of children (1-3) with visual feedback
- **Weeks Selector**: Drag-and-drop interface to select available weeks and arrange them in order
- **Form Submission**: Submits reservation data to Netlify

## Tech Stack

- **Framework**: Angular 20
- **UI**: Vanilla CSS (CSS Grid/Flexbox) with inline SVG icons
- **Drag & Drop**: Angular CDK (`@angular/cdk/drag-drop`)
- **Forms**: Angular Reactive Forms
- **Deployment**: Netlify (via Netlify Forms)

## Project Structure

```
src/app/
├── add-week/          # Icon button component (add/remove/arrow icons)
├── kids-selector/     # Child count selector with +/- buttons
├── weeks-selector/    # Week selection with drag-and-drop
├── submitter/         # Submit button component
└── app.component.ts   # Main app with form handling
```

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Development server
```bash
npm start
```
Navigates to `http://localhost:4200/`.

### Build
```bash
npm run build
```
Build artifacts stored in `dist/schlosswochen-reservation/`.

## Usage

1. Select number of children using the +/- buttons in the Kids Selector
2. Drag weeks from the "Auswahl Wochen" (Available Weeks) column to the "Reservation Wochen" (Reserved Weeks) column
3. Reorder reserved weeks by dragging them up/down
4. Remove weeks using the remove icon
5. Click "Senden" (Submit) to send the reservation

## Deployment

Deploy the `dist/schlosswochen-reservation` directory to any static hosting service. The app is configured for Netlify Forms - ensure the form `action` and `netlify` attributes are preserved.

## Notes

- Previously used Angular Material for grid layout and icons, now replaced with vanilla CSS and inline SVG
- Angular CDK drag-and-drop is retained for the week selection functionality
- Form uses hidden inputs for Netlify Forms compatibility
