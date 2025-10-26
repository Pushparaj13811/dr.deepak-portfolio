import { useState } from "react";
import type { Education, Experience, Skill, Award, Profile } from "../../types";

interface ResumeProps {
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  awards: Award[];
  profile: Profile | null;
}

type Tab = "education" | "experience" | "skills" | "awards";

export function Resume({ education, experience, skills, awards }: ResumeProps) {
  const [activeTab, setActiveTab] = useState<Tab>("education");

  const tabs: { id: Tab; label: string }[] = [
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "awards", label: "Awards" },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Resume</h2>
          <div className="w-16 h-1 bg-[#0ea5e9]"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#0ea5e9] text-white"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#0ea5e9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - 2 Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {activeTab === "education" && (
            <>
              {education.map((item) => (
                <div key={item.id} className="border-l-4 border-[#0ea5e9] pl-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{item.degree}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.institution}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>}
                    </div>
                    {item.year && (
                      <span className="text-sm text-gray-500 shrink-0">{item.year}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "experience" && (
            <>
              {experience.map((item) => (
                <div key={item.id} className="border-l-4 border-[#0ea5e9] pl-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{item.position}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.organization}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>}
                    </div>
                    <span className="text-sm text-gray-500 shrink-0">
                      {item.start_date} - {item.end_date || "Present"}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "skills" && (
            <>
              {skills.map((skill) => (
                <div key={skill.id} className="border-l-4 border-[#0ea5e9] pl-6 py-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0ea5e9] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "awards" && (
            <>
              {awards.map((award) => (
                <div key={award.id} className="border-l-4 border-[#0ea5e9] pl-6 py-4">
                  <div className="flex items-start gap-4">
                    {award.image_base64 && (
                      <div className="shrink-0">
                        <img
                          src={award.image_base64}
                          alt={award.title}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{award.title}</h4>
                          {award.issuer && <p className="text-sm text-gray-500 mt-1">{award.issuer}</p>}
                          {award.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{award.description}</p>}
                        </div>
                        {award.year && (
                          <span className="text-sm text-gray-500 shrink-0">{award.year}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
