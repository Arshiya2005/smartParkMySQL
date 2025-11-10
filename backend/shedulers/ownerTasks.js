import cron from "node-cron";
import { connection } from "../config/mySqlDb.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled deletion job...");

  try {
    const [spotsToDelete] = await connection.promise().query(
      `SELECT * FROM scheduled_task WHERE status = 'pending'`
    );
    const now = new Date();
    for (const spot of spotsToDelete) {
        const { spot_id,  bike, car } = spot;
        if(bike === null && car === null) {
            await connection.promise().query(
              `UPDATE parkingspot
              SET is_active = FALSE
              WHERE id = ?`,
              [spot_id]
            );
        }else {
            await connection.promise().query(
              `UPDATE parkingspot
              SET bike = ?, car = ?
              WHERE id = ?`,
              [bike, car, spot_id]
            );
        }
          await connection.promise().query(
            `UPDATE scheduled_task
            SET status = 'completed', completed_at = ?
            WHERE id = ?`,
            [now, spot.id]
          );
    }

    console.log(`completed ${spotsToDelete.length} scheduled tasks.`);
  } catch (err) {
    console.error("Error running deletion job:", err);
  }
});
