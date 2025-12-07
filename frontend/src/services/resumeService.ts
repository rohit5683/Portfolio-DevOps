import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "./api";

export const generateResume = async () => {
  try {
    // Fetch all necessary data
    const [profileRes, experienceRes, educationRes, skillsRes, projectsRes] =
      await Promise.all([
        api.get("/profile"),
        api.get("/experience"),
        api.get("/education"),
        api.get("/skills"),
        api.get("/projects"),
      ]);

    const profile = profileRes.data;
    const experience = experienceRes.data;
    const education = educationRes.data;
    const skills = skillsRes.data;
    const projects = projectsRes.data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = 20;

    // Helper for checking page breaks
    const checkPageBreak = (heightNeeded: number) => {
      if (yPos + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(
      (profile.name || "Rohit Vishwakarma").toUpperCase(),
      pageWidth / 2,
      yPos,
      {
        align: "center",
      }
    );
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(
      (profile.role || "DevOps Engineer").toUpperCase(),
      pageWidth / 2,
      yPos,
      {
        align: "center",
      }
    );
    yPos += 6;

    doc.setFontSize(9);
    doc.setTextColor(0);
    const contactInfo = [
      profile.contact?.email,
      profile.contact?.phone,
      profile.location,
      profile.contact?.linkedin,
      profile.contact?.github,
    ]
      .filter(Boolean)
      .join("  •  ");

    doc.text(contactInfo, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Draw a line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // --- Summary ---
    if (profile.about) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102); // Dark Blue
      doc.text("PROFESSIONAL SUMMARY", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0);
      const splitAbout = doc.splitTextToSize(
        profile.about,
        pageWidth - margin * 2
      );
      doc.text(splitAbout, margin, yPos);
      yPos += splitAbout.length * 5 + 8;
    }

    // --- Technical Skills ---
    if (skills.length > 0) {
      checkPageBreak(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text("TECHNICAL SKILLS", margin, yPos);
      yPos += 6;

      const skillCategories = [
        "cloud",
        "devops",
        "programming",
        "database",
        "tools",
      ];

      const skillData = skillCategories
        .map((cat) => {
          const catSkills = skills
            .filter((s: any) => s.category === cat)
            .map((s: any) => s.name)
            .join(", ");
          return catSkills
            ? [cat.charAt(0).toUpperCase() + cat.slice(1), catSkills]
            : null;
        })
        .filter((item): item is string[] => item !== null);

      autoTable(doc, {
        startY: yPos,
        head: [],
        body: skillData,
        theme: "plain",
        styles: {
          fontSize: 10,
          cellPadding: 1.5,
          font: "helvetica",
          textColor: 0,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35, textColor: [50, 50, 50] },
          1: { cellWidth: "auto" },
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // --- Professional Experience ---
    if (experience.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text("PROFESSIONAL EXPERIENCE", margin, yPos);
      yPos += 8;

      experience.forEach((exp: any) => {
        checkPageBreak(40);

        // Title and Date
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(exp.title, margin, yPos);

        doc.setFont("helvetica", "normal");
        const dateRange = `${new Date(exp.startDate).toLocaleDateString(
          "en-US",
          { month: "short", year: "numeric" }
        )} – ${
          exp.endDate
            ? new Date(exp.endDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Present"
        }`;
        doc.text(dateRange, pageWidth - margin, yPos, { align: "right" });
        yPos += 5;

        // Company and Location
        doc.setFont("helvetica", "italic");
        doc.text(`${exp.company} | ${exp.location}`, margin, yPos);
        yPos += 6;

        // Description
        if (exp.description) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const splitDesc = doc.splitTextToSize(
            exp.description,
            pageWidth - margin * 2
          );
          doc.text(splitDesc, margin, yPos);
          yPos += splitDesc.length * 5 + 2;
        }

        // Achievements
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((ach: string) => {
            checkPageBreak(10);
            const bullet = `•  ${ach}`;
            const splitBullet = doc.splitTextToSize(
              bullet,
              pageWidth - margin * 2 - 5
            );
            doc.text(splitBullet, margin + 2, yPos);
            yPos += splitBullet.length * 5;
          });
        }
        yPos += 6;
      });
    }

    // --- Key Projects ---
    if (projects.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text("KEY PROJECTS", margin, yPos);
      yPos += 8;

      projects
        .filter((p: any) => p.featured)
        .forEach((proj: any) => {
          checkPageBreak(30);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0);
          doc.text(proj.title, margin, yPos);
          yPos += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const splitDesc = doc.splitTextToSize(
            proj.description,
            pageWidth - margin * 2
          );
          doc.text(splitDesc, margin, yPos);
          yPos += splitDesc.length * 5;

          if (proj.techStack && proj.techStack.length > 0) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(80);
            doc.text(`Tech Stack: ${proj.techStack.join(", ")}`, margin, yPos);
            doc.setTextColor(0);
            yPos += 8;
          } else {
            yPos += 4;
          }
        });
    }

    // --- Education ---
    if (education.length > 0) {
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text("EDUCATION", margin, yPos);
      yPos += 8;

      education.forEach((edu: any) => {
        checkPageBreak(20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(edu.schoolCollege, margin, yPos);

        doc.setFont("helvetica", "normal");
        doc.text(
          `${edu.startDate} – ${edu.endDate}`,
          pageWidth - margin,
          yPos,
          { align: "right" }
        );
        yPos += 5;

        doc.setFont("helvetica", "normal");
        doc.text(`${edu.degree} in ${edu.fieldOfStudy}`, margin, yPos);
        yPos += 8;
      });
    }

    // Save PDF
    doc.save("resume.pdf");
    return true;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
};
