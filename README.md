# 🚌 Bus Boarding Sequence Generator

A full-stack Next.js application that generates an optimal boarding sequence for bus passengers to maximize boarding efficiency. The system calculates the best order for passengers to board based on their seat locations, minimizing blocking and total boarding time.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)


## ✨ Features

- 📤 **File Upload** - Upload booking data in text format (tab or space-separated)
- 🧮 **Smart Algorithm** - Calculates optimal boarding sequence based on seat distances
- 📊 **Visual Results** - Displays sequence table and interactive bus layout visualization
- 💾 **Export Functionality** - Download the generated sequence as a text file
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode support
- 📱 **Mobile Responsive** - Fully optimized for mobile and tablet devices
- ⚡ **Fast Processing** - Efficient algorithm with real-time results

## 🎯 Problem Statement

Design and implement a system that generates a booking-wise boarding sequence for bus passengers from the front entry to minimize boarding time. The system produces a UI-friendly output that reflects the order in which passengers should board, considering only one front entry point.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bus-boarding
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📋 Input Format

Upload a text file with booking data in the following format:

```
Booking_ID    Seats
101   A1,B1
120   A20,C2
103   B5,C5
```

**Format Details:**
- First line is the header (optional, will be auto-detected)
- Each subsequent line contains: `Booking_ID` followed by `Seats` (comma-separated)
- Supports both **tab-separated** and **space-separated** formats
- Seat format: Letter (A-D) + Number (1-20+)
  - A/B are left side, C/D are right side
  - Lower numbers are closer to entry, higher numbers are further

## 🎯 Algorithm

The boarding sequence algorithm optimizes for maximum boarding efficiency:

1. **Distance Calculation**: Each seat's distance from the front entry is calculated based on its position number (e.g., A1 = distance 1, A20 = distance 20)

2. **Max Distance per Booking**: For each booking with multiple seats, the algorithm finds the maximum distance (furthest seat)

3. **Sorting Strategy**:
   - **Primary**: Maximum distance (descending - furthest seats first)
   - **Secondary**: Booking ID (ascending - earlier IDs first in case of tie)

4. **Result**: Passengers with the furthest seats board first, preventing them from blocking passengers with closer seats

### Example

**Input:**
```
Booking_ID    Seats
101   A1,B1
120   A20,C2
```

**Processing:**
- Booking 101: Max distance = 1 (from A1, B1)
- Booking 120: Max distance = 20 (from A20, C2)

**Output:**
```
Seq   Booking_ID
1     120
2     101
```

## 📊 Output Format

The system generates a sequence table with the following format:

```
Seq   Booking_ID
1     120
2     101
3     103
...
```

The output can be:
- **Viewed** in the web interface with detailed seat information
- **Downloaded** as a tab-separated text file

## 🏗️ Bus Layout

The bus layout visualization shows:

```
A20/B20    C20/D20  ← Back of Bus
...
A1/B1      C1/D1
        🚪 Entry (Front)
```

**Layout Details:**
- **A/B seats**: Left side of the bus
- **C/D seats**: Right side of the bus
- **Entry point**: Single front entry
- **Blocking constraint**: If passenger X is standing in the aisle, passenger Y behind cannot cross

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hooks** - State management

## 📁 Project Structure

```
bus-boarding/
├── app/
│   ├── api/
│   │   └── boarding-sequence/
│   │       └── route.ts          # API endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main UI page
├── lib/
│   ├── boarding-algorithm.ts      # Core algorithm logic
│   └── utils.ts                   # Utility functions
├── public/
│   └── sample-bookings.txt       # Sample data file
└── package.json
```

## 🔌 API Endpoint

### POST `/api/boarding-sequence`

Processes a booking data file and returns the boarding sequence.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (text file with booking data)

**Response:**
```json
{
  "success": true,
  "sequence": [
    { "seq": 1, "bookingId": "120" },
    { "seq": 2, "bookingId": "101" }
  ],
  "details": [
    {
      "seq": 1,
      "bookingId": "120",
      "seats": ["A20", "C2"],
      "maxDistance": 20
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "No file provided"
}
```

## 🎨 UI Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Automatic dark mode support
- **File Upload**: Drag & drop or click to upload
- **Real-time Processing**: Instant sequence generation
- **Interactive Visualization**: Bus layout with seat highlighting
- **Export**: Download sequence as text file
- **Error Handling**: Clear error messages and validation

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- 📱 **Mobile phones** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)

All features work seamlessly across all device sizes.

## 🧪 Testing

Test the application with the included sample file:

1. Navigate to `public/sample-bookings.txt`
2. Upload it through the UI
3. Verify the output matches expected results

**Expected Results:**
- Booking 120 (A20, C2) should be Seq 1 (furthest seat: A20)
- Booking 101 (A1, B1) should be Seq 2 (furthest seat: A1)

## 📝 Constraints

The system implements the following constraints:

1. ✅ **Single Front Entry** - All passengers board from one entry point
2. ✅ **Seat Distance** - Seat labels imply relative distance from entry
3. ✅ **Multiple Seats** - A single booking may contain multiple seat labels
4. ✅ **Max Boarding Time** - Optimizes for maximum boarding efficiency
5. ✅ **Tie Breaking** - Earlier booking IDs prioritized when distances are equal



