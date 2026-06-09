# AI Retrieval Rules

## Search Order

When a user asks a question:

### Information Question

Search:

FAQ  
↓  
Training  
↓  
MAX DSP  
↓  
SSP

### Troubleshooting Question

Search:

Troubleshooting  
↓  
RCA  
↓  
Incident Library

### Programmatic Question

Search:

Programmatic Issues  
↓  
VAST Issues  
↓  
SSP  
↓  
MAX DSP

## Multiple Results

If multiple answers exist:

1. Use most recent information.
    
2. Prefer RCA over assumptions.
    
3. Prefer Incident Library for platform-wide issues.
    

## No Result Found

Use Standard Unknown Response.

Never generate unsupported answers.