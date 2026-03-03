import { readFile, writeFile } from 'node:fs/promises';
import membersList from '../src/members.json' with { type: 'json' };

const FILE_PATH = './public/index.html';
const REGION_MARKER = 'member-list';

const fileContents = await readFile(FILE_PATH, { encoding: 'utf-8' });
const updatedFileContents = fileContents.replace(
	new RegExp(`<!-- #region ${REGION_MARKER} -->(?:.*?)<-- #endregion ${REGION_MARKER} -->`, 'gium'),
	`
	<!-- #region ${REGION_MARKER} -->
	${membersList.members.map(({ url, title }) => `<a href="${url}">${title}</a>`).join('\n')}
	<!-- #endregion ${REGION_MARKER} -->
`
);

await writeFile(FILE_PATH, updatedFileContents, { encoding: 'utf-8' });
