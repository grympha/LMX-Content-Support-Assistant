const fs = require('fs');
const path = require('path');

const DIAG_PATH = path.join(process.cwd(), 'search_diagnostics.jsonl');

function analyze() {
  if (!fs.existsSync(DIAG_PATH)) {
    console.log('No diagnostics file found at', DIAG_PATH);
    process.exit(0);
  }

  const lines = fs.readFileSync(DIAG_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
  const entries = lines.map((l) => {
    try { return JSON.parse(l); } catch (e) { return null; }
  }).filter(Boolean);

  const total = entries.length;
  if (total === 0) {
    console.log('No parseable entries.');
    return;
  }

  let sumTop = 0;
  const topicCounts = {};
  const termCounts = {};

  for (const e of entries) {
    const topScore = (e.topMatches && e.topMatches[0] && e.topMatches[0].score) || 0;
    sumTop += topScore;
    if (e.topMatches) {
      for (const m of e.topMatches) {
        topicCounts[m.topic] = (topicCounts[m.topic] || 0) + 1;
      }
    }
    if (e.queryTerms) {
      for (const t of e.queryTerms) {
        termCounts[t] = (termCounts[t] || 0) + 1;
      }
    }
  }

  const avgTop = sumTop / total;
  const topTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const topTerms = Object.entries(termCounts).sort((a,b)=>b[1]-a[1]).slice(0,20);

  const suggestions = [];
  if (avgTop < 30) {
    suggestions.push('Average top-match score is low (<30). Consider increasing phrase/body weights or heading/topic multipliers. Example: body phrase * +2, heading +4, topic +4.');
  } else if (avgTop < 60) {
    suggestions.push('Average top-match score is moderate. Consider small boosts for headings (+2) and intent-specific boosts (+5).');
  } else {
    suggestions.push('Average top-match score looks healthy. No immediate weight changes needed.');
  }

  console.log('Diagnostics analysis');
  console.log('Total low-confidence entries:', total);
  console.log('Average top-match score:', Math.round(avgTop));
  console.log('\nTop topics:');
  topTopics.forEach(([topic, count]) => console.log(`- ${topic}: ${count}`));
  console.log('\nTop query terms:');
  topTerms.forEach(([term, count]) => console.log(`- ${term}: ${count}`));
  console.log('\nSuggestions:');
  suggestions.forEach((s) => console.log('- ' + s));
}

analyze();
