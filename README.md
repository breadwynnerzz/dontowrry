# Family Birthday Vacation Planner 2027

Static vacation planning dashboard for comparing:

- California / Anaheim / Los Angeles Area
- Wisconsin Dells, Wisconsin
- Texas / San Antonio / New Braunfels / Round Rock / Austin Area

Trip dates: July 2, 2027 - July 7, 2027.

## How to run

From this folder:

```bash
node server.js
```

Open:

```text
http://localhost:4173
```

No external packages are required.

## Files

- `index.html` - page structure
- `styles.css` - responsive dashboard styling
- `data.js` - destinations, attractions, budgets, comparison info, itineraries
- `script.js` - rendering, filters, favorites, ratings, localStorage
- `server.js` - simple local static server

## How to add more attractions

Open `data.js`.

Find the destination inside `plannerData.destinations`, then add a new object to its `attractions` array:

```js
{
  name: "Attraction Name",
  location: "City, State",
  website: "https://official-site.example",
  category: "Waterpark",
  image: "https://commons.wikimedia.org/wiki/Special:FilePath/example.jpg?width=900",
  imageAlt: "Short description of the real photo.",
  imageCredit: "Photographer / license",
  imageCreditUrl: "https://commons.wikimedia.org/wiki/File:example.jpg",
  description: "Short family-friendly description.",
  drive: "10-20 minutes from base"
}
```

Use official attraction/resort/tourism website images only when you have permission or are comfortable using their public preview media. Keep `imageAlt`, `imageCredit`, and `imageCreditUrl` filled in so the page stays honest about image sources. If an official site does not expose a usable real photo, leave `image` blank and the card will show a styled fallback instead of a fake image.

Use one of the existing categories so filters work:

`Waterpark`, `Theme Park`, `Resort`, `Beach`, `Casino`, `Animals`, `Show/Dinner`, `Shopping`, `Adventure`, `Family Activity`, `Food/Nightlife`, `Rainy Day`.

## How to update dates

Update the date text in `data.js`:

```js
trip: {
  dates: "July 2, 2027 - July 7, 2027"
}
```

Also update itinerary day labels inside each destination's `itineraries` array if the day-by-day plan changes.

## How to update budget

Open `data.js` and edit:

- `budgetRange`
- `budget.Flights`
- `budget["Hotel/Resort/Airbnb"]`
- `budget.Food`
- `budget.Attractions`
- `budget.Transportation`
- `budget.Extras`

These are planning estimates only, not quotes. The current planner keeps all destination ranges under $10,000 by assuming deal hunting, shared lodging, selective attraction days, and limited extras.

## How to deploy

This is a static site. You can deploy the files to:

- Netlify
- Vercel
- GitHub Pages
- Any web host that serves HTML, CSS, and JavaScript

Upload:

- `index.html`
- `styles.css`
- `data.js`
- `script.js`
- `FACT_CHECK_REPORT.md`

`server.js` is only needed for local preview.
