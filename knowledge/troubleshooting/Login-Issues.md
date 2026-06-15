---
category: "User Management"
keywords:
  - login failed
  - cannot login
  - login error
  - forgot password
  - password reset
  - account locked
  - invalid credentials
  - cms access denied
  - mfa code not received
  - authentication failed
  - session expired
  - account not active
  - login troubleshooting
  - sign in failed
  - cms not loading after login
description: "Troubleshooting guide for LMX Content CMS login failures — covers invalid credentials, forgot password, account locked, MFA issues, session expiry, and CMS not loading."
search_priority: "high"
related_topics:
  - "User Management"
  - "Basic Troubleshooting"
  - "Dashboard Overview"
---

# Login Issues

## Quick Answer

If you cannot log in to the LMX Content CMS, confirm you are using the correct email address and password for your tenant. If credentials are correct but login still fails, request a password reset from the Tenant Admin or use the Forgot Password option. For MFA issues, check the authenticator app time sync or the email spam folder for the OTP code.

## Symptoms

- Login page shows "Invalid credentials" or "Incorrect email or password"
- Login form submits but the page reloads without entering the dashboard
- MFA screen appears but the one-time code is not accepted
- MFA OTP email is not received
- Account shown as inactive or access denied
- CMS dashboard immediately redirects back to the login page after login
- Login page loads but the CMS does not proceed past the loading screen
- Session expires frequently and requires repeated login

## Common Causes

### Credential Issues

| Cause | Explanation |
|---|---|
| Wrong email address | Using a personal or alias email instead of the registered account email |
| Wrong password | Password changed by an admin, or caps lock/keyboard layout active |
| Account not yet created | New user accessing CMS before the Tenant Admin has created their account |
| Account disabled | Tenant Admin has temporarily suspended login access |

### MFA Issues

- Authenticator app out of sync due to time drift on the mobile device
- MFA OTP email delivered to spam or junk folder
- Wrong account selected in Google Authenticator if multiple accounts are registered
- MFA setup was not completed — no valid code can be generated

### Session and Browser Issues

- Stale session cookie left from a previous browser session
- Third-party cookie restrictions in browser settings
- Browser extension blocking script execution on the CMS domain
- CMS page stuck on loading due to browser cache or JavaScript error

## Troubleshooting Steps

### Step 1 — Verify Email and Password

1. Confirm the exact email address used when the account was created — not an alias or forwarding address.
2. Confirm caps lock is off and the keyboard language matches.
3. Type the password manually rather than pasting from a clipboard manager.
4. If you have recently changed your password, confirm you are using the new one.

### Step 2 — Use Forgot Password

If the password is unknown or may have been changed:

1. On the CMS login page, click **Forgot Password**.
2. Enter the registered email address.
3. Check the inbox (including spam and junk) for the password reset link.
4. Click the reset link within its validity window — most reset links expire within 24 hours.
5. Set a new password and retry login.

If the Forgot Password email is not received:
- Confirm the email address is registered — the Tenant Admin can verify this in User Management.
- Check that the email domain's spam filter has not blocked the sender domain.

### Step 3 — Check Account Status with Tenant Admin

If the password is confirmed correct but login still fails:

1. Contact the **Tenant Admin** for your organisation.
2. Ask them to confirm your account is **Active** and not disabled.
3. Ask them to confirm the email address and role assigned to your account.
4. If the account needs to be re-enabled or recreated, see [[imported-how-to-create-a-user]].

### Step 4 — Resolve MFA Issues

If MFA is enabled and the one-time code is not working:

1. Confirm the code is from the correct account in Google Authenticator — multiple accounts can be registered.
2. Check the time on the mobile device — authenticator apps rely on system time. Enable automatic time sync if it is off.
3. If using email OTP, check the spam/junk folder. The OTP email is typically delivered within 1–2 minutes.
4. If the authenticator app has been uninstalled or the device replaced, use a recovery code saved during MFA setup, or contact the Tenant Admin to reset MFA for your account.
5. For full MFA setup steps, see [[imported-enable-multi-factor-authentication-mfa-tenant-level]].

### Step 5 — Clear Browser Cache and Retry

1. Open the CMS in a browser **Incognito window** or **Private mode** first — this rules out cache and extension interference without changing browser settings.
2. If incognito login succeeds, the issue is browser cache or an extension. Clear cookies and cache for the CMS domain in your normal browser.
3. Try a different browser (Chrome, Firefox, Edge) to isolate browser-specific issues.
4. If the CMS page loads but freezes on a loading spinner after login, see [[imported-cms-platform-stuck-on-loading-page]] for browser and network checks.

### Step 6 — Session Expiry or Immediate Redirect

If the CMS immediately redirects back to the login page after entering correct credentials:

1. Clear all cookies and session data for the CMS domain.
2. Disable any browser extensions that block third-party scripts or cookies (ad blockers, privacy extensions).
3. Confirm the browser is not set to block session cookies — check browser privacy/security settings.
4. Try from a different device or network to rule out a local network restriction.
5. If the issue occurs across all networks and devices, see [[Firewall-And-Network-Requirements]] to verify whether a proxy or firewall is intercepting the CMS session.

## Escalation Criteria

Escalate when:

- Password reset was completed successfully but login still fails with an error
- Tenant Admin cannot create or re-enable the account in User Management
- All users in the organisation are unable to log in simultaneously — may indicate a platform outage
- CMS login page does not load from multiple browsers and networks
- Account shows Active in the system but access is denied

**Information to collect before escalating:**
- Email address used for login (do not share the password)
- Exact error message shown (screenshot preferred)
- Whether the issue affects one user or all users in the tenant
- Whether incognito mode or a different browser resolves the issue
- Whether the issue started after a specific change (password reset, new device, MFA configuration)

## Related Notes

[[imported-how-to-create-a-user]]
[[imported-enable-multi-factor-authentication-mfa-tenant-level]]
[[imported-cms-platform-stuck-on-loading-page]]
[[Firewall-And-Network-Requirements]]
[[User Management]]
