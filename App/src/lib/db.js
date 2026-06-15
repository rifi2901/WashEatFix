import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const DB_FILE = path.join(process.cwd(), 'db.json');

// Menu Cafe Statis
export const CAFE_MENU = [
  { id: 'm1', name: 'Es Kopi Susu Aren', category: 'Coffee', price: 18000, description: 'Espresso dengan susu segar dan gula aren murni.', image: '/images/kopi_aren.jpg' },
  { id: 'm2', name: 'Caramel Macchiato', category: 'Coffee', price: 25000, description: 'Kopi susu dengan sirup karamel manis gurih.', image: '/images/caramel.jpg' },
  { id: 'm3', name: 'Ice Lemon Tea', category: 'Non-Coffee', price: 12000, description: 'Teh lemon segar dengan es batu.', image: '/images/lemon_tea.jpg' },
  { id: 'm4', name: 'Matcha Latte', category: 'Non-Coffee', price: 22000, description: 'Teh matcha Jepang berkualitas dengan susu.', image: '/images/matcha.jpg' },
  { id: 'm5', name: 'Roti Bakar Cokelat Keju', category: 'Snack', price: 15000, description: 'Roti panggang mentega dengan topping cokelat mesis dan keju parut.', image: '/images/roti_bakar.jpg' },
  { id: 'm6', name: 'French Fries', category: 'Snack', price: 14000, description: 'Kentang goreng renyah dengan taburan garam gurih.', image: '/images/fries.jpg' },
];

// MongoDB connection caching (Sangat krusial untuk Next.js serverless functions)
let cachedClient = global.mongoClient || null;
let cachedDb = global.mongoDb || null;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null; // Jika tidak ada URI, return null (gunakan fallback lokal)

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const dbName = process.env.MONGODB_DB || 'wash_it_fix';
  const db = client.db(dbName);

  // Simpan di global context pada mode development agar tidak spawn banyak koneksi saat HMR
  if (process.env.NODE_ENV !== 'production') {
    global.mongoClient = client;
    global.mongoDb = db;
  }

  cachedClient = client;
  cachedDb = db;

  // Lakukan Seeding data awal otomatis jika MongoDB masih kosong
  try {
    const bookingsCount = await db.collection('bookings').countDocuments();
    if (bookingsCount === 0) {
      const initialBookings = [
        {
          id: 'BKG-001',
          customerName: 'Budi Santoso',
          phone: '081234567890',
          plateNumber: 'B 1234 ABC',
          vehicleType: 'Car (Toyota Avanza)',
          serviceType: 'Carwash (Premium)',
          scheduleDate: '2026-05-28',
          scheduleTime: '09:00',
          status: 'Finished',
          queueNumber: 1,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'BKG-002',
          customerName: 'Rian Hidayat',
          phone: '082345678901',
          plateNumber: 'D 9999 XYZ',
          vehicleType: 'Motorcycle (Honda Vario)',
          serviceType: 'Service Bengkel (Ganti Oli + Filter)',
          scheduleDate: '2026-05-28',
          scheduleTime: '10:00',
          status: 'Waiting',
          queueNumber: 2,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'BKG-003',
          customerName: 'Siti Aminah',
          phone: '083456789012',
          plateNumber: 'B 5678 DEF',
          vehicleType: 'Car (Honda Jazz)',
          serviceType: 'Bundling (Service Berkala + Wash)',
          scheduleDate: '2026-05-28',
          scheduleTime: '11:00',
          status: 'In Progress',
          queueNumber: 3,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'BKG-004',
          customerName: 'Ahmad Fauzi',
          phone: '084567890123',
          plateNumber: 'F 4321 GH',
          vehicleType: 'Motorcycle (Yamaha NMax)',
          serviceType: 'Carwash (Regular)',
          scheduleDate: '2026-05-28',
          scheduleTime: '13:00',
          status: 'Queue',
          queueNumber: 4,
          createdAt: new Date().toISOString()
        }
      ];
      await db.collection('bookings').insertMany(initialBookings);
    }

    const ordersCount = await db.collection('orders').countDocuments();
    if (ordersCount === 0) {
      const initialOrders = [
        {
          id: 'ORD-001',
          bookingId: 'BKG-002',
          customerName: 'Rian Hidayat',
          plateNumber: 'D 9999 XYZ',
          items: [
            { menuId: 'm1', name: 'Es Kopi Susu Aren', price: 18000, quantity: 1 },
            { menuId: 'm5', name: 'Roti Bakar Cokelat Keju', price: 15000, quantity: 1 }
          ],
          totalPrice: 33000,
          status: 'Delivered',
          createdAt: new Date(Date.now() - 30 * 60000).toISOString()
        }
      ];
      await db.collection('orders').insertMany(initialOrders);
    }
  } catch (seedErr) {
    console.error('Gagal melakukan seeding MongoDB:', seedErr);
  }

  return { client, db };
}

