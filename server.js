const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = Number(process.env.PORT || 3000);
const root = __dirname;
const dataFile = path.resolve(process.env.LAB_DATA_FILE || path.join(root, 'data/site-data.json'));
const adminEmail = process.env.ADMIN_EMAIL || 'abdulsalamlukman755@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-now';

function readData() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ events: [], members: [], employment: [], meetings: [], applicants: [] }, null, 2));
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeData(data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1_000_000) req.destroy(); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); } });
  });
}

function id(prefix) {
  return prefix + '-' + crypto.randomBytes(8).toString('hex');
}

const sessions = new Set();
const applicantSessions = new Map();

function bearer(req) {
  const value = req.headers.authorization || '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function requireAdmin(req, res) {
  const token = bearer(req);
  if (!sessions.has(token)) { send(res, 401, { ok: false, error: 'Admin login required.' }); return false; }
  return true;
}

function createApplicant(category, payload) {
  const data = readData();
  const password = crypto.randomBytes(24).toString('hex');
  const applicant = {
    id: id(category), category, email: String(payload.email || '').trim().toLowerCase(),
    fullName: payload.fullName || payload.companyName || payload.name || '', status: 'pending',
    createdAt: new Date().toISOString(), passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
    payload
  };
  data.applicants.push(applicant);
  writeData(data);
  applicant.password = password;
  return applicant;
}

async function api(req, res, pathname) {
  if (pathname === '/api/events' && req.method === 'GET') {
    const data = readData();
    return send(res, 200, { ok: true, events: data.events.filter(item => item.status !== 'rejected') });
  }
  if (pathname === '/api/login' && req.method === 'POST') {
    const body = await readJson(req);
    if (String(body.email).toLowerCase() !== adminEmail.toLowerCase() || String(body.password) !== adminPassword) return send(res, 401, { ok: false, error: 'Invalid administrator credentials.' });
    const token = crypto.randomBytes(32).toString('hex'); sessions.add(token);
    return send(res, 200, { ok: true, token, email: adminEmail });
  }
  if (pathname === '/api/session' && req.method === 'GET') {
    const token = bearer(req); if (!sessions.has(token)) return send(res, 401, { ok: false, error: 'Session expired.' });
    return send(res, 200, { ok: true, email: adminEmail });
  }
  if (pathname === '/api/member-applications' && req.method === 'POST') {
    const body = await readJson(req); const data = readData(); const item = { id: id('member'), ...body, status: 'pending', createdAt: new Date().toISOString() }; data.members.push(item); writeData(data);
    if (body.email) createApplicant('member', body);
    return send(res, 201, { ok: true, message: 'Your membership application was received. It is pending review.', reference: item.id });
  }
  if (pathname === '/api/employment-applications' && req.method === 'POST') {
    const body = await readJson(req); const data = readData(); const item = { id: id('employment'), ...body, status: 'pending', createdAt: new Date().toISOString() }; data.employment.push(item); writeData(data);
    if (body.email) createApplicant('employment', body);
    return send(res, 201, { ok: true, message: 'Your employment application was received. It is pending review.', reference: item.id });
  }
  if (pathname === '/api/meeting-requests' && req.method === 'POST') {
    const body = await readJson(req); const data = readData(); const item = { id: id('meeting'), ...body, status: 'pending', createdAt: new Date().toISOString() }; data.meetings.push(item); writeData(data);
    return send(res, 201, { ok: true, message: 'Meeting request received.' });
  }
  if (pathname === '/api/admin/events' && req.method === 'POST') {
    if (!requireAdmin(req, res)) return; const body = await readJson(req); const data = readData(); const item = { id: id('event'), ...body, status: 'approved', createdAt: new Date().toISOString() }; data.events.push(item); writeData(data); return send(res, 201, { ok: true, event: item });
  }
  if (pathname === '/api/admin/dashboard' && req.method === 'GET') {
    if (!requireAdmin(req, res)) return; const data = readData(); return send(res, 200, { ok: true, data });
  }
  if (pathname === '/api/admin/update-status' && req.method === 'POST') {
    if (!requireAdmin(req, res)) return; const body = await readJson(req); const data = readData(); const collection = body.type === 'members' ? 'members' : body.type === 'employment' ? 'employment' : body.type === 'events' ? 'events' : body.type === 'meetings' ? 'meetings' : null;
    if (!collection) return send(res, 400, { ok: false, error: 'Unknown item type.' });
    const item = data[collection].find(value => value.id === body.itemId); if (!item) return send(res, 404, { ok: false, error: 'Item not found.' }); item.status = body.status; writeData(data);
    return send(res, 200, { ok: true, message: 'Status updated successfully.', emailSent: false });
  }
  if (pathname === '/api/applicant/login' && req.method === 'POST') {
    const body = await readJson(req); const data = readData(); const email = String(body.email || '').trim().toLowerCase(); const applicant = data.applicants.find(item => item.category === body.category && item.email === email);
    if (!applicant || !applicant.passwordHash || applicant.passwordHash !== crypto.createHash('sha256').update(String(body.password || '')).digest('hex')) return send(res, 401, { ok: false, error: 'Invalid email or password.' });
    const token = crypto.randomBytes(32).toString('hex'); applicantSessions.set(token, applicant.id); return send(res, 200, { ok: true, token });
  }
  if (pathname === '/api/applicant/progress' && req.method === 'GET') {
    const applicantId = applicantSessions.get(bearer(req)); if (!applicantId) return send(res, 401, { ok: false, error: 'Please sign in again.' }); const data = readData(); const applicant = data.applicants.find(item => item.id === applicantId); if (!applicant) return send(res, 404, { ok: false, error: 'Application not found.' });
    return send(res, 200, { ok: true, progress: { id: applicant.id, status: applicant.status, createdAt: applicant.createdAt } });
  }
  if (pathname === '/api/applicant/logout' && req.method === 'POST') {
    applicantSessions.delete(bearer(req)); return send(res, 200, { ok: true });
  }
  if (pathname === '/api/applicant/activate' && req.method === 'POST') {
    const body = await readJson(req); const data = readData(); const applicant = data.applicants.find(item => item.category === body.category && item.activationToken === body.token);
    if (!applicant) return send(res, 400, { ok: false, error: 'Verification token is invalid or has expired.' }); applicant.passwordHash = crypto.createHash('sha256').update(String(body.password || '')).digest('hex'); delete applicant.activationToken; writeData(data); const token = crypto.randomBytes(32).toString('hex'); applicantSessions.set(token, applicant.id);
    return send(res, 200, { ok: true, token, category: applicant.category, progress: { id: applicant.id, status: applicant.status, createdAt: applicant.createdAt } });
  }
  return send(res, 404, { ok: false, error: 'API endpoint not found.' });
}

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return await api(req, res, url.pathname);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const safe = path.normalize(pathname).replace(/^([/\\])+/, '');
    let file = path.join(root, safe);
    if (!file.startsWith(root)) return send(res, 403, { ok: false, error: 'Forbidden.' });
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, '404.html');
    res.writeHead(fs.existsSync(file) && file !== path.join(root, '404.html') ? 200 : 404, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch (error) {
    if (!res.headersSent) send(res, 500, { ok: false, error: 'Internal server error.' });
  }
});

server.listen(port, () => console.log(`LAB Enterprises is running at http://localhost:${port}`));
