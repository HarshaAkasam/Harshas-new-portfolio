export type PlatformStat={platform:string;label:string;value:number|null;status:'updated'|'cached'|'unavailable';checkedAt:string|null;details:{label:string;value:number}[];activity?:Record<string,number>;note?:string};
export function parseCodeChef(html:string){const m=html.match(/Total Problems Solved:\s*(\d+)/i);if(!m)throw Error('Solved count unavailable');return Number(m[1]);}
export function parseLeetCode(data:any){const u=data?.data?.matchedUser;const rows=u?.submitStatsGlobal?.acSubmissionNum;if(!Array.isArray(rows)||!rows.some((r:any)=>r.difficulty==='All'&&Number.isInteger(r.count)))throw Error('Solved count unavailable');return {value:rows.find((r:any)=>r.difficulty==='All').count,details:rows.filter((r:any)=>r.difficulty!=='All').map((r:any)=>({label:r.difficulty,value:r.count})),activity:JSON.parse(u.userCalendar?.submissionCalendar||'{}')};}
const cache=new Map<string,{at:number;data:PlatformStat}>();
export async function getPlatformStat(platform:string):Promise<PlatformStat>{
 const old=cache.get(platform);if(old&&Date.now()-old.at<60000)return old.data;
 const checkedAt=new Date().toISOString();const base={platform,label:'Problems solved',value:null,status:'unavailable' as const,checkedAt:null,details:[]};
 const get=async(url:string,init:RequestInit={})=>{const r=await fetch(url,{...init,headers:{'User-Agent':'HarshaPortfolio/1.0','Content-Type':'application/json',...init.headers},signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Platform unavailable');return r;};
 try{let result:PlatformStat;
 if(platform==='leetcode'){const j=await (await get('https://leetcode.com/graphql',{method:'POST',body:JSON.stringify({query:'query { matchedUser(username:"Harsha_Akasam") { submitStatsGlobal { acSubmissionNum { difficulty count } } userCalendar { submissionCalendar } } }'})})).json();result={...base,...parseLeetCode(j),status:'updated',checkedAt};}
 else if(platform==='codechef'){const html=await (await get('https://www.codechef.com/users/harsha_akasam')).text();result={...base,value:parseCodeChef(html),status:'updated',checkedAt};}
 else if(platform==='github'){const j=await (await get('https://api.github.com/users/HarshaAkasam')).json() as any;if(!Number.isInteger(j.public_repos))throw Error();result={...base,label:'Public repositories',value:j.public_repos,details:[],status:'updated',checkedAt};}
 else if(platform==='hackerrank'){const j=await (await get('https://www.hackerrank.com/rest/hackers/22A91A61D2/scores_elo')).json() as any;if(!Array.isArray(j))throw Error();const details=j.filter(r=>typeof r.practice?.score==='number'&&r.practice.score>0).map(r=>({label:r.name+' points',value:r.practice.score}));result={...base,label:'Practice points',value:details.reduce((n,r)=>n+r.value,0),details,status:'updated',checkedAt,note:'HackerRank exposes skill scores here, not a verified total of solved problems.'};}
 else if(platform==='geeksforgeeks'){result={...base,note:'A solved-problem count is not available from this public profile. Open the platform to view your progress.'};}
 else throw Error('Unknown platform');
 cache.set(platform,{at:Date.now(),data:result});return result;
 }catch{return old?{...old.data,status:'cached',note:'Refresh unavailable. Showing the last successful result.'}:{...base,note:'The platform could not be reached. Try refreshing or open your profile.'};}
}
