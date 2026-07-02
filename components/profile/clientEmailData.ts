export type TabKey = "Inbox" | "Active Project" | "Close Project";

export type EmailItem = {
  id: string;
  name: string;
  time: string;
  email: string;
  date: string;
  subject: string;
  preview: string;
  body: string[];
  attachmentName: string;
  attachmentSize: string;
  attachmentCount: string;
  starred?: boolean;
  tab: TabKey;
};

export const EMAIL_ITEMS: EmailItem[] = [
  {
    id: "1",
    name: "Bernard",
    time: "12:30 PM",
    email: "bernard@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Quarterly Audit Report - Q3",
    preview: "Please find the attached Quarterly Audit Report for Q3.",
    body: [
      "Hi Team,",
      "Please find the attached Quarterly Audit Report for Q3. This document summarizes our financial performance, compliance checks, and operational efficiency metrics for the last three months.",
      "We've noted a significant improvement in resource allocation within the SaaS infrastructure division. I recommend a thorough review of the appendix section regarding the new scalability protocols.",
      "Best regards,",
      "Bernard",
      "Compliance Director",
    ],
    attachmentName: "audit_report_q3.pdf",
    attachmentSize: "2.4 MB",
    attachmentCount: "2 Files",
    tab: "Inbox",
  },
  {
    id: "2",
    name: "Randall",
    time: "12:30 PM",
    email: "randall@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Project Closing Summary",
    preview: "Closing summary for the completed construction cycle.",
    body: ["Hello Team,", "Please review the closing summary and pending sign-off items.", "Regards,", "Randall"],
    attachmentName: "closing_summary.pdf",
    attachmentSize: "1.1 MB",
    attachmentCount: "1 File",
    starred: true,
    tab: "Inbox",
  },
  {
    id: "3",
    name: "Guy",
    time: "12:30 PM",
    email: "guy@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Active Project Budget Review",
    preview: "Budget review for active project milestones.",
    body: ["Hi,", "Kindly review the updated budget allocations for phase 2.", "Thanks,", "Guy"],
    attachmentName: "budget_review.xlsx",
    attachmentSize: "980 KB",
    attachmentCount: "1 File",
    tab: "Active Project",
  },
  {
    id: "4",
    name: "Ronald",
    time: "12:30 PM",
    email: "ronald@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Work Progress Update",
    preview: "Latest progress update for active site work.",
    body: ["Team,", "Attached is the latest progress update for this week.", "Regards,", "Ronald"],
    attachmentName: "progress_update.pdf",
    attachmentSize: "1.8 MB",
    attachmentCount: "2 Files",
    starred: true,
    tab: "Active Project",
  },
  {
    id: "5",
    name: "Darrell",
    time: "12:30 PM",
    email: "darrell@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Closed Project Handover",
    preview: "Handover and final documentation for closed project.",
    body: ["Hi Admin,", "Please find final handover documents attached.", "Regards,", "Darrell"],
    attachmentName: "handover_docs.pdf",
    attachmentSize: "3.2 MB",
    attachmentCount: "3 Files",
    starred: true,
    tab: "Close Project",
  },
  {
    id: "6",
    name: "Soham",
    time: "12:30 PM",
    email: "soham@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Supporting Documents",
    preview: "Supporting files for closed project review.",
    body: ["Hello,", "Sharing supporting documents for archival.", "Thanks,", "Soham"],
    attachmentName: "support_docs.zip",
    attachmentSize: "4.0 MB",
    attachmentCount: "4 Files",
    tab: "Close Project",
  },
  {
    id: "7",
    name: "Leslie",
    time: "12:30 PM",
    email: "leslie@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Monthly Team Report",
    preview: "Monthly report and updates from client side.",
    body: ["Hi Team,", "Please check the attached monthly report.", "Regards,", "Leslie"],
    attachmentName: "monthly_report.pdf",
    attachmentSize: "2.0 MB",
    attachmentCount: "2 Files",
    tab: "Inbox",
  },
  {
    id: "8",
    name: "Jacob",
    time: "12:30 PM",
    email: "jacob@enterprise-saas.com",
    date: "Oct 24, 2023",
    subject: "Project Timeline Discussion",
    preview: "Discussion points regarding project timeline.",
    body: ["Hello,", "Let's review the updated timeline and dependencies.", "Thanks,", "Jacob"],
    attachmentName: "timeline_notes.pdf",
    attachmentSize: "850 KB",
    attachmentCount: "1 File",
    tab: "Active Project",
  },
];
