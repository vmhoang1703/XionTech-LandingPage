// XionTech Privacy Policy, Document Version 1.1 (Amber-provided legal text,
// 2026-10-15). Authoritative in English and shown as-is on every locale; do
// not edit or translate the wording. Generated from the source text: h2
// sections, h3/h4 subsections, paragraphs, lists and the company facts.

export type PolicyBlock =
  | { kind: "heading"; level: 3 | 4; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "facts"; items: readonly (readonly [string, string])[] };

export type PolicySection = {
  id: string;
  title: string;
  blocks: readonly PolicyBlock[];
};

export const POLICY_META = [
  ["Last update", "July 10, 2025"],
  ["Effective Date", "July 10, 2025"],
  ["Document Version", "1.1"],
  ["Language", "English"],
  ["Primary Jurisdiction", "Vietnam"],
  [
    "Global Applicability",
    "Yes, with jurisdiction-specific adaptations as required",
  ],
] as const;

export const POLICY_CLOSING =
  "This privacy policy has been designed to comply with international privacy standards, industry best practices, and platform requirements. For questions about compliance in specific jurisdictions or for specific services, please contact our privacy team.";

export const POLICY_SECTIONS: readonly PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      {
        kind: "p",
        text: "This Privacy Policy describes how XionTech Joint Stock Company (“we,” “us,” or “our”) collects, uses, and protects your information when you use our digital products, applications, websites, and IT services (collectively, the “Services”).",
      },
      {
        kind: "p",
        text: "By using our Services, you agree to this Privacy Policy.",
      },
    ],
  },
  {
    id: "company-information",
    title: "Company Information",
    blocks: [
      {
        kind: "facts",
        items: [
          ["Company", "XIONTECH JOINT STOCK COMPANY"],
          [
            "Address",
            "Floor No. 12, A2 Tower, Viettel Building, 285 Cach Mang Thang Tam St., Hoa Hung Ward, Ho Chi Minh City, Vietnam",
          ],
          ["Email", "contact@xiontechs.com"],
          ["Phone", "+084-908-107552"],
          ["Business License Number", "0318883639"],
          ["D-U-N-S Number", "665533815"],
        ],
      },
    ],
  },
  {
    id: "service-scope-and-ownership",
    title: "Service Scope and Ownership",
    blocks: [
      {
        kind: "heading",
        level: 3,
        text: "Current Ownership",
      },
      {
        kind: "p",
        text: "All digital products and services covered by this privacy policy are currently owned and operated by XionTech Joint Stock Company. We serve as the data controller for all user information collected through these services.",
      },
      {
        kind: "heading",
        level: 3,
        text: "Potential Ownership Changes",
      },
      {
        kind: "p",
        text: "As a software development and IT services company, XionTech may sell, license, or transfer individual products or services to third parties as part of our business operations. Each product’s ownership status can be verified through:",
      },
      {
        kind: "list",
        items: [
          "Platform developer information (app stores, web domains)",
          "Product “About” or “Legal” sections",
          "Direct inquiry to our support team",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Active vs. Transferred Services",
      },
      {
        kind: "list",
        items: [
          "Active XionTech Services: Subject to this privacy policy and our direct privacy obligations",
          "Transferred Services: Subject to the new owner’s privacy policy and their privacy obligations",
          "Transition Period: During transfers, we ensure continuous privacy protection and user notification",
        ],
      },
    ],
  },
  {
    id: "covered-services",
    title: "Covered Services",
    blocks: [
      {
        kind: "p",
        text: "This privacy policy applies to all digital products and services developed, published, or operated by XionTech Joint Stock Company, including:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Web Applications and Websites",
      },
      {
        kind: "list",
        items: [
          "Software-as-a-Service (SaaS) platforms",
          "Web-based applications and tools",
          "Company websites and landing pages",
          "Client portals and dashboards",
          "E-commerce and business websites",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Desktop Applications",
      },
      {
        kind: "list",
        items: [
          "Windows desktop software",
          "macOS desktop applications",
          "Linux-compatible software",
          "Cross-platform desktop tools",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Mobile Applications",
      },
      {
        kind: "list",
        items: [
          "iOS applications published on the Apple App Store",
          "Android applications published on Google Play Store",
          "Applications distributed through other mobile app platforms",
          "Enterprise mobile applications and custom solutions",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "IT Services and Solutions",
      },
      {
        kind: "list",
        items: [
          "Cloud hosting and infrastructure services",
          "Custom software development projects",
          "IT consulting and support services",
          "Data processing and analytics services",
          "API services and integrations",
          "Enterprise software solutions",
        ],
      },
      {
        kind: "p",
        text: "Note: This policy applies only to products and services currently owned by XionTech. For transferred or sold products, users should refer to the current owner’s privacy policy.",
      },
      {
        kind: "heading",
        level: 3,
        text: "Service Categories",
      },
      {
        kind: "p",
        text: "Our digital products and services may include but are not limited to:",
      },
      {
        kind: "list",
        items: [
          "Business and productivity solutions",
          "Educational and learning platforms",
          "Entertainment and lifestyle applications",
          "Utility and tool software",
          "E-commerce and marketplace platforms",
          "Communication and collaboration tools",
          "Data analytics and reporting systems",
          "Custom enterprise solutions",
          "IT infrastructure and hosting services",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Individual Service Information",
      },
      {
        kind: "p",
        text: "Each product or service may display specific privacy information within the interface, documentation, or platform listing, including:",
      },
      {
        kind: "list",
        items: [
          "Data types specific to that service’s functionality",
          "Unique third-party integrations",
          "Special permissions or access requirements",
          "Service-specific terms and conditions",
        ],
      },
      {
        kind: "p",
        text: "For detailed information about a specific product or service’s data practices, please refer to the privacy information displayed in that service or contact us directly.",
      },
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      {
        kind: "heading",
        level: 3,
        text: "1. Information You Provide Directly",
      },
      {
        kind: "list",
        items: [
          "Account Information: Name, email address, username, password, company details",
          "Profile Information: Profile pictures, preferences, settings, professional information",
          "User Content: Text, images, files, documents, code, or other content you create, upload, or share",
          "Communication Data: Messages, feedback, support requests, consultation inquiries",
          "Payment Information: Billing details, invoicing information (processed securely by third-party payment processors)",
          "Business Information: Company data, project requirements, technical specifications",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "2. Information Collected Automatically",
      },
      {
        kind: "heading",
        level: 4,
        text: "Device and System Information",
      },
      {
        kind: "list",
        items: [
          "Device type, model, operating system version",
          "Browser type, version, and configuration",
          "Unique device identifiers (IDFA, Android Advertising ID, device ID)",
          "Hardware features and capabilities",
          "Network connection information (WiFi, cellular, IP address)",
          "Language and region settings",
          "Screen resolution and display characteristics",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Usage Data",
      },
      {
        kind: "list",
        items: [
          "Features and functions accessed within our services",
          "Time spent using our services",
          "User interactions, navigation patterns, and click behavior",
          "Search queries and content accessed",
          "Performance data and response times",
          "Error logs and diagnostic information",
          "API calls and system interactions",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Location Information (When Applicable)",
      },
      {
        kind: "list",
        items: [
          "Precise Location: GPS coordinates (only with explicit user permission)",
          "Approximate Location: Based on IP address or network location",
          "Location Usage: May be used for service functionality, content personalization, analytics, security, or location-based features as disclosed within each specific service",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Website and Application Analytics",
      },
      {
        kind: "list",
        items: [
          "Page views, session duration, and bounce rates",
          "Referral sources and marketing campaign tracking",
          "A/B testing and feature usage analytics",
          "Conversion tracking and goal completion",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "3. Information from Third Parties",
      },
      {
        kind: "list",
        items: [
          "Social media account information (when you connect social accounts)",
          "Information from advertising partners and analytics providers",
          "Data from business partners, vendors, or service integrations",
          "Public business information and directory data",
          "Third-party authentication services (OAuth, SSO)",
        ],
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    blocks: [
      {
        kind: "p",
        text: "We will use the information that we collect about you for the following purposes:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Core Service Functionality",
      },
      {
        kind: "list",
        items: [
          "Provide and maintain our digital products and services",
          "Process transactions and manage accounts",
          "Enable service features and personalization",
          "Facilitate communication and collaboration",
          "Deliver IT services and technical support",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Development and Improvement",
      },
      {
        kind: "list",
        items: [
          "Analyze service usage and performance",
          "Identify and fix bugs and technical issues",
          "Develop new features and improvements",
          "Conduct research and analytics",
          "Optimize user experience and interface design",
          "Test new technologies and services",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Business Operations",
      },
      {
        kind: "list",
        items: [
          "Process payments and manage billing",
          "Provide customer support and technical assistance",
          "Manage business relationships and partnerships",
          "Conduct business development and sales activities",
          "Fulfill contractual obligations",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Communication and Marketing",
      },
      {
        kind: "list",
        items: [
          "Send important service notifications and updates",
          "Respond to your inquiries and support requests",
          "Send promotional content and marketing materials (with your consent)",
          "Provide security alerts and system notifications",
          "Share company news and product announcements",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Legal and Safety",
      },
      {
        kind: "list",
        items: [
          "Comply with legal obligations and regulatory requirements",
          "Protect against fraud, security threats, and unauthorized access",
          "Enforce our terms of service and agreements",
          "Resolve disputes and legal matters",
          "Maintain system security and data integrity",
        ],
      },
    ],
  },
  {
    id: "information-sharing-and-disclosure",
    title: "Information Sharing and Disclosure",
    blocks: [
      {
        kind: "heading",
        level: 3,
        text: "Third-Party Service Providers",
      },
      {
        kind: "p",
        text: "We may share information with trusted service providers who assist us in:",
      },
      {
        kind: "heading",
        level: 4,
        text: "Analytics and Performance",
      },
      {
        kind: "list",
        items: [
          "Analytics Platforms: Usage analytics, user behavior tracking, and performance monitoring (where implemented)",
          "Crash Reporting Services: Error detection, crash analysis, and diagnostic reporting (where implemented)",
          "Performance Monitoring Tools: Service speed, responsiveness, and technical performance measurement (where implemented)",
          "Business Intelligence Tools: Data analysis, reporting, and business insights",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Infrastructure and Backend",
      },
      {
        kind: "list",
        items: [
          "Cloud Service Providers: Data storage, processing, and hosting through reputable cloud platforms",
          "Content Delivery Networks: Content delivery optimization and global distribution",
          "Database Services: Secure data management and storage platforms",
          "Security Services: Threat detection, monitoring, and protection systems",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Communication and Collaboration",
      },
      {
        kind: "list",
        items: [
          "Email Services: Email delivery, marketing automation, and communication platforms",
          "Video Conferencing: Remote meetings, webinars, and collaboration tools",
          "Customer Support: Help desk, ticketing, and support management systems",
          "Project Management: Collaboration, task management, and workflow tools",
        ],
      },
      {
        kind: "heading",
        level: 4,
        text: "Payment Processing (Where Applicable)",
      },
      {
        kind: "list",
        items: [
          "Third-Party Payment Processors: Secure payment processing through established providers",
          "Financial Services: Invoicing, accounting, and financial management systems",
        ],
      },
      {
        kind: "p",
        text: "Note: We do not store payment card information directly",
      },
      {
        kind: "heading",
        level: 4,
        text: "Marketing and Advertising (Where Applicable)",
      },
      {
        kind: "list",
        items: [
          "Advertising Networks: Digital advertising delivery and management",
          "Marketing Platforms: Campaign management, lead generation, and customer acquisition",
          "Social Media Platforms: Social media marketing and engagement tools",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Legal Requirements",
      },
      {
        kind: "p",
        text: "We may disclose information when required by law or to:",
      },
      {
        kind: "list",
        items: [
          "Comply with legal process, court orders, or government requests",
          "Protect our rights, property, and business interests",
          "Ensure user safety and system security",
          "Investigate fraud, security incidents, or policy violations",
          "Respond to emergency situations",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Business Transfers and Asset Sales",
      },
      {
        kind: "p",
        text: "In the course of our software development and IT services business, we may:",
      },
      {
        kind: "list",
        items: [
          "Sell, transfer, or assign products, services, or business units to third parties",
          "Transfer user data as part of business asset sales or mergers",
          "Assign privacy obligations to acquiring companies",
          "License our technology or intellectual property",
        ],
      },
      {
        kind: "p",
        text: "When Products or Services Are Sold or Transferred:",
      },
      {
        kind: "list",
        items: [
          "User Notification: We will provide advance notice of any transfer through service notifications, email (where available), platform announcements, or direct communication",
          "Privacy Policy Updates: The acquiring company will either adopt this privacy policy or provide their own compliant privacy policy",
          "Data Transfer: User data may be transferred to the new owner as part of the business transaction",
          "Responsibility Transfer: All privacy obligations and user rights will transfer to the new owner",
          "Continuity: Users will retain the same privacy rights under the new ownership",
        ],
      },
      {
        kind: "p",
        text: "Your Options During Transfers:",
      },
      {
        kind: "list",
        items: [
          "Continued Use: Continue using the service under new ownership with updated privacy terms",
          "Data Deletion: Request deletion of your data before the transfer is completed",
          "Service Termination: Discontinue use of the service if you do not agree with the new ownership",
          "Data Export: Request export of your data in portable formats (where technically feasible)",
        ],
      },
      {
        kind: "p",
        text: "Post-Transfer Responsibilities:",
      },
      {
        kind: "list",
        items: [
          "XionTech Joint Stock Company will no longer be responsible for privacy practices after the transfer date",
          "All privacy inquiries should be directed to the new owner",
          "The acquiring company becomes the new data controller",
          "Service URLs, contacts, and support channels may change",
        ],
      },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    blocks: [
      {
        kind: "p",
        text: "We retain your information for as long as necessary to:",
      },
      {
        kind: "list",
        items: [
          "Provide our services and maintain functionality",
          "Comply with legal obligations and regulatory requirements",
          "Resolve disputes and enforce agreements",
          "Maintain business records and documentation",
          "Support ongoing business relationships",
        ],
      },
      {
        kind: "p",
        text: "Specific Retention Periods:",
      },
      {
        kind: "list",
        items: [
          "Account Data: Retained while account is active + 90 days after deletion",
          "Usage Analytics: Aggregated data retained for up to 3 years",
          "Error Logs and Diagnostics: Retained for up to 2 years",
          "Support Communications: Retained for up to 5 years",
          "Business Communications: Retained for up to 7 years (for legal and tax purposes)",
          "Project Data: Retained per contractual agreements or legal requirements",
          "Financial Records: Retained per applicable accounting and tax regulations",
        ],
      },
    ],
  },
  {
    id: "your-rights-and-choices",
    title: "Your Rights and Choices",
    blocks: [
      {
        kind: "p",
        text: "Depending on your location and applicable laws, you may have the following rights:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Access and Control",
      },
      {
        kind: "list",
        items: [
          "Access: Request a copy of your personal data",
          "Rectification: Correct inaccurate or incomplete information",
          "Deletion: Request deletion of your data (subject to legal and contractual obligations)",
          "Portability: Receive your data in a portable, machine-readable format",
          "Restriction: Limit how we process your data",
          "Objection: Object to certain types of data processing",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Communication Preferences",
      },
      {
        kind: "list",
        items: [
          "Opt-out of promotional communications and marketing materials",
          "Manage notification settings and preferences",
          "Control marketing and advertising preferences",
          "Customize service communications",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Service Controls",
      },
      {
        kind: "list",
        items: [
          "Manage account settings and privacy preferences",
          "Control data sharing with third-party integrations",
          "Configure security and authentication settings",
          "Export or download your data (where available)",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Advertising Controls (Where Applicable)",
      },
      {
        kind: "list",
        items: [
          "Opt-out of personalized advertising",
          "Reset advertising identifiers on your devices",
          "Use device and browser settings to limit tracking",
          "Manage cookie and tracking preferences",
        ],
      },
      {
        kind: "p",
        text: "To Exercise Your Rights:",
      },
      {
        kind: "list",
        items: [
          "Email us at: contact@xiontechs.com (for services currently owned by XionTech)",
          "Use service-specific privacy settings (where available)",
          "Contact our Data Protection Officer",
          "Submit requests through our support portal",
          "For transferred services: Contact the current owner directly",
        ],
      },
      {
        kind: "p",
        text: "Note: For products or services that have been sold or transferred, privacy rights must be exercised with the current owner, not XionTech.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    blocks: [
      {
        kind: "p",
        text: "Our services are generally not intended for children under 13 years of age (or under 16 in the European Union). We do not knowingly collect personal information from children under the applicable age limit. If we become aware that we have collected such information, we will take steps to delete it promptly.",
      },
      {
        kind: "p",
        text: "For Services That May Be Used by Children: When applicable, we implement additional safeguards including:",
      },
      {
        kind: "list",
        items: [
          "Enhanced parental consent mechanisms where required by law",
          "Limited data collection practices appropriate for children",
          "Strengthened privacy protections and security measures",
          "Compliance with children’s privacy regulations (COPPA, GDPR Article 8)",
          "Age verification processes where necessary",
        ],
      },
      {
        kind: "p",
        text: "Educational Services: For educational technology services that may be used in schools or by minors:",
      },
      {
        kind: "list",
        items: [
          "Compliance with FERPA and other educational privacy laws",
          "Enhanced data protection for student information",
          "Appropriate consent mechanisms for educational use",
          "Limited data collection and use for educational purposes only",
        ],
      },
    ],
  },
  {
    id: "international-data-transfers",
    title: "International Data Transfers",
    blocks: [
      {
        kind: "p",
        text: "Your information may be transferred to and processed in countries other than your country of residence, including Vietnam and other countries where we, our affiliates, or our service providers operate. We ensure appropriate safeguards are in place to protect your information during such transfers, including:",
      },
      {
        kind: "list",
        items: [
          "Adequacy Decisions: Transfers to countries with adequate data protection laws",
          "Standard Contractual Clauses: EU-approved contract terms for international transfers",
          "Binding Corporate Rules: Internal privacy frameworks for multinational operations",
          "Certification Programs: Participation in recognized privacy certification programs",
          "Other Legal Safeguards: Additional mechanisms as required by applicable law",
        ],
      },
    ],
  },
  {
    id: "security-measures",
    title: "Security Measures",
    blocks: [
      {
        kind: "p",
        text: "We implement comprehensive technical and organizational measures to protect your information:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Technical Safeguards",
      },
      {
        kind: "list",
        items: [
          "Encryption of data in transit and at rest using industry-standard protocols",
          "Secure authentication mechanisms and access controls",
          "Regular security assessments, penetration testing, and vulnerability scanning",
          "Network security monitoring and intrusion detection systems",
          "Secure software development practices and code review processes",
          "Data backup and disaster recovery procedures",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Organizational Safeguards",
      },
      {
        kind: "list",
        items: [
          "Employee privacy and security training programs",
          "Data access limitations based on job responsibilities and business needs",
          "Incident response procedures and breach notification protocols",
          "Regular security audits and compliance assessments",
          "Vendor management and third-party security requirements",
          "Privacy-by-design principles in product development",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Service-Specific Security",
      },
      {
        kind: "list",
        items: [
          "API security and rate limiting",
          "Database security and access logging",
          "Application-level security controls",
          "Cloud infrastructure security configurations",
          "Regular security updates and patch management",
        ],
      },
      {
        kind: "p",
        text: "Note: While we strive to protect your information using reasonable security measures, no method of transmission, storage, or processing is 100% secure. We cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "cookies-and-tracking-technologies",
    title: "Cookies and Tracking Technologies",
    blocks: [
      {
        kind: "p",
        text: "Our services may use various tracking technologies to enhance functionality and user experience:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Cookies and Local Storage",
      },
      {
        kind: "list",
        items: [
          "Essential Cookies: Required for basic service functionality and security",
          "Preference Cookies: Remember your settings and preferences",
          "Analytics Cookies: Help us understand how our services are used",
          "Advertising Cookies: Used for marketing and advertising purposes (where applicable)",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Application Data Storage",
      },
      {
        kind: "list",
        items: [
          "App preferences and configuration settings",
          "Cached data for offline functionality and performance",
          "User session information and authentication tokens",
          "Temporary files and working data",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Analytics and Performance Tracking",
      },
      {
        kind: "list",
        items: [
          "Usage patterns, feature adoption, and user behavior analysis",
          "Performance monitoring, load times, and error tracking",
          "A/B testing and feature experimentation",
          "Conversion tracking and goal measurement",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Third-Party Tracking (Where Applicable)",
      },
      {
        kind: "list",
        items: [
          "Social media integration and sharing features",
          "Third-party analytics and measurement tools",
          "Advertising networks and marketing platforms",
          "Customer support and chat services",
        ],
      },
      {
        kind: "p",
        text: "Managing Tracking Technologies: You can control tracking through:",
      },
      {
        kind: "list",
        items: [
          "Browser cookie settings and preferences",
          "Device privacy settings and opt-out mechanisms",
          "Service-specific privacy controls and settings",
          "Industry opt-out tools and preference centers",
        ],
      },
    ],
  },
  {
    id: "artificial-intelligence-and-automated-processing",
    title: "Artificial Intelligence and Automated Processing",
    blocks: [
      {
        kind: "p",
        text: "Some of our services may use artificial intelligence, machine learning, or other automated decision-making technologies to:",
      },
      {
        kind: "list",
        items: [
          "Enhance user experience and service functionality",
          "Provide personalized content, recommendations, or insights",
          "Improve service performance, efficiency, and features",
          "Analyze usage patterns, trends, and user behavior",
          "Automate business processes and decision-making",
          "Detect security threats and fraudulent activity",
        ],
      },
      {
        kind: "p",
        text: "When AI/Automated Processing Is Used:",
      },
      {
        kind: "list",
        items: [
          "Users will be informed when automated decision-making significantly affects them",
          "Appropriate controls and opt-out mechanisms will be provided where required by law",
          "Human review options may be available for important automated decisions",
          "AI processing will be conducted in accordance with applicable privacy laws and ethical guidelines",
          "Transparent information about AI use will be provided in service documentation",
        ],
      },
      {
        kind: "p",
        text: "Data Used for AI/ML:",
      },
      {
        kind: "list",
        items: [
          "Training data will be processed securely and in compliance with this privacy policy",
          "Personal data used for AI will be minimized and limited to specific purposes",
          "AI models will not be used to infer sensitive personal characteristics without explicit consent",
          "Data quality and bias mitigation measures will be implemented where appropriate",
          "User data may be anonymized or aggregated for AI training purposes",
        ],
      },
    ],
  },
  {
    id: "service-specific-privacy-information",
    title: "Service-Specific Privacy Information",
    blocks: [
      {
        kind: "p",
        text: "Individual products and services may have additional privacy considerations based on their specific functionality and use cases:",
      },
      {
        kind: "heading",
        level: 3,
        text: "Common Service Categories and Data Practices",
      },
      {
        kind: "p",
        text: "Business/Productivity Services:",
      },
      {
        kind: "list",
        items: [
          "May collect work-related information, documents, business data, or professional communications",
          "Could integrate with enterprise systems, CRM platforms, or third-party business tools",
          "May require additional authentication, security measures, or compliance certifications",
          "Could process sensitive business information subject to confidentiality agreements",
        ],
      },
      {
        kind: "p",
        text: "E-commerce and Marketplace Platforms:",
      },
      {
        kind: "list",
        items: [
          "May collect payment information, shipping addresses, and transaction history",
          "Could process seller information, product data, and customer communications",
          "May integrate with payment processors, shipping providers, and inventory management systems",
          "Could include features for reviews, ratings, and customer feedback",
        ],
      },
      {
        kind: "p",
        text: "Educational and Learning Services:",
      },
      {
        kind: "list",
        items: [
          "May collect learning progress, assessment results, educational records, or academic data",
          "Could include features for tracking user advancement, certifications, or achievements",
          "May have enhanced privacy protections for student information and educational records",
          "Could integrate with learning management systems or educational technology platforms",
        ],
      },
      {
        kind: "p",
        text: "Communication and Collaboration Tools:",
      },
      {
        kind: "list",
        items: [
          "May collect messages, files, contact information, and communication metadata",
          "Could process voice calls, video conferences, screen sharing, or collaboration data",
          "May integrate with calendars, email systems, or project management tools",
          "Could include features for team collaboration, file sharing, or real-time communication",
        ],
      },
      {
        kind: "p",
        text: "Entertainment and Social Services:",
      },
      {
        kind: "list",
        items: [
          "May collect user-generated content, preferences, social interactions, or community data",
          "Could include features for sharing content, social networking, or user communities",
          "May integrate with social media platforms or entertainment content providers",
          "Could process multimedia content, user reviews, or social engagement data",
        ],
      },
      {
        kind: "p",
        text: "Utility and Tool Services:",
      },
      {
        kind: "list",
        items: [
          "May access device features like camera, microphone, sensors, or file systems",
          "Could process files, photos, documents, or other user content for tool functionality",
          "May require specific device permissions or system access for functionality",
          "Could integrate with operating system features or hardware capabilities",
        ],
      },
      {
        kind: "p",
        text: "Enterprise and Custom Solutions:",
      },
      {
        kind: "list",
        items: [
          "May process business-critical data, proprietary information, or confidential business processes",
          "Could include custom data handling requirements based on client specifications",
          "May be subject to additional security, compliance, or regulatory requirements",
          "Could involve data processing agreements, business associate agreements, or custom privacy terms",
        ],
      },
      {
        kind: "p",
        text: "IT Services and Infrastructure:",
      },
      {
        kind: "list",
        items: [
          "May process technical data, system logs, performance metrics, or infrastructure information",
          "Could include hosting, cloud services, data processing, or technical support activities",
          "May involve data center operations, network management, or system administration",
          "Could be subject to data processing agreements or specific security requirements",
        ],
      },
      {
        kind: "p",
        text: "For specific information about any individual service’s data practices, please check the service’s documentation, privacy settings, terms of service, or contact us directly.",
      },
    ],
  },
  {
    id: "compliance-information",
    title: "Compliance Information",
    blocks: [
      {
        kind: "p",
        text: "This Privacy Policy is designed to comply with applicable privacy laws and regulations, including:",
      },
      {
        kind: "heading",
        level: 3,
        text: "International Frameworks",
      },
      {
        kind: "list",
        items: [
          "General Data Protection Regulation (GDPR) – European Union",
          "California Consumer Privacy Act (CCPA) – United States",
          "Personal Information Protection and Electronic Documents Act (PIPEDA) – Canada",
          "Lei Geral de Proteção de Dados (LGPD) – Brazil",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Regional and National Laws",
      },
      {
        kind: "list",
        items: [
          "Vietnam Personal Data Protection Laws and Regulations",
          "Asia-Pacific Economic Cooperation (APEC) Privacy Framework",
          "Other applicable data protection and privacy laws in jurisdictions where we operate",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Industry Standards and Guidelines",
      },
      {
        kind: "list",
        items: [
          "Apple App Store Guidelines and Privacy Requirements",
          "Google Play Store Requirements and Developer Policies",
          "Web Content Accessibility Guidelines (WCAG)",
          "ISO 27001 Information Security Management Standards",
          "SOC 2 Security and Privacy Controls",
        ],
      },
      {
        kind: "heading",
        level: 3,
        text: "Platform-Specific Compliance",
      },
      {
        kind: "list",
        items: [
          "Mobile app platform privacy requirements and guidelines",
          "Web browser privacy standards and best practices",
          "Cloud service provider compliance and certification requirements",
          "Payment processor security and privacy standards",
        ],
      },
    ],
  },
  {
    id: "contact-information",
    title: "Contact Information",
    blocks: [
      {
        kind: "p",
        text: "Data Protection Officer: XionTech Joint Stock Company Floor No. 12, A2 Tower, Viettel Building 285 Cach Mang Thang Tam St., Hoa Hung Ward Ho Chi Minh City, Vietnam",
      },
      {
        kind: "p",
        text: "Primary Contact:",
      },
      {
        kind: "list",
        items: ["Email: contact@xiontechs.com", "Phone: +084-908-107552"],
      },
      {
        kind: "p",
        text: "Privacy-Specific Inquiries:",
      },
      {
        kind: "list",
        items: [
          "Include “Privacy Policy” in your subject line",
          "Provide specific details about your inquiry or request",
          "Allow up to 30 days for response to complex requests",
          "Urgent privacy matters may be escalated by phone",
        ],
      },
      {
        kind: "p",
        text: "Business and Partnership Inquiries:",
      },
      {
        kind: "list",
        items: [
          "General business inquiries: contact@xiontechs.com",
          "Partnership opportunities: contact@xiontechs.com",
          "Support and technical assistance: itsupport@xiontechs.com",
        ],
      },
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    blocks: [
      {
        kind: "p",
        text: "We may update this Privacy Policy from time to time to reflect:",
      },
      {
        kind: "list",
        items: [
          "Changes in our business practices or service offerings",
          "Legal or regulatory updates and requirements",
          "New technologies, features, or services",
          "Industry best practices and standards",
          "User feedback and privacy concerns",
        ],
      },
      {
        kind: "p",
        text: "Notice of Changes:",
      },
      {
        kind: "list",
        items: [
          "Updated policy will be posted on our website and in our services",
          "Email notification for significant changes (where contact information is available)",
          "In-service notifications for material changes affecting user rights",
          "Continued use of our services after changes constitutes acceptance",
          "Users will have the opportunity to opt-out of material changes where legally required",
        ],
      },
      {
        kind: "p",
        text: "Version Control:",
      },
      {
        kind: "list",
        items: [
          "All policy versions will be archived and available upon request",
          "Change logs will detail significant modifications",
          "Effective dates will be clearly indicated for all versions",
        ],
      },
    ],
  },
];
