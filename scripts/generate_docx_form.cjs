const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  ImageRun,
  ShadingType,
} = require('docx');

async function generateEnrollmentDocx() {
  // A4 page dimensions: 11906 x 16838 DXA.
  // Margins 720 DXA (0.5 in) left and right -> Printable width = 10466 DXA.
  const tableWidth = 10400;

  // Standard border styling
  const borderBlack = { style: BorderStyle.SINGLE, size: 6, color: '2D3748' };
  const borderLight = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E0' };

  const cellBorder = {
    top: borderBlack,
    bottom: borderBlack,
    left: borderBlack,
    right: borderBlack,
  };

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  // Color schemes
  const goldBannerShading = { fill: '8C641C', val: ShadingType.CLEAR, color: 'auto' };
  const navyBannerShading = { fill: '0B2545', val: ShadingType.CLEAR, color: 'auto' };
  const labelShading = { fill: 'F7FAFC', val: ShadingType.CLEAR, color: 'auto' };
  const tableHeaderShading = { fill: 'EDF2F7', val: ShadingType.CLEAR, color: 'auto' };

  const defaultCellMargin = { top: 90, bottom: 90, left: 130, right: 130 };

  function createSectionBanner(title) {
    return new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      columnWidths: [tableWidth],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: tableWidth, type: WidthType.DXA },
              shading: goldBannerShading,
              borders: cellBorder,
              margin: { top: 110, bottom: 110, left: 140, right: 140 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title,
                      bold: true,
                      color: 'FFFFFF',
                      size: 21, // 10.5pt
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  // Load logo buffers
  const sealLogoPath = path.join(__dirname, '..', 'public', 'images', 'guru-nanak-seal-clean.png');
  const gnJerbiLogoPath = path.join(__dirname, '..', 'public', 'images', 'gn-jerbi-logo-tight.png');
  const dstLogoPath = path.join(__dirname, '..', 'public', 'images', 'dst-nidhi-logo.png');

  const sealLogoBuffer = fs.existsSync(sealLogoPath) ? fs.readFileSync(sealLogoPath) : null;
  const gnJerbiLogoBuffer = fs.existsSync(gnJerbiLogoPath) ? fs.readFileSync(gnJerbiLogoPath) : null;
  const dstLogoBuffer = fs.existsSync(dstLogoPath) ? fs.readFileSync(dstLogoPath) : null;

  // 1. Executive Header Layout
  const headerTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [2000, 6400, 2000],
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Left: Guru Nanak Seal Logo
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            borders: noBorder,
            verticalAlign: VerticalAlign.CENTER,
            margin: defaultCellMargin,
            children: [
              ...(sealLogoBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: sealLogoBuffer,
                          transformation: { width: 95, height: 95 },
                          type: 'png',
                        }),
                      ],
                    }),
                  ]
                : []),
            ],
          }),

          // Center: Logos and Institutional Headings
          new TableCell({
            width: { size: 6400, type: WidthType.DXA },
            borders: noBorder,
            verticalAlign: VerticalAlign.CENTER,
            margin: defaultCellMargin,
            children: [
              ...(dstLogoBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: dstLogoBuffer,
                          transformation: { width: 155, height: 42 },
                          type: 'png',
                        }),
                      ],
                    }),
                  ]
                : []),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 20 },
                children: [
                  new TextRun({
                    text: 'GURU NANAK BIDRI ART',
                    bold: true,
                    size: 28, // 14pt
                    color: '0B2545',
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: 'SKILL DEVELOPMENT CENTER',
                    bold: true,
                    size: 22, // 11pt
                    color: '133E87',
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 20 },
                children: [
                  new TextRun({
                    text: 'GN JERBI Foundation',
                    bold: true,
                    size: 20, // 10pt
                    color: '8C641C',
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: 'NIDHI DST iTBI Center',
                    bold: true,
                    size: 18, // 9pt
                    color: '8C641C',
                    font: 'Arial',
                  }),
                ],
              }),
              ...(gnJerbiLogoBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: gnJerbiLogoBuffer,
                          transformation: { width: 140, height: 46 },
                          type: 'png',
                        }),
                      ],
                    }),
                  ]
                : []),
            ],
          }),

          // Right: Passport Photo Frame
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            borders: cellBorder,
            verticalAlign: VerticalAlign.CENTER,
            shading: { fill: 'FAFAFA', val: ShadingType.CLEAR, color: 'auto' },
            margin: { top: 120, bottom: 120, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Paste Recent\nPassport Size\nPhotograph\n\n(3.5 cm × 4.5 cm)',
                    size: 16,
                    font: 'Arial',
                    color: '4A5568',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 2. Application Banner Bar
  const appNoBar = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [5200, 5200],
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 5200, type: WidthType.DXA },
            shading: navyBannerShading,
            borders: cellBorder,
            margin: { top: 90, bottom: 90, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'ENROLLMENT APPLICATION FORM',
                    bold: true,
                    color: 'FFFFFF',
                    size: 21,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 5200, type: WidthType.DXA },
            borders: noBorder,
            verticalAlign: VerticalAlign.CENTER,
            margin: defaultCellMargin,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Application No.: _________________    Date: ______________',
                    size: 18,
                    bold: true,
                    font: 'Arial',
                    color: '1A202C',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 3. Section 1: Personal Information Table
  const personalInfoTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [2600, 2600, 2000, 3200],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Full Name (In Capitals)', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Date of Birth', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: "Father's / Guardian's Name", bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Gender', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: '☐ Male     ☐ Female     ☐ Other', size: 18 })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Marital Status', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Nationality', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Indian', size: 18 })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Aadhaar Number', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'PAN Number (If any)', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Mobile Number', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Email ID', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'WhatsApp Number (If different)', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 7800, type: WidthType.DXA },
            columnSpan: 3,
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
    ],
  });

  // 4. Section 2: Address Details Table
  const addressTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [2600, 2600, 2000, 3200],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Permanent Address', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 7800, type: WidthType.DXA },
            columnSpan: 3,
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'City / Town', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'District', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'State', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'PIN Code', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'Correspondence Address\n(If different from above)', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 7800, type: WidthType.DXA },
            columnSpan: 3,
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'City / Town', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'District', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'State', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 2600, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            shading: labelShading,
            margin: defaultCellMargin,
            children: [new Paragraph({ children: [new TextRun({ text: 'PIN Code', bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 3200, type: WidthType.DXA },
            margin: defaultCellMargin,
            children: [new Paragraph({ text: '' })],
          }),
        ],
      }),
    ],
  });

  // 5. Emergency Contact (2) & KYC Details (4)
  const emergencyAndKycTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [5100, 200, 5100],
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Emergency
          new TableCell({
            width: { size: 5100, type: WidthType.DXA },
            children: [
              new Table({
                width: { size: 5100, type: WidthType.DXA },
                columnWidths: [2400, 2700],
                borders: cellBorder,
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 5100, type: WidthType.DXA },
                        columnSpan: 2,
                        shading: goldBannerShading,
                        margin: { top: 100, bottom: 100, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: '2. EMERGENCY CONTACT DETAILS', bold: true, color: 'FFFFFF', size: 19 })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Contact Person Name', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2700, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Relationship', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2700, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Mobile Number', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2700, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Alternate Mobile', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2700, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: noBorder, children: [new Paragraph({ text: '' })] }),

          // KYC
          new TableCell({
            width: { size: 5100, type: WidthType.DXA },
            children: [
              new Table({
                width: { size: 5100, type: WidthType.DXA },
                columnWidths: [2000, 3100],
                borders: cellBorder,
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 5100, type: WidthType.DXA },
                        columnSpan: 2,
                        shading: goldBannerShading,
                        margin: { top: 100, bottom: 100, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: '4. KYC / ID DETAILS (Attach Copy)', bold: true, color: 'FFFFFF', size: 19 })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Aadhaar Number', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'ID Proof Type', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Aadhaar   ☐ PAN   ☐ Voter ID\n☐ Passport  ☐ DL    ☐ Other', size: 16 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'ID Proof Number', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Document Status', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Self-Attested Copy Attached', size: 16, italics: true })] })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 6. Section 3: Educational Details Table
  const eduQualifications = [
    '10th / Equivalent',
    '12th / Equivalent',
    'Diploma / ITI (If any)',
    'Graduation (If any)',
    'Post Graduation (If any)',
  ];

  const educationTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [2800, 3800, 1900, 1900],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 2800, type: WidthType.DXA }, shading: tableHeaderShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Qualification', bold: true, size: 18 })] })] }),
          new TableCell({ width: { size: 3800, type: WidthType.DXA }, shading: tableHeaderShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Board / University', bold: true, size: 18 })] })] }),
          new TableCell({ width: { size: 1900, type: WidthType.DXA }, shading: tableHeaderShading, margin: defaultCellMargin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Year of Passing', bold: true, size: 18 })] })] }),
          new TableCell({ width: { size: 1900, type: WidthType.DXA }, shading: tableHeaderShading, margin: defaultCellMargin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Percentage / CGPA', bold: true, size: 18 })] })] }),
        ],
      }),
      ...eduQualifications.map(
        (qual) =>
          new TableRow({
            children: [
              new TableCell({ width: { size: 2800, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: qual, bold: true, size: 17 })] })] }),
              new TableCell({ width: { size: 3800, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
              new TableCell({ width: { size: 1900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
              new TableCell({ width: { size: 1900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
            ],
          })
      ),
    ],
  });

  // 7. Training & Tech Skills side-by-side
  const trainingAndTechTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [5100, 200, 5100],
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Training
          new TableCell({
            width: { size: 5100, type: WidthType.DXA },
            children: [
              new Table({
                width: { size: 5100, type: WidthType.DXA },
                columnWidths: [2200, 2900],
                borders: cellBorder,
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 5100, type: WidthType.DXA },
                        columnSpan: 2,
                        shading: goldBannerShading,
                        margin: { top: 100, bottom: 100, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: '6. TRAINING INTEREST & EXPERIENCE', bold: true, color: 'FFFFFF', size: 19 })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2200, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Course Level', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Basic   ☐ Intermediate   ☐ Advanced', size: 16 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2200, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Batch Timing', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Morning  ☐ Afternoon\n☐ Evening  ☐ Weekend', size: 16 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2200, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Prior Experience?', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Yes       ☐ No', size: 16 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2200, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'If Yes, Details', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2200, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Source of Info', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 2900, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: noBorder, children: [new Paragraph({ text: '' })] }),

          // Tech Skills
          new TableCell({
            width: { size: 5100, type: WidthType.DXA },
            children: [
              new Table({
                width: { size: 5100, type: WidthType.DXA },
                columnWidths: [2000, 3100],
                borders: cellBorder,
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 5100, type: WidthType.DXA },
                        columnSpan: 2,
                        shading: goldBannerShading,
                        margin: { top: 100, bottom: 100, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: '7. TECHNOLOGY & SKILLS (Optional)', bold: true, color: 'FFFFFF', size: 19 })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Interested in', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ CAD / Design Software\n☐ 3D Printing Prototyping\n☐ CNC / Laser Engraving\n☐ Digital Marketing for Artisans\n☐ Entrepreneurship / Startup', size: 16 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 2000, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Computer Skills', bold: true, size: 17 })] })] }),
                      new TableCell({ width: { size: 3100, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Yes       ☐ No', size: 16 })] })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 8. Section 8: Declaration
  const declarationTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [tableWidth],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: tableWidth, type: WidthType.DXA },
            shading: goldBannerShading,
            margin: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [new Paragraph({ children: [new TextRun({ text: '8. DECLARATION', bold: true, color: 'FFFFFF', size: 20 })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: tableWidth, type: WidthType.DXA },
            margin: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of my application.\nI agree to abide by the rules, regulations, and code of conduct of the Guru Nanak Bidri Art Skill Development Center.',
                    size: 17,
                    italics: true,
                    color: '2D3748',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: 'Place: ________________________    Date: ________________________        Signature of Applicant: ________________________',
                    size: 18,
                    bold: true,
                    color: '1A202C',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 9. Section 9: Documents Checklist
  const checklistTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [5200, 5200],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: tableWidth, type: WidthType.DXA },
            columnSpan: 2,
            shading: goldBannerShading,
            margin: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [new Paragraph({ children: [new TextRun({ text: '9. DOCUMENTS CHECKLIST (Attach Self Attested Copies)', bold: true, color: 'FFFFFF', size: 20 })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Recent Passport Size Photo (2 Nos.)', size: 17 })] })] }),
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Aadhaar Card Copy', size: 17 })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Educational Certificates', size: 17 })] })] }),
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Address Proof', size: 17 })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ ID Proof (PAN / Voter ID / DL / Passport)', size: 17 })] })] }),
          new TableCell({ width: { size: 5200, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Other (If any): _____________________', size: 17 })] })] }),
        ],
      }),
    ],
  });

  // 10. Office Use Only Table
  const officeUseTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [2600, 2600, 2600, 2600],
    borders: cellBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: tableWidth, type: WidthType.DXA },
            columnSpan: 4,
            shading: navyBannerShading,
            margin: { top: 90, bottom: 90, left: 140, right: 140 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'FOR OFFICE USE ONLY', bold: true, color: 'FFFFFF', size: 20 })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Application Received On:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Verified By:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Documents Verified:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Yes     ☐ No', size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Eligibility Status:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: '☐ Eligible  ☐ Not Eligible', size: 17 })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Approved By:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Batch Allotted:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Enrollment Date:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ text: '' })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: labelShading, margin: defaultCellMargin, children: [new Paragraph({ children: [new TextRun({ text: 'Signature & Seal:', bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 2600, type: WidthType.DXA }, margin: defaultCellMargin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '(Authorized Signatory)', size: 15, italics: true, color: '718096' })] })] }),
        ],
      }),
    ],
  });

  // Footer text
  const footerParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 20 },
      children: [
        new TextRun({
          text: 'GN JERBI Foundation NIDHI DST iTBI Center',
          bold: true,
          size: 19,
          font: 'Arial',
          color: '0B2545',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: 'Guru Nanak Dev Engineering College Campus, Mailoor Road, Bidar – 585403, Karnataka, India.',
          size: 16,
          font: 'Arial',
          color: '4A5568',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '📞 08482-236478    |    ✉ info@gnjerbif.org    |    🌐 www.gnjerbif.org',
          size: 16,
          bold: true,
          font: 'Arial',
          color: '2B6CB0',
        }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: [
          headerTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          appNoBar,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          createSectionBanner('1. PERSONAL INFORMATION'),
          personalInfoTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          createSectionBanner('2. ADDRESS DETAILS'),
          addressTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          emergencyAndKycTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          createSectionBanner('3. EDUCATIONAL DETAILS'),
          educationTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          trainingAndTechTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          declarationTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          checklistTable,
          new Paragraph({ spacing: { before: 90, after: 90 }, text: '' }),
          officeUseTable,
          ...footerParagraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath1 = path.join(__dirname, '..', 'Guru_Nanak_Bidri_Art_Enrollment_Form.docx');
  const outPath2 = path.join(__dirname, '..', 'public', 'Guru_Nanak_Bidri_Art_Enrollment_Form.docx');
  const outPath3 = path.join(__dirname, '..', 'Guru_Nanak_Bidri_Art_Enrollment_Form_Official.docx');

  fs.writeFileSync(outPath2, buffer);
  fs.writeFileSync(outPath3, buffer);
  try {
    fs.writeFileSync(outPath1, buffer);
  } catch (e) {
    console.warn('Root file locked, written to public/ and _Official.docx');
  }
  console.log('Successfully generated high-legibility professional docx with optimized header and logos!');
}

generateEnrollmentDocx().catch((err) => {
  console.error('Error creating docx:', err);
  process.exit(1);
});
