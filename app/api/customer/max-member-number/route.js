import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";
export async function GET() {
  await dbConnect();

  // Find highest memberNumber
  const highest = await Customer.findOne().sort({ memberNumber: -1 }).lean();
  const nextMemberNumber = highest ? highest.memberNumber + 1 : 1;

  return new Response(JSON.stringify({ nextMemberNumber }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
