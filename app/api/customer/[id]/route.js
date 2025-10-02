import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

// Get one customer by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update a customer by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const customer = await Customer.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a customer by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
