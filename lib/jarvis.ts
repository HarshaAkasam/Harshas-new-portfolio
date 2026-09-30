import {articles, books} from './editorial';
import { personal, projects, skills, experience, certifications, profiles, achievements, sections } from './portfolio';
export type Reply={text:string; actions?:{label:string;href:string}[]; mode:'knowledge';navigateTo?:string};
const reply=(text:string,actions?:Reply['actions']):Reply=>({text,actions,mode:'knowledge'});
function knowledgeAnswer(message:string,context=''):Reply {
 const q=message.trim().toLowerCase().replace(/^jarvis[,:]?\s*/, '');
 if(/how many.*(solved|problems)|coding progress|live stats/.test(q))return reply('Practice retrieves coding-platform totals when you open it and refreshes every minute while visible. Each platform shows its latest successful update.',[{label:'View coding progress',href:'/practice'}]);
 const unknown=()=>reply("I don't have verified information about that. I can help with Harsha's documented projects, skills, education, internships, résumé, and contact details.");
 if(/practice hours|hours practiced|proficiency|skill level/.test(q))return reply('The Skills page shows illustrative practice hours, not tracked totals. Proficiency is supported by documented project experience and academic foundations.',[{label:'Skills overview',href:'/skills'}]);
 if(/books|reading|learning resources/.test(q))return reply('Books & Learning contains suggested reading; these are not claims about books Harsha has completed.',books.map(b=>({label:b.title,href:b.url})));
 if(/blog|article/.test(q))return reply('Explore three articles on mobile APIs, asset dashboards, and agentic decision support.',articles.map(a=>({label:a.title,href:'/blogs/'+a.slug})));
 if(!q)return reply('What would you like to know about Harsha?');
 if(/ignore|system prompt|instructions|pretend|make up|invent|salary|married|\bage\b|birthday|years? of experience|\d+ years|followers|stars|rating|how many.*(solved|users|problems)|strongest|best at/.test(q))return unknown();
 let project=projects.find(p=>q.includes(p.name.toLowerCase())||q.includes(p.slug)|| (p.slug==='job-align'&&/job\s?align/.test(q)));
 if(!project&&/\b(here|this project|its|it use)\b/.test(q))project=projects.find(p=>p.slug===context);
 if(/another project/.test(q)){project=projects.find(p=>p.slug!==context);}
 if(project){const href='/projects/'+project.slug;if(/contribut|role|responsib|team/.test(q))return reply(project.contribution,[{label:'Read case study',href}]);if(/technolog|stack|language|built with|use here/.test(q))return reply(project.stack.length?`${project.name} lists ${project.stack.join(', ')}. ${project.slug==='cognitive-compass'?'These are documented in the final-review presentation.':''}`:'The supplied information does not specify the technology stack.',[{label:'Explore project',href}]);if(/metric|result|accuracy|percent|user count/.test(q))return unknown();return reply(`${project.name}: ${project.description} ${project.solution}`,[{label:'Explore '+project.name,href},...(project.repo?[{label:'GitHub repository',href:project.repo}]:[])]);}
 if(/contact|email|hire|reach/.test(q))return reply(`You can reach Harsha at ${personal.email}, or connect on LinkedIn.`,[{label:'Email Harsha',href:'mailto:'+personal.email},{label:'LinkedIn',href:personal.linkedin}]);
 if(/resume|résumé|cv\b/.test(q))return reply('You can view or download Harsha’s supplied résumé.',[{label:'Open résumé',href:personal.resume}]);
 if(/linkedin/.test(q))return reply('Here is Harsha’s LinkedIn profile.',[{label:'LinkedIn',href:personal.linkedin}]);
 if(/github|repositor/.test(q))return reply('Explore Harsha’s GitHub profile and the project repositories linked in this portfolio.',[{label:'GitHub',href:personal.github},{label:'Projects',href:'/work'}]);
 if(/practice|coding|leetcode|codechef|hackerrank|geeks/.test(q))return reply('Practice shows the latest available platform totals, their update times, and learning resources. LeetCode and CodeChef report solved problems; HackerRank points and GitHub repositories are labeled separately.',[{label:'Open Practice',href:'/practice'},...profiles.map(p=>({label:p.name,href:p.url}))]);
 if(/education|stud|college|university|degree|cgpa/.test(q))return reply(`${personal.education.degree}, ${personal.education.institution}, ${personal.education.dates}. The supplied résumés list a CGPA of ${personal.education.cgpa}.`,[{label:'Education',href:'/about#education'}]);
 if(/experience|intern/.test(q))return reply(experience.map(e=>`${e.company}: ${e.title} (${e.dates}). ${e.description}`).join('\n\n'),[{label:'Experience',href:'/about#experience'}]);
 if(/certificat|credential/.test(q))return reply(certifications.map(c=>`${c.title} — ${c.issuer}`).join('\n'),[{label:'View credentials',href:'/about#credentials'}]);
 if(/award|achievement|recognition/.test(q))return reply(achievements.map(a=>`${a.title}: ${a.detail}.`).join(' '),[{label:'Achievements',href:'/about#achievements'}]);
 if(/skill|technolog|language|frontend|backend|machine learning|ai\/ml|ai and ml/.test(q)){const category=Object.keys(skills).find(c=>q.includes(c.toLowerCase()));return reply(category?`${category}: ${skills[category].join(', ')}.`:Object.entries(skills).filter(([k])=>k!=='Coursework').map(([k,v])=>`${k}: ${v.join(', ')}.`).join('\n\n'),[{label:'Explore skills',href:'/skills'}]);}
 if(/project|work|build/.test(q))return reply(projects.map(p=>p.name+': '+p.description).join('\n\n'),[{label:'Explore projects',href:'/work'}]);
 if(/navigate|website|sections|where can|take me/.test(q))return reply('Choose a section to explore.',sections.map(([href,label])=>({label,href})));
 if(/who|about|introduc|what does harsha|hello|^hi\b/.test(q))return reply(`${personal.name} is a ${personal.title.toLowerCase()} based in ${personal.location}. ${personal.intro}`,[{label:'About Harsha',href:'/about'}]);
 return unknown();
}
// Provider boundary: replace this adapter with a server-only provider integration.
// Keep output grounded in portfolio.ts; never put provider credentials in client code.
export async function assistantService(message:string,context?:string):Promise<Reply>{return answerQuestion(message,context);}

