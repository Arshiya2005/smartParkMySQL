import cron from 'node-cron';
import axios from "axios";
import { io } from '../server.js';
import { connection } from "../config/mySqlDb.js";
import { connectedUsers } from '../sockets/socket.js';

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date().toTimeString().split(' ')[0]; 
    console.log(now);
    await connection.promise().query(
      `UPDATE bookings
       SET status = 'inactive'
       WHERE eTime < ? AND status = 'active'`,
      [now]
    );
    const [bookings] = await connection.promise().query(
      `SELECT id FROM bookings WHERE eTime < ? AND status = 'inactive'`,
      [now]
    );
    for(const b of bookings) {
      const [response] = await connection.promise().query(
        `SELECT pending_payouts.*, payout_accounts.*, parkingspot.owner_id
        FROM pending_payouts
        INNER JOIN bookings ON pending_payouts.booking_id = bookings.id
        INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
        INNER JOIN payout_accounts ON parkingspot.owner_id = payout_accounts.owner_id
        WHERE pending_payouts.booking_id = ? AND pending_payouts.status = 'pending'`,
        [b.id]
      );
      const p = response[0];
      if(p) {
        const amount = p.amount;
        try {
            await connection.promise().query(
                  `UPDATE pending_payouts 
                  SET status = 'completed', processed_at = ?
                  WHERE booking_id = ?`,
                  [new Date(), p.booking_id]
                );
            
              try {
                await paymentSuccessful(p.owner_id, amount);
              } catch (error) {
                console.error(`Failed to send payment notification to user ${p.owner_id}:`, error);
              }
            }catch(error) {
                console.log(p.booking_id + " : payout failed");
                console.error("Payout Error:", error);
                await connection.promise().query(
                `UPDATE pending_payouts 
                SET status = 'failed', processed_at = ?
                WHERE booking_id = ?`,
                [new Date(), p.booking_id]
              );
            }
      }
    }
  } catch (error) {
    console.error("Razorpay Payout Error:", error.response?.data || error.message);
  }
});

export const paymentSuccessful = async (id, amount) => {
  try {
    const userSocketId = connectedUsers.get(id);
    const now = new Date();
    const message = `Payment Successful of ₹${(amount / 100).toFixed(2)}`;

    if (userSocketId) {
      io.to(userSocketId).emit('parking-payment', { message });
      await connection.promise().query(
        `INSERT INTO notifications (users_id, message, created_at, status)
         VALUES (?, ?, ?, ?)`,
        [id, message, now, 'read']
      );
      console.log(`Payment notification sent to user ${id}`);
    } else {
      await connection.promise().query(
        `INSERT INTO notifications (users_id, message, created_at, status)
         VALUES (?, ?, ?, ?)`,
        [id, message, now, 'unread']
      );
      console.log(`User ${id} not connected, notification saved`);
    }
  } catch (error) {
    throw error;
  }
};
