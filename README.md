# Coconut Juice Inventory (CocoTracker) - Frontend

## Project Overview

The Coconut Juice Inventory Management System is a web application designed to help small businesses manage their coconut juice inventory. It simplifies the process of tracking inventory, ensuring there is enough stock to meet demand, and avoiding stockouts. The system tracks the amount of coconut juice available, where it's stored, and daily sales.

## Features

- **User Authentication**: Secure user authentication using JWT (JSON Web Tokens).
- **Inventory Management**: Track the quantity and storage location of coconut juice.
- **Sales Monitoring**: Monitor daily sales to analyze demand trends using bar charts.
- **Role-based Access Control**: Different levels of access for admins, kiosk owners, and other roles.
- **Stock Allocation**: Admins can allocate new stock to users.
- **Return Requests**: Users can place return requests, and admins can approve or reject them.

## Tech Stack

- **Frontend**: React.js with Vite and Tailwind CSS for styling.
- **Backend**: Node.js and Express.js are used to build the API.
- **Authentication**: JWT (JSON Web Tokens) for secure authentication.
- **Database**: MongoDB for storing application data.

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 7 or higher) 

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yashmodi9998/Cocotracker-frontend.git
   ```

2. Navigate into the project directory:

   ```bash
   cd cocotracker-frontend
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The application will be running at `http://localhost:5173`.

## Bar Charts for Sales Data

The application uses bar charts from Chart.js to visually represent sales data. This feature provides a clear and intuitive way to monitor daily sales trends and make data-driven decisions.

### Example of a Bar Chart:

The bar chart displays sales data with the following details:
- **X-axis**: Dates
- **Y-axis**: Quantity of Coconut Juice Sold, allocated juice

This visual representation helps quickly identify sales patterns and trends, enabling better inventory management.

## Deployment

This project is deployed on Vercel and can be accessed at [https://cocotracker.vercel.app](https://cocotracker.vercel.app)

