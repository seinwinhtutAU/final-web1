import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link"; // ✅ Next.js Link

export default function BoxBasic() {
  return (
    <main>
      <Box
        component="section"
        className="border border-gray-800 m-5 text-center"
      >
        <h1 className="text-3xl text-violet-950">Stock Management v1.0</h1>
        <ul className="space-y-2">
          <li>
            <Link href="/product" className="text-blue-600 hover:underline">
              Products
            </Link>
          </li>
          <li>
            <Link href="/category" className="text-blue-600 hover:underline">
              Category
            </Link>
          </li>
          <li>
            <Link href="/customer" className="text-blue-600 hover:underline">
              Customer
            </Link>
          </li>
        </ul>
      </Box>
    </main>
  );
}
