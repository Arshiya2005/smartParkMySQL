import { connection } from "../config/mySqlDb.js";

export const welcome = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const [cust] = await connection.promise().query(
        'SELECT * FROM users WHERE type = ?',
        ['customer']
        );
        const custCount = cust.length;
        const [own] = await connection.promise().query(
        'SELECT * FROM users WHERE type = ?',
        ['owner']
        );
        const ownCount = own.length;
        const [book] = await connection.promise().query(
        "SELECT * FROM bookings WHERE status != 'cancelled'"
        );
        const bookCount = book.length;
        const [area] = await connection.promise().query(
        'SELECT * FROM parkingspot WHERE is_active = 1'
        );
        let bikeSlots = 0;
        let carSlots = 0;
        for(const a of area) {
            bikeSlots = bikeSlots + a.bike;
            carSlots = carSlots + a.car;
        }
        return res.status(200).json({ custCount, ownCount, bookCount, bikeSlots, carSlots });
    } catch (error) {
        console.error("Error fetching counts in welcome:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const info = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const adminList = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const [admins] = await connection.promise().query(
            'SELECT * FROM users WHERE type = ?',
            ['admin']
        );
        return res.status(200).json({ data: admins });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const ownerInfo = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const [own] = await connection.promise().query(
        'SELECT * FROM users WHERE type = ?',
        ['owner']
        );
        return res.status(200).json({ data : own });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const ownerAreas = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const [area] = await connection.promise().query(
        'SELECT * FROM parkingspot WHERE owner_id = ?',
        [id]
        );
        return res.status(200).json({ data : area });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const areaActiveBookings = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const [response] = await connection.promise().query(
        'SELECT * FROM bookings WHERE slot_id = ? AND date = ? AND status = ? ORDER BY sTime DESC',
        [id, today, 'active']
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const areaBookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const [response] = await connection.promise().query(
        'SELECT * FROM bookings WHERE slot_id = ? ORDER BY date DESC, sTime DESC',
        [id]
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const customerInfo = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const [cust] = await connection.promise().query(
        'SELECT * FROM users WHERE type = ?',
        ['customer']
        );
        return res.status(200).json({ data : cust });
    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const customerVehicles = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const [vehicles] = await connection.promise().query(
        'SELECT * FROM vehicle WHERE customer_id = ?',
        [id]
        );
        return res.status(200).json({ data : vehicles });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const customerActiveBooking = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        
        const [response] = await connection.promise().query(
        `SELECT b.* 
        FROM bookings b
        JOIN vehicle v ON b.vehicle_id = v.id
        WHERE v.customer_id = ? 
            AND b.date = ? 
            AND b.status = 'active'
        ORDER BY b.sTime DESC`,
        [id, today]
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const customerBookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const [response] = await connection.promise().query(
        `SELECT b.* 
        FROM bookings b
        JOIN vehicle v ON b.vehicle_id = v.id
        WHERE v.customer_id = ? 
        ORDER BY b.date DESC, b.sTime DESC`,
        [id]
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};