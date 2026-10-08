// Party Rats Worker. Static files in public/ are served by Workers Assets before
// this runs; the Worker only sees requests that don't match a file, which is
// how POST /api/inquiry reaches it.
//
// Setup (Cloudflare dashboard):
// - Email Routing enabled on thepartyrats.com, with the lead inbox added and
//   verified as a destination address.
// - Secret LEAD_TO = that inbox address (Worker > Settings > Variables and Secrets).

const FROM = { email: 'inquiries@thepartyrats.com', name: 'Party Rats website' };
const FIELDS = {
  name: 100, email: 200, phone: 40, date: 60, guests: 40, budget: 40, idea: 4000,
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/inquiry') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      return handleInquiry(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleInquiry(request, env) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const reply = (ok, error, status = 200) => wantsJson
    ? Response.json(ok ? { ok } : { ok, error }, { status })
    : Response.redirect(new URL(ok ? '/thanks.html' : '/#inquire', request.url), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'That didn’t send properly.', 400);
  }

  // Bots fill the hidden field; pretend it worked.
  if (form.get('company')) return reply(true);

  const lead = {};
  for (const [key, max] of Object.entries(FIELDS)) {
    lead[key] = String(form.get(key) || '').trim().slice(0, max);
  }
  if (!lead.name || !lead.idea || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return reply(false, 'Please add your name, a valid email and your idea.', 400);
  }

  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || '-'}`,
    `Event date: ${lead.date || '-'}`,
    `Guests: ${lead.guests || '-'}`,
    `Budget: ${lead.budget || '-'}`,
    '',
    lead.idea,
  ].join('\n');

  try {
    await env.EMAIL.send({
      from: FROM,
      to: env.LEAD_TO,
      replyTo: { email: lead.email, name: lead.name },
      subject: `New party inquiry: ${lead.name}${lead.date ? ` (${lead.date})` : ''}`,
      text,
    });
  } catch (err) {
    // Keep the lead in the Worker logs so it isn't lost if email fails.
    console.error('Inquiry email failed', err.code || '', err.message, JSON.stringify(lead));
    return reply(false, 'Our inbox hiccuped.', 502);
  }
  return reply(true);
}
