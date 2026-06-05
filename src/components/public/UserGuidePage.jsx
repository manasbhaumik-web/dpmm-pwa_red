import { Book, Shield, User, Globe, FileText, CheckCircle2 } from 'lucide-react';

export default function UserGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <Book className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Application User Guide</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Welcome to the DPMM Association Management System. This guide provides comprehensive instructions on how to navigate and utilize the platform effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
        
        {/* Table of Contents - Sidebar */}
        <div className="md:col-span-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Contents</h3>
            <nav className="space-y-1">
              <a href="#getting-started" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
                <FileText className="w-4 h-4" /> Getting Started
              </a>
              <a href="#public-guide" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium">
                <Globe className="w-4 h-4" /> For the Public
              </a>
              <a href="#member-guide" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                <User className="w-4 h-4" /> Member Portal
              </a>
              <a href="#admin-guide" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium">
                <Shield className="w-4 h-4" /> Admin Workspace
              </a>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-10">
          
          {/* Getting Started */}
          <section id="getting-started" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Getting Started
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              The DPMM platform is divided into three main roles: Public, Member, and Admin. You can easily switch between these views using the navigation buttons at the top of the screen (on desktop) or the bottom tab bar (on mobile).
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-sm text-emerald-800 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                This application works across desktops, tablets, and smartphones. You can even install it on your home screen as a Progressive Web App (PWA)!
              </p>
            </div>
          </section>

          {/* For the Public */}
          <section id="public-guide" className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" /> For the Public
            </h2>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                The Public view is designed for guests and prospective members. Here, you can learn about the association and apply for membership.
              </p>
              <h4 className="font-bold text-slate-800">How to Register a Company:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                <li>Navigate to the <strong>Home</strong> tab.</li>
                <li>Click the <strong>Register Now</strong> button on the landing page.</li>
                <li>Complete the 4-step registration wizard:
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-500">
                    <li><strong>Company Profile:</strong> Provide your SSM number and business category.</li>
                    <li><strong>Contact Rep:</strong> Provide the CEO or representative's contact info.</li>
                    <li><strong>Documents:</strong> Upload the required SSM Certificate and NRIC documents.</li>
                    <li><strong>Summary:</strong> Review and declare the application.</li>
                  </ul>
                </li>
                <li>Once submitted, you will receive an Application ID. Please wait for Admin verification.</li>
              </ol>
            </div>
          </section>

          {/* Member Portal */}
          <section id="member-guide" className="bg-white border border-slate-200 border-t-4 border-t-blue-600 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Member Portal
            </h2>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Approved members can log in to the Member Portal to manage their corporate profile and check payment status.
              </p>
              <h4 className="font-bold text-slate-800">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Status Banner:</strong> Instantly check if your membership is Active or Lapsed.</li>
                <li><strong>Document Vault:</strong> View previously uploaded documents (SSM, NRIC).</li>
                <li><strong>Fee Payments:</strong> Review your payment ledger and download past receipts.</li>
                <li><strong>B2B Directory:</strong> Browse other verified members to foster business relationships.</li>
              </ul>
            </div>
          </section>

          {/* Admin Workspace */}
          <section id="admin-guide" className="bg-white border border-slate-200 border-t-4 border-t-rose-600 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-600" /> Admin Workspace
            </h2>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Secretariat and administrative staff have access to the Admin Workspace for association management.
              </p>
              <h4 className="font-bold text-slate-800">Admin Actions:</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Verification Queue:</strong> Approve or reject pending applications from the public.</li>
                <li><strong>Global Registry:</strong> Search, filter, and manage all member records. Use the <em>Eye icon</em> to view a member's full profile and document vault.</li>
                <li><strong>Financial Ledger:</strong> View real-time subscription payments and export data.</li>
                <li><strong>Reporting:</strong> Generate compliance summaries, filter by sector, and export to CSV or print PDF reports.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
