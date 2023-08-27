import { Request, Response } from 'express';
import { pool } from '../database/db';

async function createRoom(id: string) {
    const newRoom = await pool.query(
        'INSERT INTO rooms (id, date_created) values ($1, to_timestamp($2 / 1000.0)) RETURNING *',
        [id, Date.now()]
    )
    console.log(newRoom.rows[0]);
}

export default { createRoom };