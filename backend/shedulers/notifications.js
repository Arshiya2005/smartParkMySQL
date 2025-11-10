import cron from 'node-cron';
import { connection } from "../config/mySqlDb.js";
import { io } from '../server.js';
import { connectedUsers } from '../sockets/socket.js';

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetTime = now.toTimeString().split(' ')[0];
  const [bookings] = await connection.promise().query(
      `SELECT bookings.*, parkingspot.name 
       FROM bookings
       INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
       WHERE bookings.date = ? AND bookings.sTime = ? AND bookings.status = 'active';`,
      [today, targetTime]
    );
  
  for (const b of bookings) {
    const userSocketId = connectedUsers.get(b.customer_id);
    const message = `Your parking at ${b.name} starts at ${b.sTime}`;
    const [vehicleRows] = await connection.promise().query(
        `SELECT customer_id FROM vehicle WHERE id = ?`,
        [b.vehicle_id]
      );
      if (vehicleRows.length === 0) continue; 
      const customer_id = vehicleRows[0].customer_id;

    if (userSocketId) {
      io.to(userSocketId).emit('booking-reminder', {
        message: `Your parking at ${b.name} starts at ${b.stime}`,
      });
      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [customer_id, message, now, 'read']
        );
      console.log(`Reminder sent to user ${b.customer_id}`);
    } else {
      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [customer_id, message, now, 'unread']
        );
      console.log(`User ${b.customer_id} not connected, notification saved`);
    }
  }
});


cron.schedule('* * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetETime = new Date(now.getTime() + 15 * 60000)
    .toTimeString()
    .split(' ')[0];
    const [bookings] = await connection.promise().query(
      `SELECT bookings.*, parkingspot.name, vehicle.customer_id
       FROM bookings
       INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
       INNER JOIN vehicle ON bookings.vehicle_id = vehicle.id
       WHERE bookings.date = ? AND bookings.eTime = ? AND bookings.status = 'active';`,
      [today, targetETime]
    );

  for (const b of bookings) {
    const message = `Your parking at ${b.name} is ending in 15 minutes (at ${b.etime}).`;
    const userSocketId = connectedUsers.get(b.customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-end-reminder', {
        message,
      });

      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [b.customer_id, message, now, 'read']
        );

      console.log(`End reminder sent to user ${b.customer_id}`);
    } else {
      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [b.customer_id, message, now, 'unread']
        );
      console.log(`User ${b.customer_id} not connected, end notification saved`);
    }
  }
});

cron.schedule('* * * * *', async () => {
  
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetTime = now.toTimeString().split(' ')[0];
  const [bookings] = await connection.promise().query(
      `SELECT bookings.*, parkingspot.name, vehicle.customer_id
       FROM bookings
       INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
       INNER JOIN vehicle ON bookings.vehicle_id = vehicle.id
       WHERE bookings.date = ? AND bookings.eTime = ? AND bookings.status = 'active';`,
      [today, targetTime]
    );
  for (const b of bookings) {
    const userSocketId = connectedUsers.get(b.customer_id);
    const message = `Your parking at ${b.name} has ended`;
    if (userSocketId) {
      io.to(userSocketId).emit('booking-ended', {
        message: `Your parking at ${b.name} has ended`,
      });
      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [b.customer_id, message, now, 'read']
        );
      console.log(`Reminder sent to user ${b.customer_id}`);
    } else {
      await connection.promise().query(
          `INSERT INTO notifications (users_id, message, created_at, status)
           VALUES (?, ?, ?, ?)`,
          [b.customer_id, message, now, 'unread']
        );
      
      console.log(`User ${b.customer_id} not connected, notification saved`);
    }
  }
});

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const time = new Date(now.getTime() - 5 * 60000).toTimeString().split(' ')[0];
  const [expiredBookings] = await connection.promise().query(
      `SELECT * FROM bookings
      WHERE status = 'initiated' AND created_time <= ?`,
      [time]
    );
  await connection.promise().query(
      `UPDATE bookings 
       SET status = 'failed' 
       WHERE status = 'initiated' AND created_time <= ?`,
      [time]
    );
  
  for (const b of expiredBookings) {
    const [info] = await connection.promise().query(
        `SELECT vehicle.customer_id, parkingspot.name 
         FROM bookings
         INNER JOIN vehicle ON bookings.vehicle_id = vehicle.id
         INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
         WHERE bookings.id = ?`,
        [b.id]
      );
      if (info.length === 0) continue;
      const { customer_id, name } = info[0];

    const userSocketId = connectedUsers.get(customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('timeout', {
        message: `${name} bookings failed due to timeout`,
      });
      console.log(`Reminder sent to user ${b.customer_id}`);
    }
  }
  if (expiredBookings.length > 0) {
    console.log(`⏰ Marked ${expiredBookings.length} bookings as failed due to timeout`);
  }
});
