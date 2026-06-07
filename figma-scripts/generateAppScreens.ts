// Figma Script: Generate Full Application Wireframes
// Runs via Figma Plugin API (e.g. Scripter plugin)

async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
}

// Helpers
function createText(characters, size, weight, r, g, b) {
  const text = figma.createText();
  text.fontName = { family: "Inter", style: weight };
  text.characters = characters;
  text.fontSize = size;
  text.fills = [{ type: "SOLID", color: { r, g, b } }];
  return text;
}

function createRect(width, height, r, g, b, cornerRadius = 0) {
  const rect = figma.createRectangle();
  rect.resize(width, height);
  rect.fills = [{ type: "SOLID", color: { r, g, b } }];
  rect.cornerRadius = cornerRadius;
  return rect;
}

function createFrame(name, width, height, layoutMode, r, g, b) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.fills = [{ type: "SOLID", color: { r, g, b } }];
  if (layoutMode) {
    frame.layoutMode = layoutMode;
  }
  return frame;
}

// --- Screens ---

function createLandingPage(x, y) {
  const screen = createFrame("Landing Page", 1440, 900, "NONE", 1, 1, 1);
  screen.x = x;
  screen.y = y;

  // Navbar
  const nav = createFrame("Navbar", 1440, 80, "HORIZONTAL", 1, 1, 1);
  nav.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
  nav.strokeBottomWeight = 1;
  nav.primaryAxisAlignItems = "SPACE_BETWEEN";
  nav.counterAxisAlignItems = "CENTER";
  nav.paddingLeft = 80;
  nav.paddingRight = 80;
  
  const logo = createText("DPMM Portal", 24, "Bold", 0.8, 0.1, 0.1); // Red theme
  const links = createFrame("Links", 300, 40, "HORIZONTAL", 1, 1, 1);
  links.itemSpacing = 24;
  links.counterAxisAlignItems = "CENTER";
  links.appendChild(createText("Home", 16, "Medium", 0.3, 0.3, 0.3));
  links.appendChild(createText("About", 16, "Medium", 0.3, 0.3, 0.3));
  links.appendChild(createText("Login", 16, "Medium", 0.8, 0.1, 0.1));
  
  nav.appendChild(logo);
  nav.appendChild(links);
  screen.appendChild(nav);

  // Hero Section
  const hero = createFrame("Hero Section", 1440, 600, "VERTICAL", 0.98, 0.98, 0.98);
  hero.y = 80;
  hero.primaryAxisAlignItems = "CENTER";
  hero.counterAxisAlignItems = "CENTER";
  hero.itemSpacing = 24;

  const title = createText("Empowering Malaysian Businesses", 64, "Bold", 0.1, 0.1, 0.1);
  const subtitle = createText("Join DPMM to network, grow, and manage your enterprise effectively.", 24, "Regular", 0.4, 0.4, 0.4);
  
  const btnFrame = createFrame("CTA Button", 200, 56, "HORIZONTAL", 0.8, 0.1, 0.1);
  btnFrame.cornerRadius = 8;
  btnFrame.primaryAxisAlignItems = "CENTER";
  btnFrame.counterAxisAlignItems = "CENTER";
  btnFrame.appendChild(createText("Register Now", 18, "SemiBold", 1, 1, 1));

  hero.appendChild(title);
  hero.appendChild(subtitle);
  hero.appendChild(btnFrame);
  screen.appendChild(hero);

  return screen;
}