export function isPortfolioRoute(href:string){return ['/', '/about','/about#experience','/about#education','/about#achievements','/about#credentials','/blogs','/skills','/work','/practice','/practice#learning','/#contact'].includes(href)||projects.some(p=>href==='/projects/'+p.slug)||articles.some(a=>href==='/blogs/'+a.slug);}
export function answerQuestion(message:string,context=''):Reply{
 const q=message.toLowerCase();
 if(/^(jarvis[, ]*)?(please )?(open|go to|show|take me to) (the )?(home|homepage)( page)?[.!?]?$/.test(q.trim()))return {...reply('Welcome to Harsha’s home page. Explore his work, skills, reading resources, and articles.'),navigateTo:'/'};
 const result=knowledgeAnswer(message,context);
 if(result.text.startsWith("I don't have verified"))return result;
 let target=result.actions?.find(a=>isPortfolioRoute(a.href))?.href;
 if(/books|reading|learning resources/.test(q))target='/practice#learning';
 else if(/blog|article/.test(q))target='/blogs';
 else if(/practice|coding|leetcode|codechef|hackerrank|geeks/.test(q)&&!(/practice hours|proficiency/.test(q)))target='/practice';
 else if(/contact|email|reach/.test(q))target='/#contact';
 if(target&&isPortfolioRoute(target))return {...result,navigateTo:target};return result;
}