// Helper untuk membaca file DB lokal (Fallback)
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        bookings: [
          {
            id: 'BKG-001',
            customerName: 'Budi Santoso',
            phone: '081234567890',
            plateNumber: 'B 1234 ABC',
            vehicleType: 'Car (Toyota Avanza)',
            serviceType: 'Carwash (Premium)',
            scheduleDate: '2026-05-28',
            scheduleTime: '09:00',
            status: 'Finished',
            queueNumber: 1,
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'BKG-002',
            customerName: 'Rian Hidayat',
            phone: '082345678901',
            plateNumber: 'D 9999 XYZ',
            vehicleType: 'Motorcycle (Honda Vario)',
            serviceType: 'Service Bengkel (Ganti Oli + Filter)',
            scheduleDate: '2026-05-28',
            scheduleTime: '10:00',
            status: 'Waiting',
            queueNumber: 2,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'BKG-003',
            customerName: 'Siti Aminah',
            phone: '083456789012',
            plateNumber: 'B 5678 DEF',
            vehicleType: 'Car (Honda Jazz)',
            serviceType: 'Bundling (Service Berkala + Wash)',
            scheduleDate: '2026-05-28',
            scheduleTime: '11:00',
            status: 'In Progress',
            queueNumber: 3,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'BKG-004',
            customerName: 'Ahmad Fauzi',
            phone: '084567890123',
            plateNumber: 'F 4321 GH',
            vehicleType: 'Motorcycle (Yamaha NMax)',
            serviceType: 'Carwash (Regular)',
            scheduleDate: '2026-05-28',
            scheduleTime: '13:00',
            status: 'Queue',
            queueNumber: 4,
            createdAt: new Date().toISOString()
          }
        ],
        orders: [
          {
            id: 'ORD-001',
            bookingId: 'BKG-002',
            customerName: 'Rian Hidayat',
            plateNumber: 'D 9999 XYZ',
            items: [
              { menuId: 'm1', name: 'Es Kopi Susu Aren', price: 18000, quantity: 1 },
              { menuId: 'm5', name: 'Roti Bakar Cokelat Keju', price: 15000, quantity: 1 }
            ],
            totalPrice: 33000,
            status: 'Delivered',
            createdAt: new Date(Date.now() - 30 * 60000).toISOString()
          }
        ]
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Gagal membaca database lokal:', error);
    return { bookings: [], orders: [] };
  }
}

// Helper untuk menulis file DB lokal (Fallback)
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Gagal menulis database lokal:', error);
  }
}

// ==========================================
// UTILITY LAYANAN DATABASE (ASYNCHRONOUS)
// ==========================================

