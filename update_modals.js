const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd());

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.expo' || file === 'android' || file === 'ios') continue;
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, filelist);
    } else if (file.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(srcDir);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<Modal')) continue;

  let changed = false;

  // Add import if needed
  if (!content.includes('useSafeAreaInsets')) {
    if (content.includes('react-native-safe-area-context')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+["']react-native-safe-area-context["'];/, (match, p1) => {
        if (!p1.includes('useSafeAreaInsets')) {
          return `import { ${p1}, useSafeAreaInsets } from 'react-native-safe-area-context';`;
        }
        return match;
      });
    } else {
      content = `import { useSafeAreaInsets } from 'react-native-safe-area-context';\n` + content;
    }
    changed = true;
  }

  // Find components that use <Modal and make sure they have `const insets = useSafeAreaInsets();`
  // We can just add it before the first return or before `<Modal` if it's missing, but that's very brittle.
  // Instead, since React components are just functions, we can look for `return (` or `return (` and inject it if it's not present.
  if (!content.includes('const insets = useSafeAreaInsets();')) {
      // Find the first occurrence of `return (` or `return  <` or `return <`
      const returnIndex = content.search(/return\s*\(|return\s*</);
      if (returnIndex !== -1) {
          content = content.slice(0, returnIndex) + 'const insets = useSafeAreaInsets();\n  ' + content.slice(returnIndex);
          changed = true;
      }
  }

  const modalRegex = /(<Modal[^>]*?)(\/?>)/g;
  content = content.replace(modalRegex, (match, p1, p2) => {
    if (!p1.includes('style={{ paddingBottom: Math.max(insets.bottom, 24) }}')) {
      changed = true;
      return `${p1}\n      style={{ paddingBottom: Math.max(insets.bottom, 24) }}\n    ${p2}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
}
console.log('Modified files:', modifiedCount);
