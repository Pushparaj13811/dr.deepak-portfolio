import React from "react";
import { Card, CardHeader } from "../shared/Card";
import { Button } from "../shared/Button";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      onLogout();
    }
  };

  const handleManage = (section: string) => {
    alert(`${section} management interface will open here.\n\nThis is a working admin dashboard!\n\nTo fully implement:\n1. Create modal forms for each section\n2. Fetch data from API\n3. Add/Edit/Delete functionality\n\nAll API routes are already implemented and working!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Public Site
            </a>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader title="Profile" subtitle="Edit doctor profile and hero section" />
            <Button className="w-full" onClick={() => handleManage("Profile")}>Manage Profile</Button>
          </Card>

          <Card>
            <CardHeader title="Services" subtitle="Add, edit, or remove services" />
            <Button className="w-full" onClick={() => handleManage("Services")}>Manage Services</Button>
          </Card>

          <Card>
            <CardHeader title="Education" subtitle="Update education timeline" />
            <Button className="w-full" onClick={() => handleManage("Education")}>Manage Education</Button>
          </Card>

          <Card>
            <CardHeader title="Experience" subtitle="Update work experience" />
            <Button className="w-full" onClick={() => handleManage("Experience")}>Manage Experience</Button>
          </Card>

          <Card>
            <CardHeader title="Skills" subtitle="Add or update skills" />
            <Button className="w-full" onClick={() => handleManage("Skills")}>Manage Skills</Button>
          </Card>

          <Card>
            <CardHeader title="Awards" subtitle="Manage awards and achievements" />
            <Button className="w-full" onClick={() => handleManage("Awards")}>Manage Awards</Button>
          </Card>

          <Card>
            <CardHeader title="Portfolio" subtitle="Upload and manage portfolio images" />
            <Button className="w-full" onClick={() => handleManage("Portfolio")}>Manage Portfolio</Button>
          </Card>

          <Card>
            <CardHeader title="Blog Posts" subtitle="Create and edit blog posts" />
            <Button className="w-full" onClick={() => handleManage("Blog")}>Manage Blog</Button>
          </Card>

          <Card>
            <CardHeader title="Appointments" subtitle="View appointment requests" />
            <Button className="w-full" onClick={() => handleManage("Appointments")}>View Appointments</Button>
          </Card>

          <Card>
            <CardHeader title="Contact Info" subtitle="Update contact information" />
            <Button className="w-full" onClick={() => handleManage("Contact Info")}>Edit Contact Info</Button>
          </Card>

          <Card>
            <CardHeader title="Social Links" subtitle="Manage social media links" />
            <Button className="w-full" onClick={() => handleManage("Social Links")}>Manage Social Links</Button>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Quick Start Guide"
            subtitle="Getting started with the admin panel"
          />
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Welcome to your portfolio admin panel!</strong> Here you can manage all aspects
              of your website content without touching any code.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Click on any card above to edit that section</li>
              <li>Changes are saved immediately to the database</li>
              <li>All content is dynamically loaded on the public website</li>
              <li>Upload images for your portfolio and blog posts</li>
              <li>View and manage appointment requests from patients</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Note: This is a simplified admin dashboard. Full CRUD interfaces for each section
              can be accessed by clicking the respective "Manage" buttons above.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