export async function getBookings() {
  const mongo = await connectToDatabase();
  if (mongo) {
    const list = await mongo.db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
    // Hilangkan property _id bertipe ObjectId agar aman di-serialize Next.js
    return list.map(({ _id, ...rest }) => rest);
  }

  const db = readDb();
  return db.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getBookingById(id) {
  const mongo = await connectToDatabase();
  if (mongo) {
    const found = await mongo.db.collection('bookings').findOne({ id: id });
    if (!found) return null;
    const { _id, ...rest } = found;
    return rest;
  }

  const db = readDb();
  return db.bookings.find(b => b.id === id) || null;
}

export async function getBookingByPlate(plateNumber) {
  if (!plateNumber) return null;
  const cleanPlate = plateNumber.replace(/\s+/g, '').toUpperCase();

  const mongo = await connectToDatabase();
  if (mongo) {
    // Regex agar pencarian plat fleksibel dari spasi
    const regexPattern = "^" + cleanPlate.split('').join('\\s*') + "$";
    const found = await mongo.db.collection('bookings').findOne({ plateNumber: { $regex: regexPattern, $options: 'i' } });
    if (!found) return null;
    const { _id, ...rest } = found;
    return rest;
  }

  const db = readDb();
  return db.bookings.find(b => b.plateNumber.replace(/\s+/g, '').toUpperCase() === cleanPlate) || null;
}

export async function addBooking(bookingData) {
  const mongo = await connectToDatabase();
  if (mongo) {
    const count = await mongo.db.collection('bookings').countDocuments();
    const nextIdNum = count + 1;
    const id = `BKG-${String(nextIdNum).padStart(3, '0')}`;

    const today = new Date().toISOString().split('T')[0];
    const todayCount = await mongo.db.collection('bookings').countDocuments({ scheduleDate: today });
    const queueNumber = todayCount + 1;

    const newBooking = {
      id,
      customerName: bookingData.customerName,
      phone: bookingData.phone,
      plateNumber: bookingData.plateNumber.toUpperCase(),
      vehicleType: bookingData.vehicleType,
      serviceType: bookingData.serviceType,
      scheduleDate: bookingData.scheduleDate,
      scheduleTime: bookingData.scheduleTime,
      status: 'Queue',
      queueNumber,
      createdAt: new Date().toISOString()
    };

    await mongo.db.collection('bookings').insertOne(newBooking);
    const { _id, ...rest } = newBooking;
    return rest;
  }

  const db = readDb();
  const nextIdNum = db.bookings.length + 1;
  const id = `BKG-${String(nextIdNum).padStart(3, '0')}`;
  
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = db.bookings.filter(b => b.scheduleDate === today);
  const queueNumber = todayBookings.length + 1;

  const newBooking = {
    id,
    customerName: bookingData.customerName,
    phone: bookingData.phone,
    plateNumber: bookingData.plateNumber.toUpperCase(),
    vehicleType: bookingData.vehicleType,
    serviceType: bookingData.serviceType,
    scheduleDate: bookingData.scheduleDate,
    scheduleTime: bookingData.scheduleTime,
    status: 'Queue',
    queueNumber,
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  writeDb(db);
  return newBooking;
}

export async function updateBookingStatus(id, status) {
  const mongo = await connectToDatabase();
  if (mongo) {
    await mongo.db.collection('bookings').updateOne({ id: id }, { $set: { status: status } });
    return await getBookingById(id);
  }

  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    db.bookings[index].status = status;
    writeDb(db);
    return db.bookings[index];
  }
  return null;
}

export async function getOrders() {
  const mongo = await connectToDatabase();
  if (mongo) {
    const list = await mongo.db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    return list.map(({ _id, ...rest }) => rest);
  }

  const db = readDb();
  return db.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addOrder(orderData) {
  const mongo = await connectToDatabase();
  if (mongo) {
    const count = await mongo.db.collection('orders').countDocuments();
    const nextIdNum = count + 1;
    const id = `ORD-${String(nextIdNum).padStart(3, '0')}`;

    const newOrder = {
      id,
      bookingId: orderData.bookingId,
      customerName: orderData.customerName,
      plateNumber: orderData.plateNumber,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    await mongo.db.collection('orders').insertOne(newOrder);
    const { _id, ...rest } = newOrder;
    return rest;
  }

  const db = readDb();
  const nextIdNum = db.orders.length + 1;
  const id = `ORD-${String(nextIdNum).padStart(3, '0')}`;

  const newOrder = {
    id,
    bookingId: orderData.bookingId,
    customerName: orderData.customerName,
    plateNumber: orderData.plateNumber,
    items: orderData.items,
    totalPrice: orderData.totalPrice,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDb(db);
  return newOrder;
}

export async function updateOrderStatus(id, status) {
  const mongo = await connectToDatabase();
  if (mongo) {
    await mongo.db.collection('orders').updateOne({ id: id }, { $set: { status: status } });
    const found = await mongo.db.collection('orders').findOne({ id: id });
    if (!found) return null;
    const { _id, ...rest } = found;
    return rest;
  }

  const db = readDb();
  const index = db.orders.findIndex(o => o.id === id);
  if (index !== -1) {
    db.orders[index].status = status;
    writeDb(db);
    return db.orders[index];
  }
  return null;
}
