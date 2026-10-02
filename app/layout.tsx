import type {Metadata} from 'next';
import './globals.css';
import './sage-design.css';
import './mobile-refinements.css';
import {SiteShell} from '@/components/site-shell';
import {personal} from '@/lib/portfolio';
export const metadata:Metadata={title:'Harsha Akasam — Software Developer',description:'Explore Harsha Akasam’s work in full-stack development, React Native mobile applications, and AI / ML. Projects, blogs, skills, books and learning, coding journey, and Jarvis.',openGraph:{title:'Harsha Akasam — Software Developer',description:'Web, mobile, and intelligent systems. Explore the work of Harsha Akasam.',type:'website'},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Person',name:personal.name,jobTitle:personal.title,email:personal.email,sameAs:[personal.github,personal.linkedin],alumniOf:{'@type':'CollegeOrUniversity',name:personal.education.institution}})}}/><SiteShell>{children}</SiteShell></body></html>}
