export const queryForQ1 = 
`  
fetch builtin:service.response.time
| bin(1m) 
| summarize avg(value)
| compare RA(1d)

`
;