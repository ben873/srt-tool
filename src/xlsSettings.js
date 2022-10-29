import { alignment, defaultDataType } from 'export-xlsx';

// Export settings
export const SETTINGS_FOR_EXPORT = {
  // Table settings
  fileName: 'example',
  workSheets: [
    {
      sheetName: 'example',
      startingRowNumber: 1,
      gapBetweenTwoTables: 0,
      tableSettings: {
        table1: {
          headerDefinition: [
            {
              name: 'Sub Id',
              key: 'id',
            },
            {
                name: 'Timecode In',
                key: 'tcIn',
            },
            {
                name: 'Timecode OUT',
                key: 'tcOut',
            },
            {
                name: 'Line',
                key: 'text',
            },
          ],
        }
      }
    },
  ],
};