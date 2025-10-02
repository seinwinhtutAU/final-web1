"use client";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    dateOfBirth: "",
    memberNumber: "",
    interests: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all customers
  async function fetchCustomers() {
    const res = await fetch("/fin-customer/api/customer");
    const data = await res.json();
    setCustomers(data);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Add / Update form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let payload = { ...form };

    if (!form._id) {
      // Auto-generate Member Number for new customer
      const res = await fetch("/fin-customer/api/customer/max-member-number");
      const data = await res.json();
      payload.memberNumber = data.nextMemberNumber;
    }

    if (form._id) {
      // Update existing customer
      await fetch(`/fin-customer/api/customer/${form._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Create new customer
      await fetch("/fin-customer/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    // Reset form and reload
    setForm({
      _id: null,
      name: "",
      dateOfBirth: "",
      memberNumber: "",
      interests: "",
    });
    setEditing(false);
    setSelectedCustomer(null);
    await fetchCustomers();
    setLoading(false);
  }

  // Edit existing customer
  function handleEdit(customer) {
    setForm({
      _id: customer._id,
      name: customer.name,
      dateOfBirth: customer.dateOfBirth?.slice(0, 10),
      memberNumber: customer.memberNumber,
      interests: customer.interests,
    });
    setEditing(true);
    setSelectedCustomer(customer);
  }

  // Delete customer
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    await fetch(`/fin-customer/api/customer/${id}`, { method: "DELETE" });
    if (selectedCustomer?._id === id) setSelectedCustomer(null);
    await fetchCustomers();
  }

  // View customer details
  function handleView(customer) {
    setSelectedCustomer(customer);
    setEditing(false);
    setForm({
      _id: customer._id,
      name: customer.name,
      dateOfBirth: customer.dateOfBirth?.slice(0, 10),
      memberNumber: customer.memberNumber,
      interests: customer.interests,
    });
  }

  // Add new customer
  function handleAddNew() {
    setSelectedCustomer(null);
    setEditing(true);
    setForm({
      _id: null,
      name: "",
      dateOfBirth: "",
      memberNumber: "",
      interests: "",
    });
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Customer Management</h1>

      {/* Add / Edit / View Panel */}
      <div className="mb-8 border p-4 rounded shadow">
        {editing ? (
          <>
            <h2 className="text-xl font-bold mb-2">
              {form._id ? "Edit Customer" : "Add Customer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="border p-2 w-full"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="date"
                className="border p-2 w-full"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
                required
              />
              {/* Member Number is automatic now, no input */}
              <input
                className="border p-2 w-full"
                placeholder="Interests"
                value={form.interests}
                onChange={(e) =>
                  setForm({ ...form, interests: e.target.value })
                }
              />
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  {form._id ? "Update Customer" : "Add Customer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      _id: null,
                      name: "",
                      dateOfBirth: "",
                      memberNumber: "",
                      interests: "",
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : selectedCustomer ? (
          <>
            <h2 className="text-xl font-bold mb-2">Customer Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(selectedCustomer.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Member Number:</strong> {selectedCustomer.memberNumber}
              </p>
              <p>
                <strong>Interests:</strong> {selectedCustomer.interests}
              </p>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(selectedCustomer)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedCustomer._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add New Customer
          </button>
        )}
      </div>

      {/* Customer List */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Member #</th>
            <th className="p-2 border">Interests</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr
              key={c._id}
              className={`text-center hover:bg-gray-100 cursor-pointer ${
                selectedCustomer?._id === c._id ? "bg-gray-200" : ""
              }`}
            >
              <td className="border p-2" onClick={() => handleView(c)}>
                {c.name}
              </td>
              <td className="border p-2">{c.memberNumber}</td>
              <td className="border p-2">{c.interests}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
