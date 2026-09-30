import {assistantService} from '@/lib/jarvis';
export async function POST(request:Request){
 if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'Message too long.'},{status:413});
 try{const raw=await request.text();if(raw.length>12000)return Response.json({error:'Message too long.'},{status:413});const body=JSON.parse(raw);if(typeof body.message!=='string'||!body.message.trim()||body.message.length>1500)return Response.json({error:'Please use a message of 1–1500 characters.'},{status:400});return Response.json(await assistantService(body.message,typeof body.context==='string'?body.context.slice(0,80):''),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Unable to read this message.'},{status:400});}
}