function createLoginPage(x, y) {
  const screen = createFrame("Login Page", 1440, 900, "NONE", 0.95, 0.95, 0.97);
  screen.x = x;
  screen.y = y;

  const card = createFrame("Login Card", 480, 500, "VERTICAL", 1, 1, 1);
  card.x = (1440 - 480) / 2;
  card.y = (900 - 500) / 2;
  card.cornerRadius = 16;
  card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
  card.strokeWeight = 1;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.paddingTop = 60;
  card.paddingBottom = 60;
  card.itemSpacing = 24;
  
  const title = createText("Welcome Back", 32, "Bold", 0.1, 0.1, 0.1);
  card.appendChild(title);

  // Input 1
  const inputGroup1 = createFrame("Input Group", 400, 80, "VERTICAL", 1, 1, 1);
  inputGroup1.itemSpacing = 8;
  inputGroup1.appendChild(createText("Email Address", 14, "Medium", 0.3, 0.3, 0.3));
  const input1 = createFrame("Input", 400, 48, "HORIZONTAL", 0.98, 0.98, 0.98);
  input1.cornerRadius = 8;
  input1.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
  input1.strokeWeight = 1;
  input1.paddingLeft = 16;
  input1.counterAxisAlignItems = "CENTER";
  input1.appendChild(createText("Enter your email", 14, "Regular", 0.6, 0.6, 0.6));
  inputGroup1.appendChild(input1);
  card.appendChild(inputGroup1);

  // Input 2
  const inputGroup2 = createFrame("Input Group", 400, 80, "VERTICAL", 1, 1, 1);
  inputGroup2.itemSpacing = 8;
  inputGroup2.appendChild(createText("Password", 14, "Medium", 0.3, 0.3, 0.3));
  const input2 = createFrame("Input", 400, 48, "HORIZONTAL", 0.98, 0.98, 0.98);
  input2.cornerRadius = 8;
  input2.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
  input2.strokeWeight = 1;
  input2.paddingLeft = 16;
  input2.counterAxisAlignItems = "CENTER";
  input2.appendChild(createText("••••••••", 14, "Regular", 0.6, 0.6, 0.6));
  inputGroup2.appendChild(input2);
  card.appendChild(inputGroup2);

  // Button
  const btnFrame = createFrame("Login Button", 400, 48, "HORIZONTAL", 0.8, 0.1, 0.1);
  btnFrame.cornerRadius = 8;
  btnFrame.primaryAxisAlignItems = "CENTER";
  btnFrame.counterAxisAlignItems = "CENTER";
  btnFrame.appendChild(createText("Sign In", 16, "SemiBold", 1, 1, 1));
  card.appendChild(btnFrame);

  screen.appendChild(card);
  return screen;
}

function createDashboardLayout(name, x, y, titleText, contentGenerator) {
  const screen = createFrame(name, 1440, 900, "NONE", 0.96, 0.97, 0.98);
  screen.x = x;
  screen.y = y;

  // Sidebar
  const sidebar = createFrame("Sidebar", 280, 900, "VERTICAL", 1, 1, 1);
  sidebar.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
  sidebar.strokeRightWeight = 1;
  sidebar.paddingLeft = 24;
  sidebar.paddingTop = 32;
  sidebar.itemSpacing = 32;

  const logo = createText("DPMM", 24, "Bold", 0.8, 0.1, 0.1);
  sidebar.appendChild(logo);

  const navLinks = ["Dashboard", "Members", "Payments", "Settings"];
  const navFrame = createFrame("Nav Links", 232, 400, "VERTICAL", 1, 1, 1);
  navFrame.itemSpacing = 16;
  
  navLinks.forEach((link, i) => {
    const item = createFrame(`Item-${link}`, 232, 48, "HORIZONTAL", i===0 ? 0.95 : 1, i===0 ? 0.95 : 1, i===0 ? 0.98 : 1);
    item.cornerRadius = 8;
    item.counterAxisAlignItems = "CENTER";
    item.paddingLeft = 16;
    item.appendChild(createText(link, 16, i===0 ? "SemiBold" : "Medium", i===0 ? 0.8 : 0.4, i===0 ? 0.1 : 0.4, i===0 ? 0.1 : 0.4));
    navFrame.appendChild(item);
  });
  sidebar.appendChild(navFrame);
  screen.appendChild(sidebar);

  // Header
  const header = createFrame("Header", 1160, 80, "HORIZONTAL", 1, 1, 1);
  header.x = 280;
  header.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
  header.strokeBottomWeight = 1;
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.paddingLeft = 40;
  header.paddingRight = 40;
  
  header.appendChild(createText(titleText, 24, "SemiBold", 0.1, 0.1, 0.1));
  
  const profile = createFrame("Profile", 40, 40, "NONE", 0.8, 0.8, 0.8);
  profile.cornerRadius = 20;
  header.appendChild(profile);
  screen.appendChild(header);

  // Content Area
  const content = createFrame("Content", 1080, 740, "VERTICAL", 0.96, 0.97, 0.98);
  content.x = 320;
  content.y = 120;
  content.itemSpacing = 24;

  contentGenerator(content);
  screen.appendChild(content);

  return screen;
}

