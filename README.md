# ThPI Get Together Backend

Backend service for ThPI (Thakurgaon Polytechnic Institute) Alumni Get Together registration system.

## Features

- Alumni registration system
- Payment integration (Bkash, Nagad, Rocket, DBBL)
- Admin dashboard for registration management
- Swagger API documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/thpi-get-together
PORT=3000
```

## Running the Application

1. Start the development server:
```bash
npm run start:dev
```

2. Access the Swagger API documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Registration

- `POST /registration` - Create a new registration
- `GET /registration` - Get all registrations
- `GET /registration/:id` - Get a specific registration
- `POST /registration/:id/payment` - Update payment status

### Payment

- `POST /payment/initiate` - Initiate a payment
- `POST /payment/verify` - Verify a payment

## Payment Methods

The system supports the following payment methods:
- Bkash
- Nagad
- Rocket
- Dutch-Bangla Bank (DBBL)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 