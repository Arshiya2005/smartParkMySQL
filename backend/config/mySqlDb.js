import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const connection = mysql.createConnection({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database!");
  }
});

export async function initDb() {
  try {
    console.log('Initializing MySQL database...');

    const createTables = [
      // Users Table
      `CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        fname VARCHAR(100),
        lname VARCHAR(100),
        username VARCHAR(255) NOT NULL,
        password VARCHAR(100) NOT NULL,
        contact VARCHAR(15),
        type VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Vehicle Table
      `CREATE TABLE IF NOT EXISTS vehicle (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        model VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL,
        number VARCHAR(10) NOT NULL UNIQUE,
        customer_id CHAR(36) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // ParkingSpot Table
      `CREATE TABLE IF NOT EXISTS parkingspot (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        lon DOUBLE NOT NULL,
        lat DOUBLE NOT NULL,
        bike INT DEFAULT 0,
        car INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        owner_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Bookings Table
      `CREATE TABLE IF NOT EXISTS bookings (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        sTime TIME NOT NULL,
        eTime TIME NOT NULL,
        date DATE NOT NULL,
        created_time TIME NOT NULL,
        slot_no INT NOT NULL,
        status VARCHAR(20) DEFAULT 'initiated',
        vehicle_id CHAR(36) NOT NULL,
        slot_id CHAR(36) NOT NULL,
        FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE,
        FOREIGN KEY (slot_id) REFERENCES parkingspot(id) ON DELETE CASCADE
      );`,

      // Payments Table
      `CREATE TABLE IF NOT EXISTS payments (
        booking_id CHAR(36) PRIMARY KEY,
        payment_id VARCHAR(255) NOT NULL,
        order_id VARCHAR(255) NOT NULL,
        amount INT,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      );`,

      // Notifications Table
      `CREATE TABLE IF NOT EXISTS notifications (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        users_id CHAR(36) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(10) NOT NULL,
        FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Scheduled Task Table
      `CREATE TABLE IF NOT EXISTS scheduled_task (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        spot_id CHAR(36) NOT NULL,
        bike INT,
        car INT,
        status VARCHAR(10) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (spot_id) REFERENCES parkingspot(id) ON DELETE CASCADE
      );`,

      // Payout Accounts Table
      `CREATE TABLE IF NOT EXISTS payout_accounts (
        owner_id CHAR(36) PRIMARY KEY,
        contact_id VARCHAR(255) NOT NULL,
        fund_account_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Pending Payouts Table
      `CREATE TABLE IF NOT EXISTS pending_payouts (
        booking_id CHAR(36) PRIMARY KEY,
        amount INT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      );`
    ];

    for (const query of createTables) {
      await connection.promise().query(query);
    }

    console.log('All tables verified and ready.');
  } catch (error) {
    console.log("Error initDb", error);
        throw error;
  }
}
