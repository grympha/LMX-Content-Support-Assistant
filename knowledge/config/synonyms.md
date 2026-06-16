---
# Synonym groups for the LMX Content search engine.
# Each group is a list of phrases that mean the same thing in context.
# Edit this file to add new product terminology without touching TypeScript.
# Format: each group is a YAML sequence of plain strings.
synonyms:
  - [black screen, blank screen, empty display, no display, screen blank]
  - [device offline, offline device, not online, disconnected, device disconnected]
  - [content not playing, not playing, playback missing, video not playing, ads not playing, ad not showing]
  - [wrong content, incorrect playlist, wrong playlist, fallback content]
  - [old content, old video, not updated, cached content]
  - [playlog, playlogs, proof of play, reporting, playback report, campaign report, playlog download, export report, device report, download playlogs, campaign name in report]
  - [publish, publishing, push content, send to device, sync to device, republish, publish error, cannot publish, publish failed, unable to publish, deploy content, content deployment]
  - [schedule, scheduling, campaign, daypart, start date, end date]
  - [pairing, pair device, verification code, pair code, register device, activation code, registration code, add device, pairing code]
  - [storage, upload, media library, main storage, file upload]
  - [default playlist, fallback playlist, default content, fallback]
  - [programmatic, vast, ssp, dsp, no fill, no-fill, ima, vast crash, empty ad slot, programmatic not playing, ad delivery failed, service outage, programmatic outage, ad serving, ad delivery, impressions failed, programmatic service down]
  - [hardware, requirements, specification, spec, operating system, supported platform]
  - [user management, user, role, roles, permission, permissions, access]
  - [not approved, content approval, approve content, pending approval, approval status]
  - [ad tag, vast tag, ad url, ima sdk, ima tag, ad server]
  - [bundle scheduling, content bundle, multi schedule, bundle content]
  - [media format, file format, supported format, video format, image format]
  - [webview version, webview update, chrome version, browser version, webview, webview 120, update webview, android system webview, webview outdated, webview apk, check webview version, webview not updating, html webview]
  - [pull to content, pull-to-content, ptc, inventory mapping, ssp campaign, campaign delivery, ssp inventory, campaign not playing]
  - [download, download link, apk, installer, setup, appimage, app download, player download, install app, get app, latest version, update player, new version, exe, zip]
  - [max dsp, demand side platform, advertiser, buyer, explore mode, instant mode, conventional mode, campaign planning, signals, media inventories]
  - [ssp overview, supply side platform, publisher, inventory management, deal management, deal id, pmp, dv360, place exchange, viooh, programmatic workflow]
  - [orientation, portrait, landscape, screen rotation, vertical screen, horizontal screen, rotate screen, change orientation, device orientation]
  - [login failed, cannot login, login error, sign in failed, forgot password, password reset, account locked, invalid credentials, mfa code, authentication failed, session expired, cms access denied, cms not loading after login, login troubleshooting]
  - [restart player, restart app, force stop, player frozen, player not responding, reboot device, clear cache restart, how to restart, lmx content not responding, force close app, player not working, player keeps restarting, force stop lmx]
  - [firewall, whitelist, ports, network requirements, outbound connections, cms url whitelist, proxy configuration, enterprise network, required domains, https 443, websocket cms, connectivity requirements, allowed urls, firewall blocking cms, network whitelist]
  - [content not updating, not refreshing, content stuck, sync not triggering, deploy not working, content rollout delay, device not updating, stale content, force refresh device, republish device, content update delay, sync delay, how long to deploy]
---

# Synonym Groups

This file defines vocabulary synonym groups used by the LMX Content search engine.
When any phrase in a group is detected in a user query, all phrases in the group
are added to the search terms, improving recall for terminology variations.

## How to add a new group

Add a new line under `synonyms:` in the frontmatter above:

```yaml
  - [new term, alternate name, another way to say it]
```

## How to extend an existing group

Find the relevant group and append the new phrase:

```yaml
  - [publish, publishing, push content, send to device, sync to device, deploy campaign]
```

Deploy after saving — the vault loader picks up changes on the next cold start.
