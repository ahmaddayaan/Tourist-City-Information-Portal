# 🌍 Tourist City Information Portal

A web-based application that provides comprehensive information about tourist cities using multiple APIs.  
Users can search for any city and instantly access weather details, city information, latest news, maps, and personal travel notes.

This project demonstrates the use of **JavaScript API integration, asynchronous programming, and dynamic UI rendering**.

---

## 🚀 Features

### 🔎 City Search
Users can search for any city to retrieve real-time information about the destination.

### 🌦 Weather Information
- Displays current temperature and weather conditions
- Shows humidity and wind speed
- Displays weather icons and minimum/maximum temperature
- Provides a **14-day weather forecast**
- **currently it shows 3-day forecast due to the free plan** 

### 🌍 City Information
- Fetches information about the selected city using the **Wikipedia API**
- Displays city description and related details

### 📰 Latest News
- Fetches recent news articles related to the searched city
- Displays headlines and summaries
- Provides links to read full articles

### 🗺 Interactive Map
- Displays the location of the searched city using **Google Maps embed**

### 🕒 Real-Time Clock
- Displays the current time and date
- Updates dynamically every second

### 📝 Travel Notes & Bucket List
- Users can write travel notes
- Add destinations to a **personal bucket list**
- Notes and bucket list are saved using **Local Storage**

### ✨ Smooth UI Experience
- Animated cards appear on scroll
- Responsive layout
- Modern glassmorphism style interface

---

## 🛠 Technologies Used

- **HTML5** – Structure of the web application
- **CSS3** – Styling and responsive UI design
- **JavaScript (ES6)** – Core application logic
- **REST APIs** – Data fetching from external services
- **Local Storage** – Saving notes and bucket list
- **Fetch API** – Handling asynchronous requests

---

## 🔗 APIs Used

This project integrates multiple public APIs:

- **Weather API** – Provides weather data and forecasts [currently it shows 3-day forecast due to free plan]
- **Wikipedia API** – Retrieves city information
- **GNews API** – Fetches the latest news related to the city
- **Google Maps Embed** – Displays city location

These APIs allow the portal to provide real-time dynamic information.

---

## 📸 Screenshots

### Home Page
 [Clock and weather](screenshot1.png)

### Information via Wikipedia
 [City Information](screenshot2.png)

 ### News
 [News](screenshot3.png)

### Map and Bucket list
 [Map and Bucket list](screenshot4.png)

---

## 📂 Project Structure

tourist-city-information-portal
│
├── index.html
├── style.css
├── script.js
├── screenshot1.png
├── screenshot2.png
├── screenshot3.png
├── screenshot4.png
└── README.md

---

## ⚙️ How It Works

1. User enters a city name in the search box.
2. The application sends requests to multiple APIs.
3. JavaScript fetches the data asynchronously.
4. The UI dynamically updates with:
   - Weather details
   - City description
   - News articles
   - Map location
5. Users can save personal notes and travel plans using local storage.

---

## 📚 Learning Outcomes

This project helped me learn and practice:

- API integration using JavaScript
- Handling asynchronous operations with `fetch()` and `async/await`
- DOM manipulation and dynamic UI updates
- Working with multiple APIs in a single project
- Using local storage to persist user data
- Designing responsive web interfaces

---

## 🎯 Future Improvements

Possible improvements for future versions:

- Convert project to **React**
- Add **user authentication**
- Integrate **AI-based travel recommendations**
- Add **hotel and flight APIs**
- Improve mobile UI/UX

---

## 👨‍💻 Author

**Mohammed Ayaan**  
BTech Computer Science Student  
