/**
 * AI Complaint Summarizer Utility (Heuristic-based NLP)
 * Simulates a smart issue-triage model that extracts symptoms, actions, and priority recommendations.
 */
const summarizeComplaint = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  let symptoms = [];
  let urgency = 'Standard';
  let actionNeeded = 'Assigned staff needs to inspect the issue.';

  // Keyword Matching
  if (text.includes('leak') || text.includes('water') || text.includes('overflow') || text.includes('clog') || text.includes('flush')) {
    symptoms.push('Plumbing / Water supply issue');
    actionNeeded = 'Requires plumber visit for leak repair or valve inspection.';
    if (text.includes('flooding') || text.includes('major') || text.includes('spray')) {
      urgency = 'Immediate Action Required';
      actionNeeded = 'URGENT: Main line shutoff and immediate plumber dispatch.';
    }
  }

  if (text.includes('shock') || text.includes('wire') || text.includes('spark') || text.includes('short') || text.includes('smoke')) {
    symptoms.push('Electrical hazard');
    urgency = 'Immediate Action Required';
    actionNeeded = 'URGENT: Disconnect main breaker and call electrician immediately to check faulty wiring.';
  } else if (text.includes('fan') || text.includes('light') || text.includes('bulb') || text.includes('switch') || text.includes('socket') || text.includes('board') || text.includes('power')) {
    symptoms.push('Electrical appliance issue');
    actionNeeded = 'Electrician inspect fixture replacement or wiring reconnect.';
  }

  if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('lan') || text.includes('router') || text.includes('network') || text.includes('connection')) {
    symptoms.push('Network connectivity fault');
    actionNeeded = 'IT administrator needs to check port activation or router status.';
  }

  if (text.includes('dust') || text.includes('clean') || text.includes('garbage') || text.includes('trash') || text.includes('sweeper') || text.includes('odor') || text.includes('smell')) {
    symptoms.push('Sanitation/Cleaning standard low');
    actionNeeded = 'Housekeeping staff needs to schedule room/corridor cleaning.';
  }

  if (text.includes('bed') || text.includes('chair') || text.includes('table') || text.includes('wardrobe') || text.includes('hinge') || text.includes('door') || text.includes('window') || text.includes('lock')) {
    symptoms.push('Furniture / Carpentry repair');
    actionNeeded = 'Carpenter to repair/replace structural hardware or hinges.';
  }

  if (text.includes('food') || text.includes('insect') || text.includes('cockroach') || text.includes('hygiene') || text.includes('mess') || text.includes('lunch') || text.includes('dinner') || text.includes('breakfast')) {
    symptoms.push('Mess quality / hygiene standard issue');
    actionNeeded = 'Mess manager verification and sanitation check required.';
  }

  // Fallback defaults
  if (symptoms.length === 0) {
    symptoms.push('General maintenance issue');
  }

  // Build structured summary
  const summaryText = `[AI Diagnostic] Identified ${symptoms.join(', ')}. ${actionNeeded} Urgency rating: ${urgency}.`;

  return summaryText;
};

module.exports = { summarizeComplaint };
