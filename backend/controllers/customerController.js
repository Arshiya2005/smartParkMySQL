import axios from "axios";
import dotenv from "dotenv";
import { connection } from "../config/mySqlDb.js";

dotenv.config();

export const welcome = async (req, res) => {
    console.log("req.user =", req.user);
    try {
        if(req.user.type === "customer") {
            return res.status(200).json({ data: req.user });
        }else {
            return res.status(401).json({ error: "no active user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const myVehicles = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
         const [result] = await connection.promise().query(
            'SELECT * FROM vehicle WHERE customer_id = ? AND is_active = 1',
            [id]
        );
        console.log(result);
        return res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const addVehicle = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        console.log(req.body);
        const name = req.body.name;
        const no = req.body.no.replace(/\s+/g, "").toUpperCase();
        const type = req.body.type;
        const id = req.user.id;
        const [response] = await connection.promise().query(
            'SELECT * FROM vehicle WHERE number = ?',
            [no]
        );
        if(response.length > 0) {
            const data = response[0];
            if(data.is_active) {
                return res.status(409).json({ message: "Vehicle Already exists" });
            }else {
                await connection.promise().query(
                    'UPDATE vehicle SET is_active = 1, model = ?, customer_id = ? WHERE id = ?',
                    [name, id, data.id]
                );
            }
        }else {
            await connection.promise().query(
                'INSERT INTO vehicle (model, type, number, customer_id) VALUES (?, ?, ?, ?)',
                [name, type, no, id]
            );
        }
        return res.status(200).json({ message: "Vehicle added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const deleteVehicle = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.body.id;
        const userId = req.user.id;
        const [data] = await connection.promise().query(
            'SELECT * FROM bookings WHERE vehicle_id = ? AND status = ?',
            [id, 'active']
        );
        if(data.length > 0) {
            return res.status(409).json({ message: "Can't delete vehicle with active bookings." });
        }
        await connection.promise().query(
            'UPDATE vehicle SET is_active = 0 WHERE id = ? AND customer_id = ?',
            [id, userId]
        );
        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const info = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editFname = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const fname = req.body.fname;
        console.log(fname);
        const id = req.user.id;
        await connection.promise().query(
            'UPDATE users SET fname = ? WHERE id = ?',
            [fname, id]
        );
        req.user.fname = fname;
        console.log(req.user);
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editLname = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const lname = req.body.lname;
        const id = req.user.id;
        await connection.promise().query(
            'UPDATE users SET lname = ? WHERE id = ?',
            [lname, id]
        );
        req.user.lname = lname;
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const searchNearby = async (req, res) => {
  try {
    if (req.user.type !== "customer") {
      return res.status(401).json({ error: "No active user" });
    }
    const location = req.body.location;
    console.log(req.body);
    var lat;
    var lon;
    const Vid = req.body.id;
    const Vtype = req.body.type;
    if(location) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        const response = await axios.get(url, {
        headers: {
            "User-Agent": "SmartParkingApp"
        }
        });
        const data = response.data;
        if (data.length > 0) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);            
        } else {
            return res.status(404).json({message: "Location not found"});
        }
    }else {
        lat = parseFloat(req.body.lat);
        lon = parseFloat(req.body.lon);
    }

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Missing or invalid coordinates" });
    }
    
    let allSpots = [];
    let radiusInKm = 2;
    let attemptLimit = 4;
    do {
        //Haversine formula
        const [spots] = await connection.promise().query(
        `SELECT id, name, lat, lon, bike, car
         FROM parkingspot
         WHERE 6371 * acos(
            cos(radians(?)) 
            * cos(radians(lat)) 
            * cos(radians(lon) - radians(?)) 
            + sin(radians(?)) * sin(radians(lat))
         ) < ?`,
         [lat, lon, lat, radiusInKm]
        );
        allSpots = spots;
        radiusInKm += 1;
        attemptLimit--;
    } while(allSpots.length < 5&& attemptLimit > 0);
    
    const results = [];

    for (const spot of allSpots) {
        if ((Vtype === "bike" && spot.bike === 0) || (Vtype === "car" && spot.car === 0)) {
            continue;
        }
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${lon},${lat}&end=${spot.lon},${spot.lat}`;
      const response = await axios.get(url);
      const features = response.data.features;
      const summary = features[0].properties.segments[0];
      const distance = summary.distance; 
      const duration = summary.duration;
      results.push({
            id: spot.id,
            name: spot.name,
            lat: spot.lat,
            lon: spot.lon,
            distance,
            duration,
            Vid
        });
    }
    console.log(results);
    results.sort((a, b) => a.distance - b.distance);
    return res.status(200).json({ userloc : {lon ,lat }, data: results.slice(0, 5) });
  } catch (error) {
    if (error.response) {
    console.error(`ORS API error [${error.response.status}]:`, error.response.data);
    if (error.response.status === 429) {
      console.error("❌ Rate limit exceeded. Try again later.");
    }
  } else {
    console.error("ORS API error:", error);
  }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const chooseSlot = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const spot = req.body.spot;
        const id = spot.id;
        const Vid = spot.Vid;
        const sTime = req.body.sTime;
        const eTime = req.body.eTime;
        const [spotdata] = await connection.promise().query(
            `SELECT 
                p.*,  
                o.id AS owner_id,
                o.fname, o.lname, o.username
            FROM parkingspot p
            INNER JOIN users o ON p.owner_id = o.id
            WHERE p.id = ?`,
            [id]
        );
        //console.log("reached here");
        console.log(spotdata);
        const ownerdata = {
            id : spotdata[0].owner_id,
            fname : spotdata[0].fname,
            lname : spotdata[0].lname,
            username : spotdata[0].username
        }
        const [vehicle] = await connection.promise().query(
            'SELECT * FROM vehicle WHERE id = ?',
            [Vid]
        );
        //console.log(spotdata);
        const type = vehicle[0].type;
        
        const count = type === "bike" ? spotdata[0].bike : spotdata[0].car;
        const today = new Date().toISOString().slice(0, 10);
        console.log("reached here before for loop");
        for(var i = 1; i <= count; i++) {
            const [response] = await connection.promise().query(
                `SELECT * FROM bookings
                 WHERE date = ? AND slot_id = ? AND slot_no = ? 
                 AND NOT (? <= sTime OR ? >= eTime)
                 AND (status = ? OR status = ?)`,
                 [today, id, i, eTime, sTime, 'active', 'initiated']
            );
            if (response.length === 0) {
                return res.status(200).json({ user : req.user, slot : spotdata, vehicle, chosenSlotNo: i, ownerdata });
            }
            console.log("reached here in loop");
        }
        return res.status(409).json({ message: "slot not available" });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "internal server error" });
    }
};

export const activeBooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const time = now.toTimeString().split(' ')[0];
        const [response] = await connection.promise().query(
            `SELECT b.* 
             FROM bookings b
             JOIN vehicle v ON b.vehicle_id = v.id
             WHERE v.customer_id = ? 
               AND b.date = ? 
               AND ? < b.eTime 
               AND b.status = ?
             ORDER BY b.created_time DESC`,
             [id, today, time, 'active']
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response });
        }
        console.log("no data available !");
        return res.status(200).json({ message: "No active booking at this time" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const Specificbooking = async (req, res) => {
    try {
      if (req.user.type !== "customer") {
        return res.status(401).json({ error: "no active user" });
      }
  
      const book = JSON.parse(decodeURIComponent(req.query.book)); 
      const [vehicle] = await connection.promise().query(
        'SELECT * FROM vehicle WHERE id = ?',
            [book.vehicle_id]
        );
        const [spotdata] = await connection.promise().query(
        `SELECT 
            p.*,  
            o.id AS owner_id,
            o.fname, o.lname, o.username
        FROM parkingspot p
        INNER JOIN users o ON p.owner_id = o.id
        WHERE p.id = ?`,
        [book.slot_id]
    );
        const ownerdata = {
            id : spotdata[0].owner_id,
            fname : spotdata[0].fname,
            lname : spotdata[0].lname,
            username : spotdata[0].username
        }
        book.type = vehicle[0].type;
      return res.status(200).json({
        book,
        spot: spotdata[0],
        vehicle: vehicle[0],
        owner: ownerdata,
      });
    } catch (error) {
      console.error("Specificbooking error:", error);
      return res.status(500).json({ error: "internal server error" });
    }
  };

export const addbooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const time = now.toTimeString().split(' ')[0];
        const {slot, vehicle, chosenSlotNo, owner} = req.body;
        await connection.promise().query(
            `INSERT INTO bookings (
                sTime, eTime, date, created_time, slot_no,
                vehicle_id, slot_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [slot.sTime, slot.eTime, today, time, chosenSlotNo, vehicle.id, slot.id]
        );
        console.log("inserted info in bookings");
        const [data] = await connection.promise().query(
            `SELECT * FROM bookings 
             WHERE sTime = ? 
               AND eTime = ? 
               AND date = ? 
               AND created_time = ? 
               AND slot_no = ? 
               AND vehicle_id = ? 
               AND slot_id = ?`,
            [slot.sTime, slot.eTime, today, time, chosenSlotNo, vehicle.id, slot.id]
        );
        console.log("booking : " + data);
        return res.status(200).json({message : "booked successfully", id : data[0].id });
    } catch (error) {
        console.error("Booking error:", error);
        return res.status(500).json({ error: "internal server error" });
    }
};

export const checkAvailability = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const {slot, chosenSlotNo} = req.body;
        const [response] = await connection.promise().query(
            `SELECT * FROM bookings
             WHERE date = ?
               AND slot_id = ?
               AND slot_no = ?
               AND NOT (? <= sTime OR ? >= eTime)
               AND (status = ? OR status = ?)`,
            [today, slot.id, chosenSlotNo, slot.eTime, slot.sTime, 'active', 'initiated']
        );
        if (response.length === 0) {
            return res.status(200).json({message : "available"});
        }
        return res.status(409).json({message : "Not available"});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
}

export const bookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const [response] = await connection.promise().query(
            `SELECT b.*
             FROM bookings b
             JOIN vehicle v ON b.vehicle_id = v.id
             WHERE v.customer_id = ?
             ORDER BY b.date DESC, b.created_time DESC`,
            [id]
        );
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const [booking] = await connection.promise().query(
            `SELECT b.id, p.payment_id, p.amount 
             FROM bookings b
             JOIN payments p ON b.id = p.booking_id
             WHERE b.id = ?`,
            [id]
        );
        if (booking.length === 0) {
            return res.status(404).json({ error: "booking not found" });
        }
        const idB = booking[0].payment_id;
        console.log("payment id : " + idB);
        await axios.post(`https://api.razorpay.com/v1/payments/${idB}/refund`,
            { amount: booking[0].amount },
            {
                auth: {
                username: process.env.KEY_ID,
                password: process.env.KEY_SECRET,
                },
                headers: { 'Content-Type': 'application/json' },
            }
        );
        console.log("refund processed");
        await connection.promise().query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
            [id]
        );
        await connection.promise().query(
            `UPDATE pending_payouts 
             SET status = 'cancelled', processed_at = ? 
             WHERE booking_id = ?`,
            [new Date(), id]
        );
        return res.status(200).json({ message: "booking cancelled successfully & refund precessed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" });
    }
};
