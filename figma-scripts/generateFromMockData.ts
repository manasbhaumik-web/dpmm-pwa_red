// Figma Script to Generate UI Cards from mockData.js
// You can run this script using the "Scripter" plugin in Figma, or by setting it up as a standard Figma Plugin.

const PENDING_APPLICANTS = [
  {
    id: 'APP-2026-001',
    company: 'Duta Kreatif Agency',
    ssm: '202601234567',
    category: 'Associate',
    type: 'Creative Agency',
    contact: 'Ashraf Wafi bin Rosli',
    ic: '890512-14-5678',
    email: 'ashraf@dutakreatif.com.my',
    phone: '601112345678',
    submittedAt: '2026-05-14'
  },
  {
    id: 'APP-2026-002',
    company: 'Prisma Digital Sdn Bhd',
    ssm: '202601987654',
    category: 'Ordinary',
    type: 'Digital Marketing',
    contact: 'Nurul Hana bt Zainudin',
    ic: '931205-08-1234',
    email: 'hana@prismadigital.my',
    phone: '601987654321',
    submittedAt: '2026-05-15'
  },
  {
    id: 'APP-2026-003',
    company: 'Nexus Capital Partners',
    ssm: '202601555888',
    category: 'Life',
    type: 'Investment',
    contact: 'Datuk Suresh Pillai',
    ic: '751009-10-7654',
    email: 'suresh@nexuscapital.com',
    phone: '60122222888',
    submittedAt: '2026-05-16'
  },
  {
    id: 'APP-2026-004',
    company: 'Minda Tekno Resources',
    ssm: '202601777000',
    category: 'Ordinary',
    type: 'Engineering',
    contact: 'Fazilah bt Musa',
    ic: '880303-06-9012',
    email: 'fazilah@mindatekno.my',
    phone: '60133334444',
    submittedAt: '2026-05-16'
  }
];

async function generateCards() {
  // Load necessary fonts first
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  const startX = figma.viewport.center.x;
  let startY = figma.viewport.center.y;
  const cardSpacing = 40;

  // Create a container frame
  const container = figma.createFrame();
  container.name = "Pending Applicants UI";
  container.layoutMode = "VERTICAL";
  container.itemSpacing = cardSpacing;
  container.paddingBottom = 40;
  container.paddingTop = 40;
  container.paddingLeft = 40;
  container.paddingRight = 40;
  container.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.97 } }];
  container.cornerRadius = 16;
  container.x = startX;
  container.y = startY;

  // Generate a card for each applicant
  for (const applicant of PENDING_APPLICANTS) {
    const card = figma.createFrame();
    card.name = `Card - ${applicant.company}`;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 8;
    card.paddingTop = 24;
    card.paddingBottom = 24;
    card.paddingLeft = 24;
    card.paddingRight = 24;
    card.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    card.cornerRadius = 12;
    card.strokes = [{ type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }];
    card.strokeWeight = 1;
    card.layoutAlign = "STRETCH";
    card.primaryAxisSizingMode = "AUTO";

    // Add Company Name (Title)
    const titleText = figma.createText();
    titleText.characters = applicant.company;
    titleText.fontName = { family: "Inter", style: "Bold" };
    titleText.fontSize = 20;
    titleText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    card.appendChild(titleText);

    // Add Type / Category Badge area (simple text for now)
    const badgeText = figma.createText();
    badgeText.characters = `${applicant.category} • ${applicant.type}`;
    badgeText.fontName = { family: "Inter", style: "Medium" };
    badgeText.fontSize = 12;
    badgeText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
    card.appendChild(badgeText);

    // Add contact details
    const detailsText = figma.createText();
    detailsText.characters = `Contact: ${applicant.contact}\nEmail: ${applicant.email}\nPhone: +${applicant.phone}\nSSM: ${applicant.ssm}`;
    detailsText.fontName = { family: "Inter", style: "Regular" };
    detailsText.fontSize = 14;
    detailsText.lineHeight = { value: 150, unit: "PERCENT" };
    detailsText.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];
    card.appendChild(detailsText);

    // Add footer
    const footerText = figma.createText();
    footerText.characters = `Submitted: ${applicant.submittedAt}`;
    footerText.fontName = { family: "Inter", style: "Regular" };
    footerText.fontSize = 10;
    footerText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
    card.appendChild(footerText);

    // Append card to container
    container.appendChild(card);
  }

  figma.viewport.scrollAndZoomIntoView([container]);
  figma.closePlugin("Cards generated successfully!");
}

generateCards();
