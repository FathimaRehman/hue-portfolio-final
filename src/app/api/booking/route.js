
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend only when the API key exists
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(request) {
    try {
        const from = process.env.FROM_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!resend || !from || !adminEmail) {
            console.error("Email environment variables are missing.");

            return NextResponse.json(
                {
                    success: false,
                    message: "Email service is not configured.",
                },
                { status: 500 }
            );
        }

        const { fullName, email, dateTime, agenda } =
            await request.json();

        // Validate required fields
        if (
            !fullName?.trim() ||
            !email?.trim() ||
            !dateTime ||
            !agenda?.trim()
        ) {
            return NextResponse.json(
                { message: "Please complete all required fields." },
                { status: 400 }
            );
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return NextResponse.json(
                { message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        // Validate future date
        const requestedDate = new Date(dateTime);

        if (
            Number.isNaN(requestedDate.getTime()) ||
            requestedDate.getTime() <= Date.now()
        ) {
            return NextResponse.json(
                { message: "Please select a future date and time." },
                { status: 400 }
            );
        }

        const formattedDate = requestedDate.toLocaleString("en-IN", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
        });

        // Send email to admin
        const adminResult = await resend.emails.send({
            from,
            to: adminEmail,
            replyTo: email.trim(),
            subject: `New Meeting Request from ${fullName}`,
            text: `
New meeting request

Name: ${fullName}
Email: ${email}
Requested date and time: ${formattedDate}

Reason / Agenda:
${agenda}
      `,
        });

        if (adminResult.error) {
            throw new Error(adminResult.error.message);
        }

        // Send confirmation email to visitor
        const visitorResult = await resend.emails.send({
            from,
            to: email.trim(),
            subject: "Thank you for your meeting request",
            text: `
Hello ${fullName},

Thank you for requesting a meeting.

Your requested date and time:
${formattedDate}

We have received your agenda and will contact you soon.
The meeting invitation or meeting link will be shared shortly.

Best regards,
Fathima Rehman
      `,
        });

        if (visitorResult.error) {
            throw new Error(visitorResult.error.message);
        }

        return NextResponse.json({
            success: true,
            message: "Your meeting request has been submitted successfully!",
        });

    } catch (error) {
        console.error("Booking error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to submit your request. Please try again.",
            },
            { status: 500 }
        );
    }
}
