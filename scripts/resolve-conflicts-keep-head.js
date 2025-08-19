/*
  Resolve Git merge conflicts by keeping the HEAD side.
  Scans the repository for conflict markers and replaces each conflict block
  of the form:

        ... keep this (HEAD)
    
  with only the HEAD section.
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/**
 * Recursively list files under a directory.
 */
function listFilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

/**
 * Resolve conflicts in a single file by keeping HEAD side.
 * Returns { changed: boolean, occurrences: number }
 */
function resolveFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('')) {
    return { changed: false, occurrences: 0 };
  }

  let occurrences = 0;
  const startMarker = '<<<<<<< HEAD';
  const midMarker = '
  // Use while loop to iteratively remove conflict blocks
  let changed = false;
  while (true) {
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) break;

    // Find mid marker after start
    const midIdx = content.indexOf('\n=======\n', startIdx);
    if (midIdx === -1) {
      // Fallback: try without leading newline
      const altMidIdx = content.indexOf('=======', startIdx);
      if (altMidIdx === -1) break; // malformed; give up on this file
    }
    const realMidIdx = midIdx !== -1 ? midIdx : content.indexOf('=======', startIdx);

    // Find end marker after mid
    const endIdx = content.indexOf('\n', realMidIdx + 7);
    // Search for the end marker prefix from after mid
    const endMarkerIdx = content.indexOf('\n' + endMarkerPrefix, realMidIdx + 7);
    let endBlockIdx;
    if (endMarkerIdx !== -1) {
      // Advance to the end of the line that contains the end marker
      const endLineBreak = content.indexOf('\n', endMarkerIdx + 1);
      endBlockIdx = endLineBreak === -1 ? content.length : endLineBreak + 1;
    } else {
      // Fallback: last occurrence of end marker prefix after mid
      const endPrefixOnlyIdx = content.indexOf(endMarkerPrefix, realMidIdx + 7);
      if (endPrefixOnlyIdx === -1) break; // malformed
      const endLineBreak = content.indexOf('\n', endPrefixOnlyIdx + 1);
      endBlockIdx = endLineBreak === -1 ? content.length : endLineBreak + 1;
    }

    // Extract HEAD portion
    const headStart = startIdx + startMarker.length;
    // Skip optional CR and LF after the start marker
    let headContentStart = headStart;
    if (content[headContentStart] === '\r') headContentStart++;
    if (content[headContentStart] === '\n') headContentStart++;

    const headContent = content.slice(headContentStart, realMidIdx);

    // Replace entire conflict block with head content
    content = content.slice(0, startIdx) + headContent + content.slice(endBlockIdx);
    occurrences += 1;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return { changed, occurrences };
}

function main() {
  const allFiles = listFilesRecursively(ROOT);
  let totalChanged = 0;
  let totalOccurrences = 0;
  for (const file of allFiles) {
    try {
      const stat = fs.statSync(file);
      if (stat.size > 5 * 1024 * 1024) continue; // skip huge files
      const text = fs.readFileSync(file, 'utf8');
      if (!text.includes('<<<<<<< HEAD')) continue;
      const { changed, occurrences } = resolveFile(file);
      if (changed) {
        totalChanged += 1;
        totalOccurrences += occurrences;
        console.log(`Resolved ${occurrences} conflict(s) in: ${path.relative(ROOT, file)}`);
      }
    } catch (err) {
      // Skip binary or unreadable files
      continue;
    }
  }
  console.log(`\nDone. Files changed: ${totalChanged}, conflicts resolved: ${totalOccurrences}`);
}

main();


