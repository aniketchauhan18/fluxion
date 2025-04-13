# *Smart Cash Flow Optimization for Your Business*
    
### **Problem:**
    
Small and mid-sized businesses (SMBs) lack access to sophisticated cash management tools that large corporations use to optimize liquidity. They manually move funds across accounts, trying to ensure operational stability while maximizing yield on excess cash, leading to inefficiencies and missed opportunities.

# Fluxion: Smart Cash Flow Optimization for Your Business
- **Monitors business cash flow** in real-time to understand liquidity needs.
- **Automatically moves funds** to high-yield accounts when excess cash is detected.
- **Predicts upcoming expenses** and transfers funds back to operational accounts just in time to cover payments.


![image](https://github.com/user-attachments/assets/651033c6-b2f2-4402-be8c-34273e43d420)


# Getting Started

Follow these steps to set up and run the project locally.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Git](https://git-scm.com/)



## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aniketchauhan18/fluxion.git
   ```

   1.1. Navigate to the project directory:
   ```sh
   cd fluxion
   ```

   1.2. Set up the environment variables:
   - Create a `.env` file in the root of the project.
  
 .env.example
```sh
  RPC_URL =
  ethUsdPriceFeed = 
  NEXT_PUBLIC_USDC_ADDRESS = 
  NEXT_PUBLIC_PRIVATE_KEY = 
  PaymanAPISecret = 
  NEXT_PUBLIC_ALCHEMY_KEY = 
  BETTER_AUTH_SECRET = 
  AUTH_SECRET = 
  NEXTAUTH_SECRET = 
  BETTER_AUTH_URL = 
  NEXT_PUBLIC_BASE_URL= 
  DB_NAME = 
  MONGODB_URI = 
  GOOGLE_CLIENT_SECRET = 
  GOOGLE_CLIENT_ID = 
  FACE_PAYMAN_SECRET =
  STORE_PAYMAN_SECRET = 

  PaymanAPISecret = 
```

   - Add the necessary environment variables as per the project requirements.

   1.3. Install dependencies:
   ```sh
   npm install
   ```

   1.4. Start the development:
   ```sh
   npm run dev


## Usage
Once the development server is running, open your browser and navigate to the provided localhost URL.

## Contributing
If you'd like to contribute, please fork the repository and create a pull request.