function createMemberPortal(x, y) {
  return createDashboardLayout("Member Portal", x, y, "Welcome, Prisma Digital", (content) => {
    // Widgets Row
    const widgetsRow = createFrame("Widgets", 1080, 140, "HORIZONTAL", 0.96, 0.97, 0.98);
    widgetsRow.itemSpacing = 24;

    const createWidget = (title, val, color) => {
      const w = createFrame("Widget", 344, 140, "VERTICAL", 1, 1, 1);
      w.cornerRadius = 16;
      w.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
      w.strokeWeight = 1;
      w.paddingLeft = 24; w.paddingTop = 24; w.itemSpacing = 16;
      w.appendChild(createText(title, 14, "Medium", 0.5, 0.5, 0.5));
      w.appendChild(createText(val, 32, "Bold", color[0], color[1], color[2]));
      return w;
    };

    widgetsRow.appendChild(createWidget("Membership Status", "ACTIVE", [0.1, 0.7, 0.3]));
    widgetsRow.appendChild(createWidget("Valid Until", "Dec 2026", [0.2, 0.2, 0.2]));
    widgetsRow.appendChild(createWidget("Pending Dues", "RM 0.00", [0.2, 0.2, 0.2]));
    content.appendChild(widgetsRow);

    // Profile Details Card
    const profileCard = createFrame("Profile Card", 1080, 400, "VERTICAL", 1, 1, 1);
    profileCard.cornerRadius = 16;
    profileCard.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    profileCard.strokeWeight = 1;
    profileCard.paddingTop = 32; profileCard.paddingLeft = 32;
    profileCard.itemSpacing = 24;
    profileCard.appendChild(createText("Company Profile", 20, "SemiBold", 0.1, 0.1, 0.1));
    profileCard.appendChild(createText("Company: Prisma Digital Sdn Bhd\nSSM: 202601987654\nCategory: Ordinary\nContact: Nurul Hana", 16, "Regular", 0.3, 0.3, 0.3));
    content.appendChild(profileCard);
  });
}

function createAdminDashboard(x, y) {
  return createDashboardLayout("Admin Dashboard", x, y, "Admin Overview", (content) => {
    // Widgets Row
    const widgetsRow = createFrame("Widgets", 1080, 140, "HORIZONTAL", 0.96, 0.97, 0.98);
    widgetsRow.itemSpacing = 24;

    const createWidget = (title, val, color) => {
      const w = createFrame("Widget", 252, 140, "VERTICAL", 1, 1, 1);
      w.cornerRadius = 16;
      w.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
      w.strokeWeight = 1;
      w.paddingLeft = 24; w.paddingTop = 24; w.itemSpacing = 16;
      w.appendChild(createText(title, 14, "Medium", 0.5, 0.5, 0.5));
      w.appendChild(createText(val, 32, "Bold", color[0], color[1], color[2]));
      return w;
    };

    widgetsRow.appendChild(createWidget("Total Members", "2,104", [0.2, 0.2, 0.2]));
    widgetsRow.appendChild(createWidget("Active", "1,890", [0.1, 0.7, 0.3]));
    widgetsRow.appendChild(createWidget("Lapsed", "214", [0.8, 0.1, 0.1]));
    widgetsRow.appendChild(createWidget("Pending Apps", "4", [0.9, 0.6, 0.1]));
    content.appendChild(widgetsRow);

    // Data Table Mock
    const tableCard = createFrame("Table Card", 1080, 400, "VERTICAL", 1, 1, 1);
    tableCard.cornerRadius = 16;
    tableCard.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    tableCard.strokeWeight = 1;
    tableCard.paddingTop = 24; tableCard.paddingLeft = 24; tableCard.paddingRight = 24;
    tableCard.itemSpacing = 16;
    
    // Table Header
    const th = createFrame("Table Header", 1032, 48, "HORIZONTAL", 0.98, 0.98, 0.98);
    th.counterAxisAlignItems = "CENTER";
    th.paddingLeft = 16; th.itemSpacing = 200;
    th.appendChild(createText("Company Name", 14, "SemiBold", 0.4, 0.4, 0.4));
    th.appendChild(createText("Status", 14, "SemiBold", 0.4, 0.4, 0.4));
    th.appendChild(createText("Action", 14, "SemiBold", 0.4, 0.4, 0.4));
    tableCard.appendChild(th);

    // Table Rows
    for (let i = 0; i < 4; i++) {
      const tr = createFrame("Table Row", 1032, 64, "HORIZONTAL", 1, 1, 1);
      tr.counterAxisAlignItems = "CENTER";
      tr.strokes = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
      tr.strokeBottomWeight = 1;
      tr.paddingLeft = 16; tr.itemSpacing = 200;
      
      tr.appendChild(createText(`Member Company ${i+1}`, 14, "Medium", 0.2, 0.2, 0.2));
      tr.appendChild(createText("ACTIVE", 12, "Bold", 0.1, 0.7, 0.3));
      tr.appendChild(createText("Edit", 14, "Medium", 0.1, 0.4, 0.9));
      tableCard.appendChild(tr);
    }
    
    content.appendChild(tableCard);
  });
}

async function run() {
  await loadFonts();
  
  const startX = figma.viewport.center.x;
  const startY = figma.viewport.center.y;

  // Render screens side by side
  createLandingPage(startX, startY);
  createLoginPage(startX + 1600, startY);
  createMemberPortal(startX + 3200, startY);
  createAdminDashboard(startX + 4800, startY);

  figma.closePlugin("App Screens Generated successfully!");
}

run();
