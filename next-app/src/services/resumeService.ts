import jsPDF from "jspdf";
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
    const margin = 15; // Set margin to 15mm for a fuller look
    let yPos = 15;

    // Helper for checking page breaks
    const checkPageBreak = (heightNeeded: number) => {
      if (yPos + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    const drawSectionUnderline = (y: number) => {
      doc.setLineWidth(0.5);
      doc.setDrawColor(0);
      doc.line(margin, y, pageWidth - margin, y);
    };

    const drawSectionHeader = (title: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0);
      doc.text(title.toUpperCase(), margin, y);
      drawSectionUnderline(y + 2);
      return y + 8;
    };

    // Helper to strip HTML tags
    const stripHTML = (html: string) => {
      if (!html) return "";
      return html.replace(/<[^>]*>?/gm, "");
    };

    /**
     * Renders a paragraph with:
     * 1. Justification (except for the last line)
     * 2. Variable leading (line height)
     * 3. Optional bullet and hanging indent
     */
    const renderParagraph = (
      text: string,
      y: number,
      x: number,
      width: number,
      options: { 
        isBullet?: boolean; 
        bulletChar?: string; 
        indent?: number; 
        leading?: number;
        justify?: boolean;
      } = {}
    ) => {
      const { 
        isBullet = false, 
        bulletChar = "•", 
        indent = 6, 
        leading = 5, 
        justify = true 
      } = options;

      const cleanText = stripHTML(text).replace(/\s+/g, " ").trim();
      if (!cleanText) return y;

      const textWidth = isBullet ? width - indent : width;
      const textX = isBullet ? x + indent : x;

      if (isBullet) {
        doc.setFont("helvetica", "normal");
        doc.text(bulletChar, x + 2, y);
      }

      const lines: string[] = doc.splitTextToSize(cleanText, textWidth);

      lines.forEach((line, index) => {
        checkPageBreak(leading);
        const isLastLine = index === lines.length - 1;

        if (justify && !isLastLine && lines.length > 1) {
          const words = line.trim().split(/\s+/);
          if (words.length > 1) {
            const totalWordsWidth = words.reduce((acc, word) => acc + doc.getTextWidth(word), 0);
            const totalSpaceWidth = textWidth - totalWordsWidth;
            const wordSpacing = totalSpaceWidth / (words.length - 1);
            
            let currentX = textX;
            words.forEach((word) => {
              doc.text(word, currentX, y);
              currentX += doc.getTextWidth(word) + wordSpacing;
            });
          } else {
            doc.text(line, textX, y);
          }
        } else {
          doc.text(line.trim(), textX, y);
        }
        y += leading;
      });

      return y + 1; // Slight gap after paragraph
    };

    const renderRichText = (text: string, currentY: number, xMargin: number) => {
      if (!text) return currentY;
      const cleanText = stripHTML(text);
      const paragraphs = cleanText.split("\n").filter((l) => l.trim().length > 0);
      let localY = currentY;

      paragraphs.forEach((para) => {
        const isBullet = para.trim().startsWith("- ") || para.trim().startsWith("• ") || para.trim().startsWith("* ");
        const content = isBullet ? para.trim().substring(2) : para.trim();
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50);

        localY = renderParagraph(content, localY, xMargin, pageWidth - margin - xMargin, { 
          isBullet, 
          leading: 5,
          justify: true 
        });
        localY += 1;
      });
      return localY;
    };

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0);
    doc.text(profile.name || "Rohit Vishwakarma", pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text(profile.location || "Location Unknown", pageWidth / 2, yPos, { align: "center" });
    yPos += 6;

    doc.setFontSize(9);
    const contactParts = [
      profile.contact?.phone,
      profile.contact?.email,
      profile.contact?.linkedin?.replace(/^https?:\/\/(www\.)?/, ""),
      profile.contact?.github?.replace(/^https?:\/\/(www\.)?/, ""),
    ].filter(Boolean);

    doc.text(contactParts.join("  |  "), pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    // --- About Me ---
    if (profile.about) {
      yPos = drawSectionHeader("ABOUT ME", yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50);
      yPos = renderParagraph(profile.about, yPos, margin, pageWidth - margin * 2, { leading: 5, justify: true });
      yPos += 8;
    }

    // --- Experience ---
    if (experience && experience.length > 0) {
      yPos = drawSectionHeader("EXPERIENCE", yPos);

      experience.forEach((exp: any) => {
        checkPageBreak(35);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(exp.title, margin, yPos);

        const dateRange = `${new Date(exp.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })} – ${
          exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Present"
        }`;
        doc.text(dateRange, pageWidth - margin, yPos, { align: "right" });
        yPos += 5;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(exp.company, margin, yPos);
        if (exp.location) {
          doc.text(exp.location, pageWidth - margin, yPos, { align: "right" });
        }
        yPos += 6;

        if (exp.description) {
          yPos = renderRichText(exp.description, yPos, margin);
        }

        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((ach: string) => {
            yPos = renderParagraph(ach, yPos, margin, pageWidth - margin * 2, { 
              isBullet: true, 
              leading: 5,
              justify: true 
            });
          });
        }
        yPos += 4;
      });
      yPos += 4;
    }

    // --- Projects ---
    if (projects && projects.length > 0) {
      yPos = drawSectionHeader("PROJECTS", yPos);

      projects.forEach((proj: any) => {
        checkPageBreak(30);

        // Row 1: Title & Date (Both Bold)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(proj.title || "Untitled Project", margin, yPos);

        const projDate = proj.endDate ? new Date(proj.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";
        doc.text(projDate, pageWidth - margin, yPos, { align: "right" });
        yPos += 5;

        // Row 2: Tech Stack (Italic)
        if (proj.techStack && proj.techStack.length > 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(80);
          const techText = proj.techStack.join(", ");
          const splitTech = doc.splitTextToSize(techText, pageWidth - margin * 2);
          doc.text(splitTech, margin, yPos);
          yPos += (splitTech.length * 5);
        }
        yPos += 1;

        if (proj.description) {
          yPos = renderRichText(proj.description, yPos, margin);
        }

        if (proj.link) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 255);
          doc.text("Project Link", margin + 6, yPos);
          yPos += 6;
        }
        yPos += 2;
      });
      yPos += 6;
    }

    // --- Technical Skills ---
    if (skills && skills.length > 0) {
      yPos = drawSectionHeader("TECHNICAL SKILLS", yPos);
      
      const skillsByLevel: any = {};
      skills.forEach((skill: any) => {
        const cat = skill.category || skill.level || "Other";
        if (!skillsByLevel[cat]) skillsByLevel[cat] = [];
        skillsByLevel[cat].push(skill.name);
      });

      Object.entries(skillsByLevel).forEach(([cat, names]) => {
        checkPageBreak(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        const capitalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
        const prefix = `${capitalizedCat}: `;
        doc.text(prefix, margin, yPos);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50);
        const skillList = (names as string[]).join(", ");
        const prefixWidth = doc.getTextWidth(prefix);
        const splitSkills = doc.splitTextToSize(skillList, pageWidth - margin * 2 - prefixWidth - 1);
        doc.text(splitSkills, margin + prefixWidth + 1, yPos);
        yPos += (splitSkills.length * 5) + 1;
      });
      yPos += 8;
    }

    // --- Education & Certifications ---
    if (education && education.length > 0) {
      const regularEdu = education.filter((e: any) => e.level !== "certification");
      const certifications = education.filter((e: any) => e.level === "certification");

      if (regularEdu.length > 0) {
        yPos = drawSectionHeader("EDUCATION", yPos);
        regularEdu.forEach((edu: any) => {
          checkPageBreak(25);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.text(edu.schoolCollege, margin, yPos);
          
          const eduDate = `${new Date(edu.startDate).getFullYear()} – ${edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}`;
          doc.text(eduDate, pageWidth - margin, yPos, { align: "right" });
          yPos += 5;

          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(50);
          let degreeText = edu.degree;
          if (edu.grade) {
            degreeText += ` | ${edu.gradeType || "Percentage"}: ${edu.grade}`;
          }
          doc.text(degreeText, margin, yPos);
          if (edu.location) {
            doc.text(edu.location, pageWidth - margin, yPos, { align: "right" });
          }
          yPos += 6;

          if (edu.description) {
            yPos = renderRichText(edu.description, yPos, margin);
          }
          yPos += 4;
        });
      }

      if (certifications.length > 0) {
        yPos = drawSectionHeader("CERTIFICATIONS", yPos);
        certifications.forEach((cert: any) => {
          checkPageBreak(25);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.text(cert.degree, margin, yPos);
          
          if (cert.endDate) {
            const certDate = new Date(cert.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });
            doc.text(certDate, pageWidth - margin, yPos, { align: "right" });
          }
          yPos += 4;

          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.text(cert.schoolCollege, margin, yPos);
          yPos += 6;

          if (cert.description) {
            yPos = renderRichText(cert.description, yPos, margin);
          }
          yPos += 4;
        });
      }
    }

    // Save PDF
    doc.save(`Resume_${profile.name?.replace(/\s+/g, "_") || "Rohit_Vishwakarma"}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
};
