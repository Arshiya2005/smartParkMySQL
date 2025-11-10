import { connection } from "../config/mySqlDb.js";

export const welcome = async (req, res) => {
    try {
        if(req.user.type === "owner") {
            return res.status(200).json({ data: req.user });
        }else {
            return res.status(401).json({ error: "no active user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const info = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editFname = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
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
        if(req.user.type !== "owner") {
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

export const addArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const {lon, lat, bike, car, name} = req.body;
        const [existing] = await connection.promise().query(
            'SELECT * FROM parkingspot WHERE lat = ? AND lon = ?',
            [lat, lon]
        );
        if (existing.length > 0) {
            const spot = existing[0];
            if (!(spot.is_active === false && spot.owner_id == req.user.id)) {
                return res.status(409).json({ error: "Parking area already exists" });
            }
        }
        await connection.promise().query(
            'INSERT INTO parkingspot (name, lon, lat, bike, car, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, lon, lat, bike, car, req.user.id]
        );
        return res.status(200).json({ message: "added successfully" });
    } catch (error) {
        console.error("addArea error:", error);
        return res.status(500).json({ error: "internal server error" });
    }
};

export const parkingAreas = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const [response] = await connection.promise().query(
            'SELECT * FROM parkingspot WHERE owner_id = ? AND is_active = 1',
            [id]
        );
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const availableSlot = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const area = JSON.parse(decodeURIComponent(req.query.area)); // ✅ safely parse
        const bike = area.bike;
        const car = area.car;
        const id = area.id;
        var occBike = 0;
        var occCar = 0;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const time = now.toTimeString().split(' ')[0];
        for(var i = 1; i <= bike; i++) {
            const [response] = await connection.promise().query(
                `SELECT * FROM bookings 
                inner join vehicle on bookings.vehicle_id = vehicle.id
                 WHERE slot_id = ? 
                   AND date = ? 
                   AND sTime <= ? 
                   AND eTime >= ? 
                   AND vehicle.type = ? 
                   AND slot_no = ? 
                   AND status = 'active'`,
                [id, today, time, time, 'bike', i]
            );
            if(response.length > 0) {
                occBike++;
            }
        }
        for(var i = 1; i <= car; i++) {
            const [response] = await connection.promise().query(
                `SELECT * FROM bookings 
                inner join vehicle on bookings.vehicle_id = vehicle.id
                 WHERE slot_id = ? 
                   AND date = ? 
                   AND sTime <= ? 
                   AND eTime >= ? 
                   AND vehicle.type = ? 
                   AND slot_no = ? 
                   AND status = 'active'`,
                [id, today, time, time, 'car', i]
            );
            if(response.length > 0) {
                occCar++;
            }
        }
        //console.log(occCar + " " + occBike);
        return res.status(200).json({ bikedata : {occ : occBike, bike}, cardata : {occ : occCar, car}});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const activeBookingInArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const area = JSON.parse(decodeURIComponent(req.query.area)); 
        const [response] = await connection.promise().query(
            `SELECT * FROM bookings 
             WHERE slot_id = ? 
               AND date = ? 
               AND status = 'active' 
             ORDER BY sTime ASC`,
            [area.id, today]
        );
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const Specificbooking = async (req, res) => {
    try {
      if (req.user.type !== "owner") {
        return res.status(401).json({ error: "no active user" });
      }
  
      const book = JSON.parse(decodeURIComponent(req.query.book)); 
      const [vehicle] = await connection.promise().query(
            `SELECT * FROM vehicle WHERE id = ?`,
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


export const bookingHistoryInArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const area = JSON.parse(decodeURIComponent(req.query.area)); 
        const [response] = await connection.promise().query(
            `SELECT * FROM bookings 
             WHERE slot_id = ? 
             ORDER BY date ASC, sTime ASC`,
            [area.id]
        );
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const chnageSlotCount = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const {bike, car, area} = req.body;
        const [data] = await connection.promise().query(
            `SELECT * FROM scheduled_task 
             WHERE spot_id = ? AND status = 'pending'`,
            [area.id]
        );
        if(data.length > 0 && data[0].bike != null) {
            const task = data[0];
            if(!(task.bike == bike && task.car == car)) {
                await connection.promise().query(
                    `UPDATE scheduled_task 
                     SET bike = ?, car = ?
                     WHERE spot_id = ? AND  created_at = ? `,
                    [bike, car, area.id, now]
                );
            }
        }else if(data.length > 0) {
            return res.status(409).json({ message : "Area is requested to delete. Can't change slot count "});
        } else {
            await connection.promise().query(
                `INSERT INTO scheduled_task (spot_id, bike, car, created_at) 
                 VALUES (?, ?, ?, ?)`,
                [area.id, bike, car, now]
            );
        }
        
        return res.status(200).json({ message : "request is sent. slots will be be updated by tomorrow"});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const deleteArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const area = req.body.area;
        console.log("In delete Area ");
        const [data] = await connection.promise().query(
            `SELECT * FROM scheduled_task WHERE spot_id = ? AND status = 'pending'`,
            [area.id]
        );
        console.log(data);
        if(data.length > 0 && data[0].bike == null) {
            return res.status(409).json({ message: "Deletion already requested. Please wait." });
        }else if(data.length > 0) {
            await connection.promise().query(
                `UPDATE scheduled_task 
                 SET status = 'cancelled' 
                 WHERE spot_id = ? AND status = 'pending'`,
                [area.id]
            );
        } 
        await connection.promise().query(
            `INSERT INTO scheduled_task (spot_id, created_at) 
             VALUES (?, ?)`,
            [area.id, now]
        );
        return res.status(200).json({ message : "request is sent. Area will be be deleted by tomorrow" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" });
    }
};