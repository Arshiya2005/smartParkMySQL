import { connection } from "../config/mySqlDb.js";

export const notifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await connection.promise().query(
            `SELECT * FROM notifications 
             WHERE users_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );
        await connection.promise().query(
            `UPDATE notifications 
             SET status = 'read' 
             WHERE users_id = ? AND status = 'unread'`,
            [userId]
        );
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unreadNotificationCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await connection.promise().query(
            `SELECT COUNT(*) AS count 
             FROM notifications 
             WHERE users_id = ? AND status = 'unread'`,
            [userId]
        );

        return res.status(200).json({ count: result[0].count });
    } catch (error) {
        console.error("Error counting unread notifications:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};