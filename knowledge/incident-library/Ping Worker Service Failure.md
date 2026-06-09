# Ping Worker Service Failure

## Incident Summary

Device status updates stopped processing correctly.

## Impact

- Devices incorrectly displayed offline
    
- Device monitoring affected
    

## Symptoms

- Online devices showing offline
    
- Delayed heartbeat updates
    

## Investigation

Worker service responsible for heartbeat processing was not running correctly.

## Root Cause

Ping Worker service interruption.

## Resolution

- Restarted worker service
    
- Verified heartbeat processing
    
- Monitored system stability
    

## Lessons Learned

- Improve worker service monitoring.
    
- Implement alerting for worker failures.
    

## Related Notes

[[Device Offline]]  
[[Monitoring]]