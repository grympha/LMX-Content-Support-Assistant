const fs = require('fs');
const path = require('path');

const DIAG_PATH = path.join(process.cwd(), 'search_diagnostics.jsonl');

function analyzeEntries(entries) {
  const validEntries = entries.filter(
    (entry) => entry && Array.isArray(entry.topMatches) && entry.topMatches.length > 0
  );

  const totalEntries = validEntries.length;
  const topScores = validEntries
    .map((entry) => (entry.topMatches[0]?.score ?? 0))
    .sort((a, b) => a - b);

  const averageTopScore = totalEntries === 0 ? 0 : topScores.reduce((sum, score) => sum + score, 0) / totalEntries;
  const medianTopScore = totalEntries === 0 ? 0 : topScores[Math.floor(totalEntries / 2)];

  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;

  const topicCounts = {};
  const termCounts = {};

  validEntries.forEach((entry) => {
    const score = entry.topMatches[0]?.score ?? 0;
    if (score < 30) lowCount += 1;
    else if (score < 60) mediumCount += 1;
    else highCount += 1;

    entry.topMatches.forEach((match) => {
      topicCounts[match.topic] = (topicCounts[match.topic] || 0) + 1;
    });

    entry.queryTerms.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  const topTerms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([term, count]) => ({ term, count }));

  const lowScoreRatio = totalEntries === 0 ? 0 : lowCount / totalEntries;
  const mediumScoreRatio = totalEntries === 0 ? 0 : mediumCount / totalEntries;

  const recommendations = [];
  const adjustments = [];

  if (averageTopScore < 25 || lowScoreRatio >= 0.6) {
    recommendations.push(
      'Low top-match scores mean search matches are too weak. Increase base phrase, heading, and topic signal weights first.'
    );
    adjustments.push({ parameter: 'body phrase weight', suggestion: '+4', rationale: 'Weak phrase matches need stronger scoring.' });
    adjustments.push({ parameter: 'body word weight', suggestion: '+2', rationale: 'Single-word signals should contribute more.' });
    adjustments.push({ parameter: 'heading weight', suggestion: '+6', rationale: 'Matching headings should be more influential.' });
    adjustments.push({ parameter: 'topic weight', suggestion: '+8', rationale: 'Topic context helps resolve ambiguous queries.' });
    adjustments.push({ parameter: 'intent boost values', suggestion: '+8 for troubleshooting/how_to/reporting', rationale: 'Intents should carry more weight for low-confidence queries.' });
  } else if (averageTopScore < 45 || mediumScoreRatio >= 0.5) {
    recommendations.push(
      'Moderate scores suggest the search is close. Prioritize heading/topic boosts and intent-specific matching improvements.'
    );
    adjustments.push({ parameter: 'heading weight', suggestion: '+4', rationale: 'Headings can better separate similar content.' });
    adjustments.push({ parameter: 'topic weight', suggestion: '+5', rationale: 'Topic context remains an important signal.' });
    adjustments.push({ parameter: 'intent boost values', suggestion: '+5', rationale: 'Strengthen how-to/troubleshooting/reporting relevance.' });
  } else {
    recommendations.push('Search scores are generally healthy. Focus on expanding synonym and phrase coverage for low-confidence terms.');
  }

  if (topTerms.length > 0) {
    recommendations.push(
      `Frequent low-confidence query terms: ${topTerms.slice(0, 10).map((item) => `${item.term} (${item.count})`).join(', ')}.`
    );
  }

  if (topTopics.length > 0) {
    recommendations.push(
      `Frequently low-confidence topics: ${topTopics.map((item) => `${item.topic} (${item.count})`).join(', ')}.`
    );
  }

  return {
    totalEntries,
    averageTopScore,
    medianTopScore,
    lowScoreRatio,
    mediumScoreRatio,
    highScoreRatio: highCount / (totalEntries || 1),
    topTopics,
    topTerms,
    recommendations,
    adjustments
  };
}

function analyze() {
  if (!fs.existsSync(DIAG_PATH)) {
    console.log('No diagnostics file found at', DIAG_PATH);
    process.exit(0);
  }

  const lines = fs.readFileSync(DIAG_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
  const entries = lines.map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean);

  if (entries.length === 0) {
    console.log('No parseable entries.');
    return;
  }

  const analysis = analyzeEntries(entries);

  console.log('Diagnostics recommendation engine');
  console.log('Total low-confidence entries:', analysis.totalEntries);
  console.log('Average top-match score:', Math.round(analysis.averageTopScore));
  console.log('Median top-match score:', Math.round(analysis.medianTopScore));
  console.log('Low score ratio:', `${Math.round(analysis.lowScoreRatio * 100)}%`);
  console.log('Medium score ratio:', `${Math.round(analysis.mediumScoreRatio * 100)}%`);
  console.log('High score ratio:', `${Math.round(analysis.highScoreRatio * 100)}%`);
  console.log('\nRecommendations:');
  analysis.recommendations.forEach((r) => console.log('- ' + r));
  console.log('\nWeight adjustment suggestions:');
  analysis.adjustments.forEach((a) => console.log(`- ${a.parameter}: ${a.suggestion} (${a.rationale})`));
  console.log('\nTop terms:');
  analysis.topTerms.slice(0, 15).forEach((item) => console.log(`- ${item.term}: ${item.count}`));
  console.log('\nTop topics:');
  analysis.topTopics.forEach((item) => console.log(`- ${item.topic}: ${item.count}`));
}

analyze();
