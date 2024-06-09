// app/utils/aggregateData.ts

import { FileDetail } from '../utils/types';

export const aggregateData = (
  items: (string | FileDetail)[],
  textTree: string,
  isMinimizedView: boolean,
  selectedViews: Record<string, string>
): string => {
  const getContentToDisplay = (item: FileDetail): string => {
    let contentToDisplay: string | undefined;

    if (item.extension === '.ts' || item.extension === '.js' || item.extension === '.tsx' || item.extension === '.jsx' || item.extension === '.css') {
      const selectedView = selectedViews[item.fileName] || 'all';
      if (selectedView === 'Import / Export' && item.fileDetail) {
        isMinimizedView ? contentToDisplay = (item.fileDetail.imports.join('\n') + '\n' + item.fileDetail.exports.join('\n')).replace(/\n/g, ' ') : contentToDisplay = item.fileDetail.imports.join('\n') + '\n' + item.fileDetail.exports.join('\n');
        
      } else if (selectedView === 'css') {
          if( isMinimizedView){
            contentToDisplay = item.fileDetail.css.length > 0 ? item.fileDetail.css.join('\n').replace(/\n/g, ' ') : 'No CSS DATA';

          }else{
            contentToDisplay = item.fileDetail.css.length > 0 ? item.fileDetail.css.join('\n') : 'No CSS DATA';
          }
        
      } else {
        contentToDisplay = isMinimizedView ? item.fileContentMinimized : item.fileContent;
      }
    } else {
      contentToDisplay = isMinimizedView ? item.fileContentMinimized : item.fileContent;
    }

    return contentToDisplay || '';
  };

  const aggregatedData = `
    Tree Structure:
    ${textTree}
  File Details and Messages:
    ${items.map(item => {
      if (typeof item === 'string') {
        return `Message: ${item}`;
      } else {
        const contentToDisplay = getContentToDisplay(item);
        return `File: ${item.fileName}\nContent:\n${contentToDisplay}`;
      }
    }).join('\n\n')}
  `;

  return aggregatedData;
};
