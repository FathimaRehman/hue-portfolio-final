
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();

        return NextResponse.json(
            {
                success: true,
                message: "MongoDB connected successfully!",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DATABASE ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to MongoDB.",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
