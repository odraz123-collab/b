async function faisalExtraApi(url, options) {
  const response = await fetch(url, { headers: { 'content-type': 'application/json' }, ...options });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result;
}

function installFaisalExtras() {
  const sections = [...document.querySelectorAll('section')];
  const jobSection = sections.find((section) => section.querySelector('h2')?.textContent.includes('Job discovery'));
  const inboxSection = sections.find((section) => section.querySelector('h2')?.textContent.includes('Career inbox'));
  if (jobSection && !document.querySelector('#faisal-add-job')) {
    const form = document.createElement('div');
    form.id = 'faisal-add-job';
    form.className = 'card';
    form.innerHTML = '<b>Add a job from any approved source</b><input id="f-job-title" placeholder="Job title"><input id="f-job-company" placeholder="Company"><input id="f-job-location" placeholder="Location"><input id="f-job-url" placeholder="Original job URL"><textarea id="f-job-description" placeholder="Paste the public job description"></textarea><button id="f-job-save">Add job for matching</button>';
    jobSection.insertBefore(form, jobSection.children[1]);
    document.querySelector('#f-job-save').onclick = async () => {
      await faisalExtraApi('/api/job', { method: 'POST', body: JSON.stringify({ title: document.querySelector('#f-job-title').value, company: document.querySelector('#f-job-company').value, location: document.querySelector('#f-job-location').value, url: document.querySelector('#f-job-url').value, description: document.querySelector('#f-job-description').value }) });
      window.render();
    };
  }
  if (inboxSection && !document.querySelector('#faisal-report')) {
    const report = document.createElement('div');
    report.id = 'faisal-report';
    report.innerHTML = '<button id="f-report-button">Generate today’s report</button><pre id="f-report-output"></pre>';
    inboxSection.append(report);
    document.querySelector('#f-report-button').onclick = async () => {
      const output = document.querySelector('#f-report-output'); output.textContent = 'Preparing report…';
      try { const x = await faisalExtraApi('/api/report'); output.textContent = `Jobs tracked: ${x.jobsTracked}\nPending reviews: ${x.pendingApprovals}\nTop matches:\n${x.topMatches.map(j => `• ${j.title} — ${j.company}: ${j.score}/100`).join('\n')}\n\nNext action: ${x.nextAction}`; } catch (error) { output.textContent = error.message; }
    };
  }
}
setInterval(installFaisalExtras, 300);

