import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
const query=request.nextUrl.searchParams.get("query")
// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:ZHkbmL7QBtsMbeFb@cluster0.hrp3l.mongodb.net/";
const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');


    

    
    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query,  $options: 'i' } },
            ]
          }
        }
      ]).toArray()
    return NextResponse.json({success:true,products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


