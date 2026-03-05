# 🦁 Animal Attractions Finder

A web application that helps you discover zoos, aquariums, wildlife parks, and other animal attractions near you!

## 🌟 Features

- **Location Search**: Enter any zip code or city name to find nearby animal attractions
- **Flexible Distance**: Search within any radius (10, 20, 50, 100+ miles)
- **Interactive Map**: Clean, responsive map with OpenStreetMap tiles (no watermarks!)
- **Smart Markers**: Blue markers for your location, orange markers for attractions
- **Get Directions**: Click any attraction for instant Google Maps directions
- **Locate Me**: One-click button to find your current location and auto-fill your zip code
- **Search Persistence**: Your search is remembered when you return from directions

## 🎯 How to Use

1. **Enter Location**: Type a zip code (e.g., "78666") or city name (e.g., "San Antonio, TX")
2. **Set Distance**: Choose how far you're willing to travel (default: 10 miles)
3. **Click Search**: The map will show all animal attractions in your area
4. **Explore Results**: Click orange markers to see attraction names
5. **Get Directions**: Click "Get Directions" in any popup to open Google Maps

### Alternative: Use "Locate Me"
- Click the blue pin button on the map (top-left)
- Allow location access when prompted
- Your zip code will be auto-filled
- Search to see attractions near you

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Geocoding**: Nominatim (OpenStreetMap) API
- **Search**: Real-time attraction discovery
- **No API Keys Required**: Uses free, open-source services

## 📁 Project Structure

```
ZooMap/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🚀 Getting Started

1. **Download**: Clone or download all files
2. **Open**: Double-click `index.html` to open in your browser
3. **Search**: Start finding animal attractions!

### Browser Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Location services (optional, for "Locate Me" feature)

## 🎨 Color Scheme

- **Green Circle**: Search radius (nature/wildlife theme)
- **Blue Markers**: Your location and "Locate Me" button
- **Orange Markers**: Animal attractions
- **Clean UI**: Professional, easy-to-read interface

## 🔍 Search Tips

- **Zip Codes**: "78666", "90210", "10001"
- **Cities**: "Austin, TX", "Orlando, FL", "San Diego, CA"
- **Large Areas**: Try 50-100 mile radius for major cities
- **Multiple Searches**: Search different areas without losing previous results

## 📊 What It Finds

The app searches for:
- 🦁 Zoos and Wildlife Parks
- 🐠 Aquariums and Aquatic Centers
- 🦒 Safari Parks and Game Reserves
- 🐾 Animal Sanctuaries
- 🦜 Bird Sanctuaries
- 🐘 Elephant Refuges

## 🐛 Troubleshooting

**No attractions found?**
- Try a larger search radius
- Check your spelling
- Some rural areas have fewer attractions

**Map not loading?**
- Check your internet connection
- Ensure JavaScript is enabled
- Try refreshing the page

**"Locate Me" not working?**
- Allow location access when prompted
- Check browser location permissions
- Try entering your zip code manually

## 🤝 Contributing

Feel free to improve this project! Ideas for enhancements:
- Mobile app version
- More attraction categories
- User reviews and ratings
- Favorite attractions list
- Offline functionality

## 📄 License

This project uses open-source libraries and free APIs. Feel free to use and modify for personal or educational purposes.

## 🙏 Acknowledgments

- **Leaflet.js**: Amazing open-source mapping library
- **OpenStreetMap**: Free, community-driven map data
- **Nominatim**: OpenStreetMap geocoding service
- **Leaflet Color Markers**: Custom marker icons

---

**Happy exploring! 🦁🐠🦒**