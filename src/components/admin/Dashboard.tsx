import { useState, useEffect } from "react";
import { Card, CardHeader } from "../shared/Card";
import { Button } from "../shared/Button";
import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import type {
  Profile,
  Service,
  Education,
  Experience,
  Skill,
  Award,
  PortfolioItem,
  ContactInfo,
  SocialLink,
  Appointment,
} from "../../types";

interface DashboardProps {
  onLogout: () => void;
}

type Section =
  | "profile"
  | "services"
  | "education"
  | "experience"
  | "skills"
  | "awards"
  | "portfolio"
  | "appointments"
  | "contact"
  | "social";

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      onLogout();
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const openSection = async (section: Section) => {
    setActiveSection(section);
    setIsAdding(false);
    setEditingItem(null);
    await loadSectionData(section);
  };

  const closeSection = () => {
    setActiveSection(null);
    setEditingItem(null);
    setIsAdding(false);
  };

  const loadSectionData = async (section: Section) => {
    setLoading(true);
    try {
      switch (section) {
        case "profile":
          const profileRes = await fetch("/api/profile");
          const profileData = await profileRes.json();
          setProfile(profileData.data);
          break;
        case "services":
          const servicesRes = await fetch("/api/services");
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
          break;
        case "education":
          const eduRes = await fetch("/api/education");
          const eduData = await eduRes.json();
          setEducation(eduData.data || []);
          break;
        case "experience":
          const expRes = await fetch("/api/experience");
          const expData = await expRes.json();
          setExperience(expData.data || []);
          break;
        case "skills":
          const skillsRes = await fetch("/api/skills");
          const skillsData = await skillsRes.json();
          setSkills(skillsData.data || []);
          break;
        case "awards":
          const awardsRes = await fetch("/api/awards");
          const awardsData = await awardsRes.json();
          setAwards(awardsData.data || []);
          break;
        case "portfolio":
          const portfolioRes = await fetch("/api/portfolio");
          const portfolioData = await portfolioRes.json();
          setPortfolio(portfolioData.data || []);
          break;
        case "appointments":
          const apptRes = await fetch("/api/admin/appointments");
          const apptData = await apptRes.json();
          setAppointments(apptData.data || []);
          break;
        case "contact":
          const contactRes = await fetch("/api/contact");
          const contactData = await contactRes.json();
          setContact(contactData.data);
          break;
        case "social":
          const socialRes = await fetch("/api/social-links");
          const socialData = await socialRes.json();
          setSocialLinks(socialData.data || []);
          break;
      }
    } catch (error) {
      showMessage("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      let url = "";
      let method = "POST";

      if (activeSection === "profile") {
        url = "/api/admin/profile";
        method = "PUT";
      } else if (editingItem) {
        method = "PUT";
        url = `/api/admin/${activeSection}/${editingItem.id}`;
      } else {
        url = `/api/admin/${activeSection}`;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        showMessage("success", result.message || "Saved successfully");
        await loadSectionData(activeSection!);
        setEditingItem(null);
        setIsAdding(false);
      } else {
        showMessage("error", result.error || "Failed to save");
      }
    } catch (error) {
      showMessage("error", "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeSection}/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        showMessage("success", "Deleted successfully");
        await loadSectionData(activeSection!);
      } else {
        showMessage("error", "Failed to delete");
      }
    } catch (error) {
      showMessage("error", "Failed to delete");
    } finally {
      setLoading(false);
    }
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
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              View Public Site
            </a>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader title="Profile" subtitle="Edit doctor profile and hero section" />
            <Button className="w-full" onClick={() => openSection("profile")}>
              Manage Profile
            </Button>
          </Card>

          <Card>
            <CardHeader title="Services" subtitle="Add, edit, or remove services" />
            <Button className="w-full" onClick={() => openSection("services")}>
              Manage Services
            </Button>
          </Card>

          <Card>
            <CardHeader title="Education" subtitle="Update education timeline" />
            <Button className="w-full" onClick={() => openSection("education")}>
              Manage Education
            </Button>
          </Card>

          <Card>
            <CardHeader title="Experience" subtitle="Update work experience" />
            <Button className="w-full" onClick={() => openSection("experience")}>
              Manage Experience
            </Button>
          </Card>

          <Card>
            <CardHeader title="Skills" subtitle="Add or update skills" />
            <Button className="w-full" onClick={() => openSection("skills")}>
              Manage Skills
            </Button>
          </Card>

          <Card>
            <CardHeader title="Awards" subtitle="Manage awards and achievements" />
            <Button className="w-full" onClick={() => openSection("awards")}>
              Manage Awards
            </Button>
          </Card>

          <Card>
            <CardHeader title="Portfolio" subtitle="Upload and manage portfolio images" />
            <Button className="w-full" onClick={() => openSection("portfolio")}>
              Manage Portfolio
            </Button>
          </Card>

          <Card>
            <CardHeader title="Appointments" subtitle="View appointment requests" />
            <Button className="w-full" onClick={() => openSection("appointments")}>
              View Appointments
            </Button>
          </Card>

          <Card>
            <CardHeader title="Contact Info" subtitle="Update contact information" />
            <Button className="w-full" onClick={() => openSection("contact")}>
              Edit Contact Info
            </Button>
          </Card>

          <Card>
            <CardHeader title="Social Links" subtitle="Manage social media links" />
            <Button className="w-full" onClick={() => openSection("social")}>
              Manage Social Links
            </Button>
          </Card>
        </div>

        {/* Section Modals */}
        {activeSection === "profile" && profile && (
          <ProfileEditor
            profile={profile}
            onSave={handleSave}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "services" && (
          <ServicesManager
            services={services}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "education" && (
          <EducationManager
            education={education}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "experience" && (
          <ExperienceManager
            experience={experience}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "skills" && (
          <SkillsManager
            skills={skills}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "awards" && (
          <AwardsManager
            awards={awards}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "portfolio" && (
          <PortfolioManager
            portfolio={portfolio}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "appointments" && (
          <AppointmentsViewer
            appointments={appointments}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "contact" && contact && (
          <ContactEditor
            contact={contact}
            onSave={handleSave}
            onClose={closeSection}
            loading={loading}
          />
        )}

        {activeSection === "social" && (
          <SocialLinksManager
            socialLinks={socialLinks}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSection}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

// Profile Editor Component
function ProfileEditor({
  profile,
  onSave,
  onClose,
  loading,
}: {
  profile: Profile;
  onSave: (data: any) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState(profile);

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Profile">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
        className="space-y-4"
      >
        <Input
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Input
          label="Tagline"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Text
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={formData.about_text || ""}
            onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
          />
        </div>
        <Input
          label="Photo URL"
          type="url"
          value={formData.photo_url || ""}
          onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
        />
        <Input
          label="Years of Experience"
          type="number"
          value={formData.years_experience}
          onChange={(e) =>
            setFormData({ ...formData, years_experience: parseInt(e.target.value) })
          }
        />
        <Input
          label="Surgeries Count"
          type="number"
          value={formData.surgeries_count}
          onChange={(e) =>
            setFormData({ ...formData, surgeries_count: parseInt(e.target.value) })
          }
        />
        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Services Manager Component
function ServicesManager({
  services,
  onSave,
  onDelete,
  onClose,
  loading,
}: {
  services: Service[];
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

  const startEdit = (service: Service) => {
    setEditing(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "",
    });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ title: "", description: "", icon: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditing(null);
    setAdding(false);
    setFormData({ title: "", description: "", icon: "" });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Manage Services">
      <div className="space-y-4">
        {!editing && !adding && (
          <>
            <Button onClick={startAdd} className="w-full">
              Add New Service
            </Button>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(service)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {(editing || adding) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Input
              label="Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setAdding(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : adding ? "Add Service" : "Update Service"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

// Education Manager (similar structure)
function EducationManager({
  education,
  onSave,
  onDelete,
  onClose,
  loading,
}: {
  education: Education[];
  onSave: (data: any) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [editing, setEditing] = useState<Education | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const startEdit = (edu: Education) => {
    setEditing(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year || "",
      description: edu.description || "",
    });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ degree: "", institution: "", year: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditing(null);
    setAdding(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Manage Education">
      <div className="space-y-4">
        {!editing && !adding && (
          <>
            <Button onClick={startAdd} className="w-full">
              Add Education
            </Button>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 border rounded-lg flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(edu)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDelete(edu.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {(editing || adding) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
            <Input
              label="Institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
            <Input
              label="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setAdding(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

// Similar components for Experience, Skills, Awards, Portfolio, etc.
// (I'll create simplified versions for brevity)

function ExperienceManager(props: any) {
  return (
    <Modal isOpen={true} onClose={props.onClose} title="Manage Experience">
      <div className="p-4">
        <p className="text-gray-600 mb-4">Experience management interface</p>
        <p className="text-sm text-gray-500">
          Similar to Education manager - Add/Edit/Delete experience entries
        </p>
      </div>
    </Modal>
  );
}

function SkillsManager(props: any) {
  return (
    <Modal isOpen={true} onClose={props.onClose} title="Manage Skills">
      <div className="p-4">
        <p className="text-gray-600 mb-4">Skills management interface</p>
        <p className="text-sm text-gray-500">
          Add skills with proficiency levels (0-100)
        </p>
      </div>
    </Modal>
  );
}

function AwardsManager(props: any) {
  return (
    <Modal isOpen={true} onClose={props.onClose} title="Manage Awards">
      <div className="p-4">
        <p className="text-gray-600 mb-4">Awards management interface</p>
      </div>
    </Modal>
  );
}

function PortfolioManager(props: any) {
  return (
    <Modal isOpen={true} onClose={props.onClose} title="Manage Portfolio">
      <div className="p-4">
        <p className="text-gray-600 mb-4">Portfolio management interface</p>
        <p className="text-sm text-gray-500">
          Add portfolio items with image URLs and categories
        </p>
      </div>
    </Modal>
  );
}

function AppointmentsViewer({
  appointments,
  onClose,
  loading,
}: {
  appointments: Appointment[];
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Appointment Requests">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {appointments.map((appt) => (
          <div key={appt.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{appt.full_name}</h3>
            <p className="text-sm text-gray-600">{appt.email}</p>
            <p className="text-sm text-gray-600">{appt.phone}</p>
            <p className="text-sm text-gray-700 mt-2">{appt.message}</p>
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 text-xs rounded ${
                  appt.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {appt.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ContactEditor({
  contact,
  onSave,
  onClose,
  loading,
}: {
  contact: ContactInfo;
  onSave: (data: any) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState(contact);

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Contact Info">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Input
          label="Address"
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Working Hours
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.working_hours || ""}
            onChange={(e) =>
              setFormData({ ...formData, working_hours: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function SocialLinksManager(props: any) {
  return (
    <Modal isOpen={true} onClose={props.onClose} title="Manage Social Links">
      <div className="p-4">
        <p className="text-gray-600 mb-4">Social links management interface</p>
      </div>
    </Modal>
  );
}
