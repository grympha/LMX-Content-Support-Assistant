"use client";

function LessonCard({ title, body, items, note }: { title: string; body: string; items: string[]; note?: string }) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <p className="mt-1">{body}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {note ? <p className="mt-2 font-medium text-slate-800">{note}</p> : null}
    </div>
  );
}

function CodeLine({ children }: { children: string }) {
  return <div className="mt-2 rounded-md bg-slatePanel px-3 py-2 font-mono text-xs text-white">{children}</div>;
}

export function UserManagementTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">User Management</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The User Management module in LMX Content CMS is used to create, manage, and control user access across the platform.</p>
        <p className="mt-2">The platform supports Role-Based Access Control, which allows administrators to assign different permission levels based on operational responsibilities.</p>
        <CodeLine>Role-Based Access Control (RBAC)</CodeLine>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="User Management Helps" body="Use this module to protect access and separate responsibilities." items={["Secure platform access", "Separate operational responsibilities", "Control content workflows", "Restrict sensitive features", "Manage tenant and network access"]} />
          <LessonCard title="Tenant Admin Capability" body="Tenant Admin is the main role for account administration." items={["Create users", "Assign roles", "Configure network access", "Manage permissions", "Disable accounts"]} note="Only Tenant Admins should manage user permissions." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Why User Roles Matter</h3>
        <p className="mt-2">Each user is assigned a role that defines feature access, operational permissions, content workflow capabilities, and network visibility.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Content Creators upload content.</li>
          <li>Content Approvers approve campaigns.</li>
          <li>Monitor Users monitor devices only.</li>
          <li>Tenant Admins control access and permissions.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Available User Roles</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Tenant Admin" body="Full tenant administration access." items={["All tenant features", "Users", "Networks", "Devices", "Content", "Scheduling and publishing"]} />
          <LessonCard title="Project Admin" body="Manage assigned networks only." items={["Manage content", "Monitor devices", "Configure operational settings", "No unauthorized network access"]} />
          <LessonCard title="Content Creator" body="Prepare content and schedules." items={["Upload content", "Create schedules", "Manage draft content", "Cannot approve content", "Cannot access Device Manager"]} />
          <LessonCard title="Content Approver" body="Controls approval before publishing." items={["Approve content", "Reject content", "Edit pending content", "Remove content", "Cannot access Device Manager"]} />
          <LessonCard title="Media Partner" body="Limited external or partner access." items={["Assigned playlists only", "Related content only", "No device access", "No unrelated network access"]} />
          <LessonCard title="Monitor User" body="View-only operational access." items={["Monitor device status", "View real-time monitoring", "Access remote restart tools", "Cannot edit content", "Cannot publish schedules"]} />
        </div>
        <CodeLine>Only Tenant Admins can create users, assign roles, and modify permissions</CodeLine>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing User Management</h3>
        <CodeLine>Dashboard - Setup - User</CodeLine>
        <p className="mt-2">The User Management page will appear after navigating through Setup.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">How to Create a User</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Navigate to Setup - User.</li>
          <li>Click Create User.</li>
          <li>Fill the required user details.</li>
          <li>Select the appropriate User Type.</li>
          <li>Configure account status as Enabled or Disabled.</li>
          <li>Click Add to create the user account.</li>
        </ol>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Required User Details</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Login Details" body="Required identity and login fields." items={["Username", "Email", "First Name", "Last Name"]} />
          <LessonCard title="Access Details" body="Required access configuration fields." items={["User Type", "Choose Language", "Status"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Access Control Notes</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Tenant Admin Can" body="Tenant Admin has platform access control." items={["Create users", "Edit users", "Assign permissions", "Assign networks", "Disable accounts", "Delete accounts"]} />
          <LessonCard title="Project Admin Cannot" body="Project Admin is limited to assigned networks." items={["Create users", "Access unauthorized networks", "Manage tenant-level settings"]} />
          <LessonCard title="Media Partner Can Only" body="Media Partner access is intentionally limited." items={["Access assigned playlists", "Manage assigned content", "Cannot access storage", "Cannot access devices", "Cannot access unrelated content"]} />
          <LessonCard title="Status Control" body="Status controls whether the user can log in." items={["Enabled for active users", "Disabled for inactive users", "Use disabled status when temporary access removal is needed"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">User Management Tools</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Edit" body="Modify user details or permissions." items={["Update profile details", "Adjust role", "Change access scope"]} />
          <LessonCard title="Deactivate" body="Temporarily disable account access." items={["Prevents login", "Keeps the account record", "Useful for inactive users"]} />
          <LessonCard title="Reset Password" body="Send or trigger password reset." items={["Use when user cannot remember password", "Confirm email address first"]} />
          <LessonCard title="Delete" body="Permanently remove user account when allowed." items={["Use carefully", "Users linked to active schedules may not be removable"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common User Management Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="User Cannot Login" body="The user cannot access CMS." items={["Account disabled", "Wrong password", "Incorrect role assignment", "Email issue"]} note="Check account status, login credentials, and password reset options." />
          <LessonCard title="User Cannot Access Features" body="A feature is missing or blocked." items={["Insufficient permissions", "Wrong user role", "Network restriction"]} note="Verify the assigned role, permissions, and network access." />
          <LessonCard title="Content Creator Cannot Approve" body="This is expected behavior." items={["Content Creator role does not include approval permission", "Use Content Approver for approvals"]} />
          <LessonCard title="Monitor User Cannot Edit" body="This is expected behavior." items={["Monitor Users are view-only users", "Use an editor role if editing is required"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Assign users only to required networks to improve security and permission control.</li>
          <li>Separate content workflow roles between Content Creator and Content Approver.</li>
          <li>Review user accounts regularly and disable inactive users.</li>
          <li>Use Monitor User for support teams that need visibility without edit permissions.</li>
        </ul>
        <CodeLine>Content Creator - Content Approver</CodeLine>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Only Tenant Admins can create users.</li>
          <li>Role assignment directly controls system access.</li>
          <li>Improper permissions may expose sensitive operational controls.</li>
          <li>Disabled accounts cannot access CMS.</li>
          <li>Users should only access networks relevant to their operational role.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Unable to access feature</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check assigned role.</li>
          <li>Verify network permissions.</li>
          <li>Confirm account status.</li>
          <li>Validate login credentials.</li>
          <li>Review feature restrictions for the selected role.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Create User - Assign Role - Configure Network Access - Enable Account - Verify Login - Validate Permissions</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Configure Network Access.</li>
          <li>Upload Content.</li>
          <li>Schedule Content.</li>
          <li>Publish Campaign.</li>
          <li>Monitor Device Activity.</li>
        </ol>
      </article>
    </section>
  );
}
